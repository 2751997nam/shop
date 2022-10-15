$(document).ready(function() {
    $('.js-productSkuId').on('change', function() {
        productIsInWishlist();
    });

    $('#configurations').on('change', function() {
        productIsInWishlist();
    });

    $('body').on('click', function() {
        $('.wishlist-tooltip-in-product-detail-added').css("opacity", 0);
        $('.wishlist-tooltip-in-product-detail-removed').css("opacity", 0);
    });

    $('.wishlist-product-link-in-product-detail').on('click', function () {
        var productId = $('#productId').val();
        var productSkuId = $('#productSkuId').val();
        var productIsInWishlist = $(this).hasClass("wishlist-active");
        var configurations = $('#configurations').val();
        var wishlistItemId = $('.wishlist-product-link-in-product-detail').attr('data-wishlist-item-id');
        if (productIsInWishlist) {
            removeWishlistItem(wishlistItemId);
        } else {
            addToWishlist(productId, productSkuId, configurations);
        }
    });

    removeWishlistItem = function (wishlistItemId) {
        $.ajax({
            type: "DELETE",
            url: '/remove-wishlist-item',
            data: {
                wishlistItemId: wishlistItemId
            },
            success: function (response) {
                if (response.status == 'successful') {
                    $('.wishlist-product-link-in-product-detail').removeClass('wishlist-zoom-in-out');
                    $('.wishlist-product-link-in-product-detail').removeClass('wishlist-active');
                    $('.wishlist-product-link-in-product-detail').attr('data-wishlist-item-id', '');
                    var tooltip = $('.wishlist-tooltip-in-product-detail-removed');
                    tooltip.css("opacity", 1);
                    getWishlistItemsAmount();
                }
            },
            error: function (error) {
                //
            }
        });
    }

    getWishlistItemsAmount = function () {
        $.ajax({
            type: "GET",
            url: '/get-wishlist-items',
            success: function (data) {
                var wishlistItemAmount = Object.keys(data.wishlistItems).length;
                if (wishlistItemAmount) {
                    $('#wishlist-count-item').text(wishlistItemAmount);
                    $('#wishlist-count-item').addClass('wishlist-count-item');
                    $('.wishlist-add-all-to-cart').show();
                    $('#empty-wishlist').hide();
                } else {
                    $('#wishlist-count-item').text('');
                    $('#wishlist-count-item').removeClass('wishlist-count-item');
                    $('#empty-wishlist').show();
                    $('.wishlist-add-all-to-cart').hide();
                }
            },
            error: function (error) {
                //
            }
        });
    }

    addToWishlist = function (productId, productSkuId, configurations) {
        $.ajax({
            type: "POST",
            url: '/add-to-wishlist',
            data: {
                productId: productId,
                productSkuId: productSkuId,
                configurations: configurations
            },
            success: function (response) {
                $('.wishlist-product-link-in-product-detail').addClass('wishlist-zoom-in-out');
                $('.wishlist-product-link-in-product-detail').addClass('wishlist-active');
                $('.wishlist-product-link-in-product-detail').attr('data-wishlist-item-id', response.result.id);
                var tooltip = $('.wishlist-tooltip-in-product-detail-added');
                tooltip.css("opacity", 1);
                getWishlistItemsAmount();
            },
            error: function (error) {
                //
            }
        });
    }

    productIsInWishlist = function () {
        var productId = $('#productId').val();
        var productSkuId = $('#productSkuId').val();
        var configurations = $('#configurations').val();

        if (productId) {
            $.ajax({
                type: "GET",
                url: '/product-is-in-wishlist',
                data: {
                    productId: productId,
                    productSkuId: productSkuId,
                    configurations: configurations
                },
                success: function (response) {
                    if (response.status == 'successful') {
                        if (response.result) {
                            $('.wishlist-product-link-in-product-detail').addClass('wishlist-active');
                            $('.wishlist-product-link-in-product-detail').attr('data-wishlist-item-id', response.result.id);
                        } else {
                            $('.wishlist-product-link-in-product-detail').removeClass('wishlist-active');
                            $('.wishlist-product-link-in-product-detail').removeClass('wishlist-zoom-in-out');
                            $('.wishlist-product-link-in-product-detail').attr('data-wishlist-item-id', '')
                        }
                    }
                },
                error: function (error) {
                    //
                }
            });
        }
    }

    productIsInWishlist();
});
