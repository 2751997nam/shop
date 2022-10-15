productPageModule.controller('MultipleSizeController', MultipleSizeController);

function MultipleSizeController($scope, $http, $rootScope) {
    $scope.productSkus = [];
    $scope.variants = [];
    $scope.gallery = multiSizeGallery;
    $scope.title = '';
    $scope.cartItems = [];
    $scope.quantiyOptions = [1, 2, 3, 4, 5, 10, 20, 30, 40, 50];
    $scope.multiSizeText = multiSizeText;

    $scope.resetData = function () {
        $scope.cartItems = [
            {
                productSku: null,
                sizeVariant: null,
                colorVariant: null,
                selectedSize: null,
                selectedColor: null,
                quantity: 1
            }
        ]
    }
    $scope.isInited = false;
    $scope.initialize = function () {
        $scope.resetData();
        if (window.globalVariants && window.globalVariants.productVariants) {
            $scope.isInited = true;
            $scope.productSkus = window.globalVariants.productVariants;
            $scope.variants = window.globalVariants.variants;

            $scope.buildProductSkuById();
            $scope.buildCurrentSku();
            $scope.rebuildVariants(0);
        } 
    }

    $scope.getProductVariants = function () {
        return $http.get($scope.buildUrl("/product/variant?id=" + $("#productId").val()))
            .then(res => {
                if (res.data.status == 'successful') {
                    $scope.productSkus = res.data.result.productVariants;
                    $scope.variants = res.data.result.variants;
                    $scope.buildProductSkuById();
                    $scope.buildCurrentSku();
                    $scope.rebuildVariants(0);
                }
            })
    }

    $scope.buildProductSkuById = function () {
        let productSkuById = {};
        let productSkuByUniqKey = {};
        if ($scope.productSkus) {
            $scope.productSkus.forEach(function (item) {
                productSkuById[item.id] = item;
                let variantOptionIds = [];
                item.variants.forEach(function (it) {
                    variantOptionIds.push(it.id);
                });
                if (variantOptionIds.length > 0) {
                    var permutes = permute(variantOptionIds);
                    for (var i = 0; i < permutes.length; i++) {
                        var key = permutes[i].join("-");
                        productSkuByUniqKey[key] = item;
                    }
                }
            });
        }
        $scope.productSkuById = productSkuById;
        $scope.productSkuByUniqKey = productSkuByUniqKey;
    }

    $scope.buildCurrentSku = function (cartItem) {
        let spid = $('#productSkuId').val();
        let productSku = $scope.productSkus.find(item => item.id == spid);
        if (!productSku) {
            productSku = $scope.productSkus.find(item => parseInt(item.is_default));
        }
        $scope.cartItems[0].productSku = productSku;
    }

    $scope.safeApply = function (fn) {
        $scope.$$phase || $scope.$root.$$phase ? fn() : $scope.$apply(fn);
    };

    $scope.rebuildVariants = (cartItemIndex) => {
        if (!$scope.cartItems[cartItemIndex]) {
            return;
        }
        if (!$scope.cartItems[cartItemIndex].productSku) {
            $scope.cartItems[cartItemIndex].productSku = $scope.productSkus[0];
        }
        $scope.cartItems[cartItemIndex].selectedColor = $scope.cartItems[cartItemIndex].productSku.variants.find(item => item.variant_id == 2);
        $scope.cartItems[cartItemIndex].selectedSize = $scope.cartItems[cartItemIndex].productSku.variants.find(item => item.variant_id == 1);

        for (let index = 0; index < $scope.variants.length; index++) {
            if ($scope.variants[index].slug == 'size' || $scope.variants[index].slug == 'color') {
                const variant = angular.copy($scope.variants[index]);
                let optionGroup = [];

                let anotherVariant = $scope.cartItems[cartItemIndex].productSku.variants.filter(i => i.variant_id != variant.id);
                let variantKey = "";
                anotherVariant.forEach(t => {
                    variantKey += t.id + "-";
                });

                variant.values.forEach(item => {
                    let itemVariantKey = variantKey + item.id;
                    if (
                        $scope.productSkuByUniqKey[itemVariantKey] &&
                        $scope.productSkuByUniqKey[itemVariantKey].id
                    ) {
                        item.title = item.name + ` (${$scope.formatPrice($scope.productSkuByUniqKey[itemVariantKey].price)})`;
                        item.product_sku = $scope.productSkuByUniqKey[itemVariantKey];
                        if (variant.slug == 'color' && !item.image_url) {
                            item.image_url = item.product_sku.image_url;
                        }
                        if ($scope.cartItems[cartItemIndex].selectedSize && item.id == $scope.cartItems[cartItemIndex].selectedSize.id) {
                            $scope.cartItems[cartItemIndex].selectedSize.title = item.title;
                        }
                        optionGroup.push(item);
                    }
                });

                variant.options = optionGroup;
                if (variant.slug == 'size') {
                    $scope.cartItems[cartItemIndex].sizeVariant = variant;
                } else if (variant.slug == 'color') {
                    $scope.cartItems[cartItemIndex].colorVariant = variant;
                }
            }
        }
        $scope.changeGallery($scope.cartItems[cartItemIndex].productSku);
    }

    $scope.getImageCdn = function ($url, $width = 0, $height = 0, $fitIn = true) {
        // return 0;
        if (!$url) return "";
        if ($url.includes('liveview')) {
            return $url.replace('/image/', '/image/1000x1000/');
        }
        if (typeof multiSizeCdnIgnoreUrl !== 'undefined') {
            for (let item of multiSizeCdnIgnoreUrl) {
                if ($url.includes(item)) {
                    return $url;
                }
            }
        }
        if (typeof multiSizeCdnAllowUrl !== 'undefined') {
            let check = false;
            for (let item of multiSizeCdnAllowUrl) {
                if ($url.includes(item)) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                return $url;
            }
        }
        if (($width == 1260 && $height == 0) || ($width == 0 && $height == 0)) {
            return $url;
        }
        let retval;
        let originUrl = $url;
        if (originUrl.substr(0, 4) == 'http') {
            $url = $url.replace('https://', '');
            $url = $url.replace('http://', '');
        }
        if ($url.includes('?')) {
            $url = encodeURIComponent($url);
        }
        // return $url;

        retval =  multiSizeBaseCdnUrl + "/" + $url;

        if ($width == 0 && $height == 0) {
            retval =  multiSizeBaseCdnUrl + "/" + $url;
        } else if ($width == 0 || $height == 0) {
            retval = multiSizeBaseCdnUrl + "/" + $width + "x" + $height + "/" + $url;
        } else {
            retval = multiSizeBaseCdnUrl + "/fit-in/" + $width + "x" + $height + "/filters:fill(fff)/" + $url;
        }
        return retval;
    }

    $scope.changeProductSku = function () {
        $scope.resetData();
        let spid = $('#productSkuId').val();
        let productSku = $scope.productSkus.find(item => item.id == spid);
        if (!productSku) {
            productSku = $scope.productSkus.find(item => parseInt(item.is_default));
        }

        if (productSku && productSku.variants) {
            $scope.title = '';
            let optionNames = [];
            for (let item of productSku.variants) {
                if (item.variant_id > 2) {
                    optionNames.push(item.variant + ': ' + item.name);
                }
            }

            $scope.title = optionNames.join(', ');
            $scope.cartItems[0].productSku = productSku;
            $scope.safeApply(function () {
                $scope.rebuildVariants(0);
            });
        }

    }

    $scope.changeGallery = function (productSku) {
        if (productSku && productSku.gallery && productSku.gallery.length) {
            $scope.gallery = productSku.gallery;
            let galleryElements = '';
            for (let img of $scope.gallery) {
                galleryElements += `
                <div class="multiple-slider-item">
                    <picture>
                        <source media="(min-width: 1030px)" data-srcset="${$scope.getImageCdn(img, 1260, 0, false, true)}" />
                        <source media="(min-width: 1000px) and (max-width: 1030px)" data-srcset="${$scope.getImageCdn(img, 1116, 0, true, true)}" />
                        <source media="(min-width: 760px) and (max-width: 1000px)" data-srcset="${$scope.getImageCdn(img, 846, 0, true, true)}" />
                        <source media="(min-width: 370px) and (max-width: 760px)" data-srcset="${$scope.getImageCdn(img, 828, 0, false, true)}" />
                        <source media="(min-width: 320px) and (max-width: 370px)" data-srcset="${$scope.getImageCdn(img, 360, 340, false, true)}" />
                        <img src="/images/blank.gif"/>
                    </picture>
                </div>`;
            }

            let dom = `
                <div class="multiple-slider">
                    ${galleryElements}
                </div>
            `;
            $('.multiple-gallery').html(dom);
            $('.multiple-slider').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: false,
                autoplaySpeed: 2000,
                infinite: false,
            });

            imageObserver(document.querySelectorAll('.multiple-gallery img'));

        }
    }


    function imageObserver(images) {
        const observer = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const image = entry.target;

                    if (image.parentElement.tagName === 'PICTURE') {
                        let sources = image.parentElement.getElementsByTagName('source');
                        for (let i = 0; i < sources.length; i++) {
                            sources[i].srcset = sources[i].dataset.srcset;
                        }
                    } else {
                        image.src = image.dataset.src;
                    }
                    image.classList.remove("lazy");

                    observer.unobserve(image);
                }
            });
        });

        images.forEach(function (image) {
            observer.observe(image);
        });
    }


    $scope.selectColor = function (index, color) {
        $scope.cartItems[index].selectedColor = color;
        $scope.cartItems[index].productSku = color.product_sku;
        $scope.safeApply(function () {
            $scope.rebuildVariants(index);
        })
        $('.bulk-ordering-dialog-choose').removeClass('product-size-focus');
    }

    $scope.selectSize = function (index, size) {
        $scope.cartItems[index].selectedSize = size;
        $scope.cartItems[index].productSku = size.product_sku;
        $scope.safeApply(function () {
            $scope.rebuildVariants(index);
        })

        $('.bulk-ordering-dialog-choose').removeClass('product-size-focus');
    }

    $scope.setQuantity = function (index, value) {
        value = value ? (value <= 100 ? value : 100) : 1;
        $scope.cartItems[index].quantity = value;
        $scope.cartItems[index].tempQuantity = value;
        $('.bulk-ordering-dialog-choose').removeClass('product-size-focus');
    }

    $scope.addCartItem = function () {
        let spid = $('#productSkuId').val();
        let productSku = $scope.productSkus.find(item => item.id == spid);
        let cartItem = {
            productSku: productSku,
            sizeVariant: null,
            colorVariant: null,
            selectedSize: null,
            selectedColor: null,
            quantity: 1
        };

        $scope.cartItems.push(cartItem);
        $scope.rebuildVariants($scope.cartItems.length - 1);
    }

    $scope.removeItem = function (index) {
        $scope.cartItems.splice(index, 1);
    }

    $scope.formatCurrency = function(price, desSep = ',', groupSep = '.', number = 0) {
        if (price != parseFloat(price)) {
            price = 0;
        }
        var newstr = '';
        price = parseFloat(price);
        var p = price.toFixed(number).split(".");
        var chars = p[0].split("").reverse();
        var count = 0;
        for (let x = 0; x < chars.length; x++) {
            count++;
            if (count % 3 == 1 && count != 1) {
                newstr = chars[x] + groupSep + newstr;
            } else {
                newstr = chars[x] + newstr;
            }
        }

        if (p.length > 1) {
            newstr += desSep + p[1];
        } else if (number > 0) {
            newstr += desSep;
            for (let i = 0; i < number; i++) {
                newstr += '0';
            }
        }

        return newstr;
    }

    $scope.formatPrice = function(price, numberAdd = 1, format = true) {
        let template = typeof multiSizeCurrencyTemplate != 'undefined' ? multiSizeCurrencyTemplate : '${money}{.}{2}';
        if (format && price != 0) {
            if (typeof multiSizePriceConfig !== 'undefined' && multiSizePriceConfig) {
                price = (parseFloat(price) + parseFloat(multiSizePriceConfig.adding_price) * numberAdd) * parseFloat(multiSizePriceConfig.ratio);
            }
            let matches = template.match(/{money}{([^a-zA-z0-9]+)}{([0-9]+)}/);
            let afterComa = -2;
            if (matches.length == 3) {
                afterComa = parseInt(matches[2] * (matches[2] ? -1 : 1));
            }
            price = $scope.decimalAdjustBase('ceil', price, afterComa);
        }
        return formatPrice(price, template);
        
    };

    $scope.decimalAdjustBase = function (type, value) {
        let matches = priceTempate.match(/{money}{([^a-zA-z0-9]+)}{([0-9]+)}/);
        let exp = -2;
        if (matches.length == 3) {
            exp = parseInt(matches[2] * (matches[2] ? -1 : 1));
        }
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    $scope.addAllToCart = function (event) {
        event.preventDefault();
        let data = [];
        for (let item of $scope.cartItems) {
            data.push({
                productId: item.productSku.product_id,
                productSkuId: item.productSku.id,
                quantity: item.quantity,
                configurations: null
            });
        }

        $('#js-add-all-to-cart').attr("disabled", "disabled");
        $('#js-add-all-to-cart').addClass("is-loading");
        $('#js-add-all-to-cart').find(".add-to-cart-content").hide();
        $('#js-add-all-to-cart').find(".loading-content").show();

        $http.post($scope.buildUrl('/cart/add-all-to-cart'), {
            data: data
        }).then(function (response) {
            if (response.data.status == 'successful') {
                var locale = '';
                if (typeof localePrefix !== 'undefined' && localePrefix !== '') {
                    locale = '/' + localePrefix;
                }
                window.location.href = locale + '/cart';
            } else {
                toastr.error('Fail. Try again later');
            }

            $('#js-add-all-to-cart').toggleClass("is-loading");
            $('#js-add-all-to-cart').toggleClass("is-added");
            $('#js-add-all-to-cart').find(".loading-content").hide();
            $('#js-add-all-to-cart').find(".added-to-cart-content").show();
            setTimeout(() => {
                $('#js-add-all-to-cart').toggleClass("is-added");
                $('#js-add-all-to-cart').removeAttr("disabled");
                $('#js-add-all-to-cart').find(".added-to-cart-content").hide();
                $('#js-add-all-to-cart').find(".add-to-cart-content").show();
            }, 2000);
        })
    }

    $scope.buildUrl = function (url) {
        if (localePrefix) {
            url = '/' + localePrefix + url;
        }

        return url;
    }

    window.addEventListener('variantChanged', function (event) {
        $scope.$apply(function () {
            if (window.globalVariants && window.globalVariants.productVariants) {
                $scope.initialize();
            }
            $scope.changeProductSku();
        })
    })

    $(document).on('click', '.open-multiple-size', function () {
        if (!(window.globalVariants && window.globalVariants.productVariants)) {
            $scope.resetData();
            $scope.getProductVariants();
        } else if (!$scope.isInited) {
            $scope.initialize();
            $scope.changeProductSku();
        }
    })
}
