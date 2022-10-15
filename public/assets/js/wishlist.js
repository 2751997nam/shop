var wishlistModule = angular.module("wishlistModule", []);
wishlistModule.controller("wishlistController", function($scope, $http) {
    $scope.prefixLocaleUrl = prefixLocaleUrl;
    $scope.wishlistItems = [];
    $scope.existItemDontHaveConfigurations = false;
    $scope.existItemDontHaveDefaultVariant = false;
    $scope.title = title;
    $scope.loading = {
        addingAllToCart: false,
        addingToCart: {
            status: false,
            wishlistItemId: null,
        },
        gettingWishlistItems: false
    };
    $scope.mainProduct = {};
    $scope.currentItem = {};
    $scope.currentProduct = {};
    $scope.currentVariant = {};
    $scope.variantOptionSelected = {};
    $scope.variantImageSelected = {};
    $scope.variants = {};
    $scope.isLoading = false;
    $scope.totalPrice = 0;
    $scope.totalSavePrice = 0;
    $scope.loadingMakeChange = false;
    $scope.customer = {
        token: ""
    };
    $scope.ignoreOptionIds = ignoreOptionIds;
    $scope.cdnIgnoreUrl = cdnIgnoreUrl;
    $scope.cdnAllowUrl = cdnAllowUrl;

    $scope.getImageCdn = function ($url, $width = 0, $height = 0, $fitIn = true) {
        // return 0;
        if (!$url) return "";
        if (typeof $scope.cdnIgnoreUrl !== 'undefined') {
            for (let item of $scope.cdnIgnoreUrl) {
                if ($url.includes(item)) {
                    return $url;
                }
            }
        }
        if (typeof $scope.cdnAllowUrl !== 'undefined') {
            let check = false;
            for (let item of $scope.cdnAllowUrl) {
                if ($url.includes(item)) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                return $url;
            }
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

        retval =  baseCdnUrl + "/" + $url;

        if ($width == 0 && $height == 0) {
            retval =  baseCdnUrl + "/" + $url;
        } else if ($width == 0 || $height == 0) {
            retval = baseCdnUrl + "/" + $width + "x" + $height + "/" + $url;
        } else {
            retval = baseCdnUrl + "/fit-in/" + $width + "x" + $height + "/filters:fill(fff)/" + $url;
        }
        return retval;
    }

    $scope.getWishlistItems = function () {
        $scope.loading.gettingWishlistItems = true;
        $http.get("/get-wishlist-items")
        .then(function (response) {
                $scope.loading.gettingWishlistItems = false;

            
            if (response.status == 200) {
                $scope.wishlistItems = response.data.wishlistItems;
                $scope.existItemDontHaveConfigurations = response.data.existItemDontHaveConfigurations;
                $scope.existItemDontHaveDefaultVariant = response.data.existItemDontHaveDefaultVariant;
                $scope.wishlistItems.forEach(element => {
                    element.is_make_change = false;
                    element.variantName = "";
                    if (element.variant_default) {
                        if (element.variant_default.product_name.includes(element.product.name + ", ")) {
                            element.variantName = element.variant_default.product_name.replace(element.product.name + ", ", "");
                        }
                    }
                });
            }
        }).catch(function (error) {
            //
        });
    }

    $scope.removeWishlistItem = function (wishlistItemId, wishlistItemIndex) {
        $.ajax({
            type: "DELETE",
            url: '/remove-wishlist-item',
            data: {
                wishlistItemId: wishlistItemId
            },
            success: function (response) {
                if (response.status == 'successful') {
                    $scope.$apply(function () {
                        $scope.wishlistItems.splice(wishlistItemIndex, 1);
                    })
                    $scope.updateWishlistItemAmount($scope.wishlistItems.length);
                }
            },
            error: function (error) {
                //
            }
        });
    }

    $scope.updateWishlistItemAmount = function (newWishlistItemAmount) {
        if (newWishlistItemAmount) {
            $('#wishlist-count-item').text(newWishlistItemAmount);
            $('#wishlist-count-item').addClass('wishlist-count-item');
            $('.wishlist-add-all-to-cart').show();
            $('#empty-wishlist').hide();
        } else {
            $('#wishlist-count-item').text('');
            $('#wishlist-count-item').removeClass('wishlist-count-item');
            $('#empty-wishlist').show();
            $('.wishlist-add-all-to-cart').hide();
        }
    }

    $scope.getCustomerToken = () => {
        return new Promise(function (resolve) {
            $.ajax({
                type: "GET",
                url: '/cart/get-customer-token',
                success: function (response) {
                    resolve(response.result);
                },
                error: function (error) {
                    resolve();
                }
            });
        });
    }

    $scope.addToCart = async function (wishlistItem, wishlistItemIndex) {
        var token = await $scope.getCustomerToken();
        $scope.$apply(function () {
            $scope.loading.addingToCart.status = true;
            $scope.loading.addingToCart.wishlistItemId = wishlistItem.id;
        }) 

        $.ajax({
            type: "POST",
            url: '/cart/add-to-cart',
            data: {
                productId: wishlistItem.product_id,
                productSkuId: wishlistItem.product_sku_id,
                quantity: 1,
                customerToken: token,
                configurations: wishlistItem.configurations ? JSON.stringify(wishlistItem.configurations) : null
            },
            success: function (response) {
                $scope.loading.addingToCart = {
                    status: false,
                    wishlistItemId: null
                };
                if (response.status == 'successful') {
                    $scope.$apply(function () {
                        $scope.wishlistItems.splice(wishlistItemIndex, 1);
                    })

                    $scope.updateWishlistItemStatusToAdded(wishlistItem.id);

                    let wishlistItemAmount = parseInt($('#wishlist-count-item').text());
                    if (wishlistItemAmount - 1) {
                        $('#wishlist-count-item').text(wishlistItemAmount - 1);
                    } else {
                        $('#wishlist-count-item').text('');
                        $('#wishlist-count-item').removeClass('wishlist-count-item');
                        $('#empty-wishlist').show();
                        $('.wishlist-add-all-to-cart').hide();
                    }

                    let currentCartItemAmount = parseInt($('.js-mini-cart-count').text());
                    $('.js-mini-cart-count').text(currentCartItemAmount + 1);
                    $('.js-mini-cart-count').show();

                    $('.wishlist-mini-shopping-wrapper img').attr('src', wishlistItem.variant_default.image_url ? wishlistItem.variant_default.image_url : wishlistItem.product.image_url);
                    let cartText = wishlistItem.product.name;
                    if (wishlistItem.variantInfo.length) {
                        cartText += ',';
                        wishlistItem.variantInfo.forEach((item, index) => {
                            if (item.variant_slug == 'size') {
                                cartText += ' Size: ' + item.variant_option_name;
                            } else {
                                cartText += ' ' + item.variant_option_name;
                            }
                            if (index != wishlistItem.variantInfo.length - 1) {
                                cartText += ',';
                            }
                        });
                    }
                    $('.wishlist-js-shopping-cart-title').text(cartText);
                    $('.wishlist-mini-shopping-wrapper').toggleClass('active');
                    setTimeout(() => {
                        $(".wishlist-mini-shopping-wrapper").toggleClass("active");
                    }, 3000);
                }
            },
            error: function (error) {
                //
            }
        });
    }

    $scope.updateWishlistItemStatusToAdded = function (wishlistItemId) {
        $.ajax({
            type: "PUT",
            url: '/update-wishlist-item-status-to-added',
            data: {
                wishlistItemId: wishlistItemId,
            },
            success: function (data) {
                //
            },
            error: function (error) {
                //
            }
        });
    }

    $scope.addAllWishlistItemsToCart = function () {
        var productsInfo = [];
        var activeWishlistItemIds = [];

        $scope.wishlistItems.forEach((item, index) => {
            if (item.product.status == 'ACTIVE' 
                && !item.isCustomDesign 
                && (!item.variant_default || (item.variant_default && item.variant_default.status == 'ACTIVE'))) {
                productsInfo.push({
                    productId: item.product_id,
                    productSkuId: item.product_sku_id,
                    quantity: 1,
                    configurations: JSON.stringify(item.configurations)
                });
                activeWishlistItemIds.push(item.id);
            }
        });

        if (productsInfo.length) {
            $scope.loading.addingAllToCart = true;
            $.ajax({
                type: "POST",
                url: '/add-all-wishlist-items-to-cart',
                data: {
                    data: productsInfo
                },
                success: function (data) {
                    $scope.loading.addingAllToCart = false;

                    let tmpWishlistItems = [];
                    $scope.wishlistItems.forEach(item => {
                        if (!activeWishlistItemIds.includes(item.id)) {
                            tmpWishlistItems.push(item);
                        }
                    });
                    $scope.$apply(function () {
                        $scope.wishlistItems = tmpWishlistItems;
                    });

                    let currentWishlistItemAmount = parseInt($('#wishlist-count-item').text());
                    let wishlistItemAmount = currentWishlistItemAmount - productsInfo.length;
                    if (wishlistItemAmount) {
                        $('#wishlist-count-item').text(wishlistItemAmount);
                    } else {
                        $('#wishlist-count-item').text('');
                        $('#wishlist-count-item').removeClass('wishlist-count-item');
                        $('#empty-wishlist').show();
                    }
                    
                    if (!$scope.wishlistItems.length) {
                        $('.wishlist-add-all-to-cart').hide();
                    }

                    let currentCartItemAmount = parseInt($('.js-mini-cart-count').text());
                    $('.js-mini-cart-count').text(currentCartItemAmount + productsInfo.length);
                    $('.js-mini-cart-count').show();
                    $('#added-all-in-wishlist-to-cart').toggleClass('active');
                    setTimeout(() => {
                        $('#added-all-in-wishlist-to-cart').toggleClass("active");
                    }, 3000);
                },
                error: function (error) {
                    //
                }
            });
        }
    }

    $scope.setTitle = function () {
        $('title').text($scope.title);
    }
    $scope.setTitle();
    $scope.getWishlistItems();   
    
    $scope.openFormChangeVariant = async (item) => {
        if (item.product_sku_id) {
            $scope.loadingMakeChange = true;
            $scope.currentItem = item;
            $scope.currentProduct = {};
            $scope.currentVariant = item;
            $scope.variantOptionSelected = {};
            $scope.variantImageSelected = {};
            $scope.variants = {};
            $scope.products = {};
            $scope.variantBases = {};
            $scope.groupVariants = [];
            await Promise.all([
                $scope.getProduct(item),
                $scope.changeVariant(item),
            ]);
            $scope.wishlistItems.forEach(element => {
                if (element.id == item.id) {
                    element.temp_print_back = element.is_print_back;
                    element.temp_print_front = element.is_print_front;
                    element.is_make_change = true;
                    $scope.$apply();
                }
            });
            $('body').addClass('make-change-item-product');
            $scope.loadingMakeChange = false;
        }
    }

    $scope.getProduct = (item) => {
        return new Promise(function(resolve) {
            let url = "/product/find?id=" + item.product_id;
            // if (localePrefix) url = '/' + localePrefix + url;
            $http({
                method: "GET",
                url: url,
            }).then(function successCallback(response) {
                if (response.data.status == "successful") {
                    $scope.currentProduct = response.data.result;
                    $scope.wishlistItems.forEach(element => {
                        if (element.product.id == $scope.currentProduct.id) {
                            element.is_valid_print_back = $scope.currentProduct.is_valid_print_back;
                            if (element.is_valid_print_back) {
                                if (element.configurations.is_print_front) {
                                    element.is_print_front = true;
                                    element.is_print_back = false;
                                } else {
                                    element.is_print_back = true;
                                    element.is_print_front = false;
                                }
                            }
                        }
                    });
                    resolve();
                }
            }).catch(function errorCallback() {
                resolve();
            });
        });
    }

    $scope.getLoadingSvgClass = (item) => {
        let classSvg = "bi bi-arrow-repeat";
        if ($scope.loadingMakeChange && $scope.currentProduct && item.id == $scope.currentProduct.id) {
            classSvg += " loading";
        }
        return classSvg;
    }

    $scope.changeVariant = (item) => {
        return new Promise(function(resolve) {
            let url = "/product/variant?id=" + item.product_id;
            // if (localePrefix) url = '/' + localePrefix + url;
            $http({
                method: "GET",
                url: url,
            }).then(function successCallback(response) {
                if (response.data.status == "successful") {
                    $scope.variants = response.data.result;
                    $scope.variants.variants = $scope.initVariants($scope.variants.variants);
                    $scope.products = buildProductVariants();
                    $scope.variantBases = buildVariantBase();
                    if (item.currentVariant) {
                        $scope.currentVariant = item.currentVariant;
                    } else {
                        if ($scope.variants.variants.length > 0) {
                            if ($scope.products.productById[item.variant_default.id]) {
                                $scope.currentVariant = $scope.products.productById[item.variant_default.id];
                            } else {
                                $scope.currentVariant = $scope.products.productById[$scope.currentProduct.variant_default.id];
                            }
                        }
                    }
                    if ($scope.variants.variants.length > 0) {
                        $scope.variants.variants.forEach((element, index) => {
                            element.show_invalid = false;
                            if (index <= $scope.variants.variants.length - 3) {
                                element.show_invalid = true;
                            }
                        });
                        $scope.groupVariants = angular.copy($scope.variants.variants);
                        $scope.buildSelectedVariant();
                        $scope.rebuildVariants();
                    }
                    resolve();
                }
            }).catch(function errorCallback() {
                resolve();
            });
        });
    }

    $scope.initVariants = function (variants) {
        retVal = [];

        for (let variant of variants) {
            variant.values = variant.values.filter(value => !$scope.ignoreOptionIds.includes(parseInt(value.id)));
            retVal.push(variant);
        }

        return retVal;
    }

    $scope.buildSelectedVariant = () => {
        if ($scope.currentVariant && $scope.currentVariant.variants) {
            $scope.variants.variants.forEach(element => {
                let currentVariant = $scope.currentVariant.variants.find(i => i.variant_id == element.id);
                if (element.type == "OPTION") {
                    $scope.variantOptionSelected[element.id] = currentVariant.id;
                } else if (element.type == "IMAGE") {
                    $scope.variantImageSelected[element.id] = currentVariant.name;
                }
            });
        } else {
            $scope.currentVariant = $scope.currentProduct;
        }
    }

    $scope.rebuildVariants = (option = null) => {
        for (let index = 0; index < $scope.variants.variants.length; index++) {
            const variant = angular.copy($scope.variants.variants[index]);
            if (option && option.id && option.id == variant.id) {
                continue;
            }
            let anotherVariant = $scope.currentVariant.variants.filter(i => i.variant_id != variant.id);
            let variantKey = "";
            anotherVariant.forEach(t => {
                variantKey += t.id + "-";
            });
            let optionGroup = [];
            variant.values.forEach(item => {
                let itemVariantKey = variantKey + item.id;
                if (($scope.products.productByUniqId[itemVariantKey] && $scope.products.productByUniqId[itemVariantKey].id) || variant.show_invalid) {
                    optionGroup.push(item);
                }
            });
            $scope.groupVariants.forEach(item => {
                if (item.id == variant.id) {
                    item.values = optionGroup;
                }
            });
        }
    }

    $scope.selectVariant = (option, variant = null) => {
        let listOption = [];
        $scope.currentVariant.variants.forEach(element => {
            let isExists = false;
            for (let index = 0; index < option.values.length; index++) {
                const item = option.values[index];
                if (item.id == element.id) {
                    isExists = true;
                    break;
                }
            }
            if (!isExists) {
                listOption.push(element);
            }
        });
        let key = "";
        if (variant != null) {
            key = variant.id;
        } else {
            key = $scope.variantOptionSelected[option.id];
        }
        listOption.forEach(element => {
            key += "-" + element.id;
        });
        $scope.currentVariant = $scope.changeCurrentVariant(key, option, variant);
        $scope.buildSelectedVariant();
        $scope.rebuildVariants(option);
    }

    $scope.changeCurrentVariant = function (key, option, valueWantToChange) {
        if ($scope.products.productByUniqId[key]) {
            return $scope.products.productByUniqId[key];
        } else {
            if (valueWantToChange) {
                let optionIds = $scope.getOptionIds(key.split('-'), valueWantToChange);
                key = optionIds.join('-');
                if ($scope.products.productByUniqId[key]) {
                    return $scope.products.productByUniqId[key];
                }
            }
            let optionIds = key.split('-');
            for (let index = optionIds.length - 1; index > 0; index--) {
                let similarOptions = optionIds.slice(0, index);
                let similarKey = similarOptions.join('-');
                for (let uniqKey in $scope.products.productByUniqId) {
                    if (uniqKey.indexOf(similarKey) == 0 && $scope.products.productByUniqId[uniqKey].id) {
                        return $scope.products.productByUniqId[uniqKey];
                    }
                }
            }
        }
    }

    $scope.getOptionIds = function (optionIds, valueWantToChange, result = []) {
        result.push(valueWantToChange.id);
        if (valueWantToChange.options && valueWantToChange.options.length) {
            let option = valueWantToChange.options[0];
            let values = []
            for (let item of $scope.variants.variants) {
                if (item.id == option.variant_id) {
                    values = item.values;
                    break;
                }
            }
            let availableOptionIds = valueWantToChange.options.map(value => value.id);
            for (let item of values) {
                if (availableOptionIds.includes(item.id)) {
                    option = item;
                    break;
                }
            }

            for (let item of valueWantToChange.options) {
                if (optionIds.includes(item.id + '')) {
                    option = item;
                    break;
                }
            }
            result = $scope.getOptionIds(optionIds, option, result);
        }

        return result;
    }

    function buildVariantBase() {
        var retVal = {};
        var variantIds = [];
        var variantById = {};
        var variantOptionById = {};
        if ($scope.variants.variants) {
            for (var i = 0; i < $scope.variants.variants.length; i++) {
                variantIds.push($scope.variants.variants[i].id);
                variantById[$scope.variants.variants[i].id] = $scope.variants.variants[i].name;
                for (var j = 0; j < $scope.variants.variants[i].values.length; j++) {
                    variantOptionById[$scope.variants.variants[i].values[j].id] = $scope.variants.variants[i].values[j].name;
                }
            }
        }
        retVal["variantIds"] = variantIds;
        retVal["variantById"] = variantById;
        retVal["variantOptionById"] = variantOptionById;
        return retVal;
    }

    function buildProductVariants() {
        var productById = {};
        var productByUniqId = {};
        if ($scope.variants.productVariants) {
            $scope.variants.productVariants.forEach(function(item) {
                productById[item.id] = item;
                var variantOptionIds = [];
                item.variants.forEach(function(it) {
                    variantOptionIds.push(it.id);
                });
                if (variantOptionIds.length > 0) {
                    var permutes = permute(variantOptionIds);
                    for (var i = 0; i < permutes.length; i++) {
                        var key = permutes[i].join("-");
                        productByUniqId[key] = item;
                    }
                }
            });
        }
        var retVal = {
            productById: productById,
            productByUniqId: productByUniqId,
        };
        return retVal;
    }

    $scope.isSelected = (variant, type = "ELSE") => {
        let result = false;
        if ($scope.currentVariant && $scope.currentVariant.variants) {
            let isExists = $scope.currentVariant.variants.find(i => i.id == variant.id);
            if (isExists && isExists.id) {
                result = true;
            }
        }
        return result;
    }

    $scope.isFullImage = (item) => {
        let result = true;
        for (let index = 0; index < item.values.length; index++) {
            const element = item.values[index];
            if (!element.image_url) {
                result = false;
            }
        }
        return result;
    }

    $scope.getItemName = (item) => {
        let name = "";
        if (item.currentVariant && item.currentVariant.id) {
            item.currentVariant.variants.forEach((element, index) => {
                name += element.name;
                if (index < item.currentVariant.variants.length - 1) {
                    name += ", ";
                }
            });
        }
        return name;
    }

    $scope.getPriceVariant = (variant, item) => {
        let result = "";
        if ($scope.variants.variants.length > 0) {
            let key = variant.id;
            $scope.currentVariant.variants.forEach(element => {
                if (element.variant_id != item.id) {
                    key += "-" + element.id;
                }
            });
            if (key in $scope.products.productByUniqId) {
                result = " (" + $scope.formatPrice($scope.products.productByUniqId[key].price) + ")";
            }
        }
        return result;
    }
    $scope.formatPrice = function(price, numberAdd = 1, format = true) {
        if (format && price != 0) {
            if (typeof priceConfig != 'undefined' && priceConfig) {
                price = (parseFloat(price) + parseFloat(priceConfig.adding_price) * numberAdd) * parseFloat(priceConfig.ratio);
            }
            price = decimalAdjust('ceil', price);
        }

        return formatPrice(price, priceTempate);
        
    };
    function decimalAdjust(type, value) {
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

    $scope.changePrintLocation = (type, item) => {
        $scope.wishlistItems.forEach(element => {
            if (element.id == item.id) {
                if (type == 'front') {
                    element.temp_print_back = false;
                    element.temp_print_front = true;
                } else {
                    element.temp_print_front = false;
                    element.temp_print_back = true;
                }
            }
        });
    }
    $scope.closeChange = () => {
        $scope.loadingMakeChange = false;
        $scope.wishlistItems.forEach(element => {
            element.temp_print_back = element.is_print_back;
            element.temp_print_front = element.is_print_front;
            element.is_make_change = false;
        });
        $('body').removeClass('make-change-item-product');
    }

    $scope.save = (item) => {
        $scope.wishlistItems.forEach(element => {
            if (element.id == item.id) {
                element.currentVariant = $scope.currentVariant;
                element.variant_default = $scope.currentVariant;
                element.product_sku_id = element.currentVariant.id;
                element.price = element.currentVariant.price;
                element.high_price = element.currentVariant.high_price;
                element.image_url = element.currentVariant.image_url;
                element.variantName = $scope.getItemName(element);
                element.is_print_back = element.temp_print_back;
                element.is_print_front = element.temp_print_front;
                element.is_make_change = false;
                if (element.is_print_back) {
                    element.configurations.is_print_back = 1;
                    delete element.configurations.is_print_front;
                } else if (element.is_print_front) {
                    element.configurations.is_print_front = 1;
                    delete element.configurations.is_print_back;
                }

                $scope.updateWishlistItem(element.id, element);
            }
        });
        $scope.currentItem = {};
        $('body').removeClass('make-change-item-product');
    }

    $scope.updateWishlistItem = function (wishlistItemId, data) {
        $http.put('/update-wishlist-item', {
            wishlistItemId: wishlistItemId,
            product_sku_id: data.product_sku_id,
            status: data.status,
            configurations: data.configurations
        });
    }
});
