$(document).ready(function() {
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

    getWishlistItemsAmount();
});
