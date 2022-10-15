var app = angular.module("GiftCard", ["ngSanitize"]).filter("safeHtml", function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});
toastr.options = {
    "autoDismiss": true,
    "preventDuplicates": true,
    "debug": false,
    "positionClass": "toast-bottom-right",
    "onclick": null,
    "fadeIn": 300,
    "fadeOut": 1000,
    "timeOut": 3000,
    "extendedTimeOut": 1000
};
app.controller("GiftCardController", function($scope, $http) {
    $scope.product = {};
    $scope.variants = [];
    $scope.productVariants = [];
    $scope.isShowAllVarriant = false;

    $scope.getProduct = (productId) => {
        return new Promise(function(resolve) {
            let url = "/bought-together/product/find?product_id=" + productId;
            if (localePrefix) url = '/' + localePrefix + url;
            $http({
                method: "GET",
                url: url,
            }).then(function successCallback(response) {
                if (response.data.status == "successful") {
                    $scope.product = response.data.result;
                    resolve();
                }
            }).catch(function errorCallback() {
                resolve();
            });
        });
    }

    $scope.changeVariant = (productId) => {
        return new Promise(function(resolve) {
            let url = "/bought-together/product-variant?id=" + productId;
            if (localePrefix) url = '/' + localePrefix + url;
            $http({
                method: "GET",
                url: url,
            }).then(function successCallback(response) {
                if (response.data.status == "successful") {
                    $scope.variants = response.data.result.variants;
                    $scope.productVariants = response.data.result.productVariants;
                    $scope.productVariants.sort((a, b) => (parseInt(a.price) > parseInt(b.price)) ? 1 : -1);
                    $scope.currentVariant = $scope.productVariants[0];
                    if ($scope.productVariants.length <= 5) {
                        $scope.isShowAllVarriant = true;
                    }
                    resolve();
                }
            }).catch(function errorCallback() {
                resolve();
            });
        });
    }

    $scope.selectVariant = (item) => {
        $scope.currentVariant = item;
    }

    $scope.showAllVarriant = () => {
        $scope.isShowAllVarriant = true;
    }

    function compare( a, b ) {
        if ( a.last_nom < b.last_nom ){
          return -1;
        }
        if ( a.last_nom > b.last_nom ){
          return 1;
        }
        return 0;
    }

    $scope.formatPrice = function (price) {
        return formatPrice(price, priceTempate);
    };

    $scope.addToCart = () => {
        $scope.loading = true;
        let productSku = $scope.currentVariant.id;
        let cartData = {
            productId: $scope.currentVariant.product_id,
            productSkuId: productSku,
            quantity: 1,
        };
        var addCartReqParams = {
            url: '/cart/add-to-cart',
            method: 'POST',
            data: cartData
        };
        $http(addCartReqParams).then(async (response) => {
            if (response.data.status == "successful") {
                localStorage.setItem("change-cart", Date.now());
                getCartItems();
                $scope.showCartPopup(response.data.cartItems);
                $scope.loading = false;
            }
        })
    }

    $scope.showCartPopup = (cartItems) => {
        var addItem = {};
        cartItems.forEach((element) => {
            if (element.product_id == $scope.currentVariant.product_id && element.product_sku_id == $scope.currentVariant.id) {
                addItem = element;
            }
        })
        $scope.showMiniCart(addItem);
    }

    $scope.showMiniCart = (addItem) => {
        var locale = '';
        if (typeof localePrefix !== 'undefined' && localePrefix !== '') {
            locale = '/' + localePrefix;
        }
        if (addItem) {
            let miniCartHtml = "";
            let image = addItem.image_url;
            if (!image) {
                image = "https://printerval.com/images/official.png";
            }
            miniCartHtml += `
                <div class="mini-shopping-cart-image-box">
                    <span class="mini-shopping-cart-check">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                        </svg>
                    </span>
                    <img class="mini-shopping-cart-image" src="${getImageCdn(image, 630, 630)}" />
                </div>
                <div class="mini-shopping-cart-title flex-b column">
                    <div>${addedMessage}</div>
                    <span class="js-shopping-cart-title">${addItem.product_name}</span>
                </div>
                <a href="${locale}/cart" class="view-cart-button" type="button">${viewCartMessage}</a>
            `;
            $(".mini-shopping-wrapper").toggleClass("active");
            $("#mini-shopping-cart").html(miniCartHtml);
            setTimeout(() => {
                $(".mini-shopping-wrapper").toggleClass("active");
            }, 5000);
        }
    }

    function getCartItems() {
        var locale = '';
        if (typeof localePrefix !== 'undefined' && localePrefix !== '') {
            locale = '/' + localePrefix;
        }
        var getCartReqParams = {
            url: '/cart/get-cart-items',
            method: 'GET'
        };
        $.ajax(getCartReqParams)
            .done(function(result) {
            if (result.status == 'successful' && result.result.length) {
                $("#list-cart-items").html("");
                $(".mini-cart-list").show();
                $("#cart-error").hide();
                localStorage.setItem("cart-item", result.result.length);
                var html = "";
                var quantity = 0;
                result.result.forEach((element) => {
                    quantity += parseInt(element.quantity);
                    html += `
                        <a class="mini-cart-item flex-box" href="${locale}${element.url}">
                            <img src="${getImageCdn(element.image_url, 130, 0)}" alt="">
                            <div class="mini-cart-content">
                                <div class="mini-cart-head">
                                    ${element.product_name}
                                </div>
                                <div class="mini-cart-info flex-box align-c ">
                                    <span class="new-price">${element.display_price}
                    `;
                    if (element.high_price && element.high_price > element.price) {
                        html += `<span class="discount-price" style="text-decoration: line-through;">${formatPrice(element.high_price, priceTempate)}</span>`
                    }
                    html += `</span><span style"color: red;">&times;</span>
                                        <span class="quantity-mini-cart"> ${element.quantity}</span>
                                    </div>
                                </div>
                            </a>
                    `;
                });
                $("#list-cart-items").append(html);
                $(".js-mini-cart-count").text(parseInt(quantity));
                if (parseInt(quantity) > 0) {
                    $(".js-mini-cart-count").show();
                }
                $(".cart-icon").replaceWith($(".cart-icon").clone());
                $(".cart-icon").click(function(event) {
                    event.stopPropagation();
                    $(".mini-cart-contain").toggle();
                    $("#list-cart-items").html("");
                    $("#cart-error").hide();
                    if (parseFloat(quantity) > 0) {
                        $(".mini-cart-list").show();
                        $("#list-cart-items").append(html);
                    } else {
                        $("#cart-error").show();
                    }
                });
            }
        });
    }

    $scope.getImageCdn = function ($url, $width = 0, $height = 0, $fitIn = true, $webp = true) {
        $originUrl = $url;
        if ($url.substr(0, 4) == "http") {
            $url = $url.replace("https://", "");
            $url = $url.replace("http://", "");
        } else {
            $url = document.domain + $url;
        }
        $url = encodeURIComponent($url);
        if ($webp) {
            if (webpSupport) {
                $webp = true;
            } else {
                $webp = false;
            }
        }

        $baseCdnUrl = baseCdnUrl + "/";
        $fitIn = $fitIn && $width && $height;
        // $fitIn = false;
        if ($fitIn) {
            $baseCdnUrl += "fit-in/";
        }
        if ($width || $height) {
            $baseCdnUrl += $width + "x" + $height + "/";
        }
        if ($fitIn || $webp) {
            $baseCdnUrl += "filters";
        }
        if ($fitIn) {
            $baseCdnUrl += ":fill(fff)";
        }
        if ($webp) {
            $baseCdnUrl += ":format(webp)";
        }
        if ($fitIn || $webp) {
            $baseCdnUrl += "/";
        }
        $baseCdnUrl += $url;
        return $baseCdnUrl;
    };

    $scope.initial = async () => {
        let productid = $("#productId").val();
        await Promise.all([
            $scope.getProduct(productid),
            $scope.changeVariant(productid),
        ]);
    }

    $scope.initial();
});
