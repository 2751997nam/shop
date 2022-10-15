$(document).ready(function() {
    $('.filter-icon, .filter-background, .filter-list-background').click(function () {
        $('body').toggleClass('open-filter')
    });

    $('.product-item-favorite').click(function () {
        var element = $(this);
        if (!element.hasClass('added-favorite')) {
            element.addClass('added-favorite');

            $.ajax({
                type: "GET",
                url: '/product/find?id=' + element.data('product-id'),
                success: function (data) {
                    if (data.status == 'successful') {

                        var configurations = null;
                        if (data.result.is_valid_print_back) {
                            configurations = JSON.stringify({is_print_front: 1});
                        }
                        $.ajax({
                            type: "POST",
                            url: '/add-to-wishlist',
                            data: {
                                productId: data.result.id,
                                productSkuId: data.result.variant_default.id,
                                configurations: configurations
                            },
                            success: function (response) {
                                getWishlistItemsAmount();
                            },
                            error: function (error) {
                                //
                            }
                        });

                    }
                },
                error: function (error) {
                    //
                }
            });
        } else {
            removeAllQishlistItemsByProductId(element.data('product-id')).then(function () {
                element.removeClass('added-favorite');
                getWishlistItemsAmount();
            });
        }
    });

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

    removeAllQishlistItemsByProductId = function (productId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "DELETE",
                url: '/remove-all-wishlist-items-by-product-id',
                data: {
                    productId: productId
                },
                success: async function (data) {
                    await getWishlistItemsAmount();
                    resolve();
                },
                error: function (error) {
                    //
                }
            });
        });
    }

    if (screen.width > 1100) {
        $('.sub-page-heading').click(function (event) {
            $(this).parent().toggleClass('active').removeClass('collapse');
            $(this).parent().siblings().removeClass('active');

            if ($(this).parent().siblings().hasClass('active')) {
                $(this).parent().siblings().addClass('collapse');
            }
            $(this).next('.filter-content').slideToggle();
            $(this).parent().siblings().find('.filter-content').hide();

            $(this).next().next('.viewall-category').slideToggle();
            event.stopPropagation();
        });

        $('body').click(function(event) {
            $('.filter-item-box').removeClass('active');
            $('.filter-content').hide();

            if ($('.filter-item-box').hasClass('active')) {
                $('.filter-item-box').addClass('collapse');
            }
            $('.filter-list-sort').hide();
            $('.default-sort').removeClass('active')
        });
    } else {
        $('.sub-page-heading').click(function (event) {
            $(this).parent().toggleClass('expand');
        });

        if ($('.select-filter-mobile').is(':visible') == true) {
            $('.default-sort').click(function (event) {
                $(this).toggleClass('active')
                $('.filter-list-sort').toggle();
                event.stopPropagation();
            })
        }

        $('body').click(function(event) {
            $('.filter-list-sort').hide();
            $('.default-sort').removeClass('active')
        });
    }

    $(document).on('click', '.js-showmore', function () {
        $('html, body').animate({scrollTop: $('.breadcrumb-link').offset().top - 10}, 500);
    })

    if ($(window).width() > 1024 && $('.topsale-product-item-box').length > 5) {
        $('.topsales-list').slick({
            slidesToShow: 5,
            slidesToScroll: 5,
            autoplay: false,
            autoplaySpeed: 2000,
            infinite: false,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    dots: false,
                    arrows: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false,
                }
            }]
        });
    }

    if (screen.width > 1180 && $('.list-category-tag').length > 0) {
        $('.list-category-tag').slick({
            slidesToShow: 10,
            slidesToScroll: 10,
            autoplay: false,
            autoplaySpeed: 2000,
            infinite: false,
            responsive: [{
                breakpoint: 1400,
                settings: {
                    slidesToShow: 9,
                    slidesToScroll: 9,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 8,
                    slidesToScroll: 8,
                }
            }]
        });
    }

    var categoryDescriptionHeight = $('.category-description').height();
    if (categoryDescriptionHeight > 290) {
        $('.category-description-wrapper').addClass('has-moreless');
    } else {
        $('.category-description-wrapper').css('height','auto');
    }
    $('.category-description-button').click(function () {
        $('.category-description-wrapper').toggleClass('expand-description')
        $(this).children().toggle();
    });
    if (screen.width > 1200) {
        $('.category-list-sub-item').slick({
            slidesToShow: 7,
            slidesToScroll: 7,
            autoplay: false,
            autoplaySpeed: 2000,
            infinite: false,
            responsive: [{
                breakpoint: 1480,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    dots: false,
                }
            },{
                breakpoint: 1360,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    arrows: false,
                }
            },
            {
                breakpoint: 1180,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    arrows: false,
                }
            },{
                breakpoint: 990,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    dots: false,
                }
            }]
        });
    }
});
