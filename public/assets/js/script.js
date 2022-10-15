$(document).ready(function() {

    const RECENT_KEY = 'recent-search';
    const KEYCODES = {
        up: 38,
        down: 40,
        enter: 13
    };
    const REQUEST_SUGGEST = {
        'get': 'z-search/suggest/find',
        'limit_per_type': 5,
        'active_position': null,
        'response_data': null
    }
    const prefixLocaleUrl = window.localePrefix ? '/' + window.localePrefix + '/' : '/';

    let request, timeoutRequest, colors = ['#733294', '#1582FD', '#51BC37', '#FB761F', '#EC3445', 'rgba(34,118, 148)', '#08ccb5', '#484572', '#b14e9c', '#0080ff', '#fd475d', '#16ab74'];
    let currentKeyword, initSlider;

    let recents = localStorage.getItem(RECENT_KEY);
    try {
        recents = JSON.parse(recents);
        if (!recents || !Array.isArray(recents)) {
            recents = [];
        }
    } catch (error) {
        recents = [];
    }

    let inputSearchText = $('#js-search-text');
    let completionsAsideSelector = $('.completions-aside');
    let searchBoxPopularProduct = $('#searchBoxPopularProduct');
    let suggestSearchBox = $('#suggestSearchBox');

    inputSearchText.prop("disabled", false);

    function buildProductSuggestion(products, selector) {
        var appendProduct = '';
        for (var i = 0; i < products.length; i = i + 2) {
            var mergeProduct = '';
            var productTemplate = $('#product-template').html();
            productTemplate = productTemplate.replace(/data-src/g, 'src');
            if (products[i]) {
                if (products[i].url.indexOf('?') > -1) {
                    productTemplate = productTemplate.replace(/#1/g, products[i].url + "&internal_source=popular-products");
                } else {
                    productTemplate = productTemplate.replace(/#1/g, products[i].url + "?internal_source=popular-products");
                }
                productTemplate = productTemplate.replace(/#2/g, products[i].image_url);
                productTemplate = productTemplate.replace(/#3/g, products[i].name);
                productTemplate = productTemplate.replace(/#4/g, products[i].price);
                if (products[i].high_price && products[i].high_price != '') {
                    productTemplate = productTemplate.replace(/#5/g, products[i].high_price);
                } else {
                    productTemplate = productTemplate.replace(/#5/g, '');
                }
                mergeProduct += productTemplate;
            }
            productTemplate = $('#product-template').html();
            productTemplate = productTemplate.replace(/data-src/g, 'src');
            if (products[i + 1]) {
                if (products[i + 1].url.indexOf('?') > -1) {
                    productTemplate = productTemplate.replace(/#1/g, products[i + 1].url + "&internal_source=popular-products");
                } else {
                    productTemplate = productTemplate.replace(/#1/g, products[i + 1].url + "?internal_source=popular-products");
                }
                productTemplate = productTemplate.replace(/#2/g, products[i + 1].image_url);
                productTemplate = productTemplate.replace(/#3/g, products[i + 1].name);
                productTemplate = productTemplate.replace(/#4/g, products[i + 1].price);
                if (products[i + 1].high_price && products[i + 1].high_price != '') {
                    productTemplate = productTemplate.replace(/#5/g, products[i + 1].high_price);
                } else {
                    productTemplate = productTemplate.replace(/#5/g, '');
                }
                mergeProduct += productTemplate;
            }
            appendProduct += '<div class="popular-product-item">' + mergeProduct + '</div>';
        }
        $(selector).append(appendProduct);
    }

    function buildCategorySuggestion(categories, selector) {
        var appendCategory = '';
        var colorIndex = 0;
        categories.forEach(function (category, index) {
            var categoryTemplate = $('#category-template').html();
            if (!colors[colorIndex]) {
                colorIndex = 0;
            }
            categoryTemplate = categoryTemplate.replace(/#1/g, colors[colorIndex]);
            categoryTemplate = categoryTemplate.replace(/#2/g, category.url);
            categoryTemplate = categoryTemplate.replace(/#3/g, category.name);
            appendCategory += categoryTemplate;
            colorIndex++;
        });
        $(selector).append(appendCategory);
    }

    inputSearchText.focusin(function (e)
    {
        const searchText = inputSearchText.val();
        if (searchText && searchText !== '' && currentKeyword !== searchText) {
            searching(searchText);
        }

        if (!initSlider) {
            initSlider = true;
            let trendingBox = $('#trending-template').html();
            if (trendingBox && trendingBox !== '') {
                $.get('/search/trending', function (response) {
                    if (response && Array.isArray(response)) {
                        let appendTrend = '';
                        response.forEach(function (trend, index) {
                            if (index > 4) return;
                            appendTrend += trendingBox.replace(/#1/g, trend.keyword);
                        });
                        if (appendTrend && appendTrend !== '') {
                            $('#trending-suggestion').append(appendTrend);
                        }
                    }
                });
            }

            if (recents.length !== 0) {
                var appendRecent = '';
                var recentBox = $('#recent-template').html();
                if (recentBox && recentBox != '') {
                    recents.forEach(function (recent, index) {
                        if (index > 4) return;
                        var recentTemplate = recentBox;
                        appendRecent += recentTemplate.replace(/#1/g, recent);
                    });
                    if (appendRecent && appendRecent != '') {
                        $('#recent-suggestion').append(appendRecent);
                    }
                }
            } else {
                $('#recent-suggestion').remove();
            }

            $('.loading-search').show();
            $.get('/suggestion-search?limit=100', function(response) {
                if (response && response.categories.length != 0) {
                    buildCategorySuggestion(response.categories, '#category-popular');
                }
                if (response && response.products.length != 0) {
                    buildProductSuggestion(response.products, '#product-popular');
                }
                $('.loading-search').hide();
                $('.completions-wrapper, .completions-background').show();
                $('body').addClass('open-search');
            });
        } else {
            $('.completions-wrapper, .completions-background').show();
            $('body').addClass('open-search');
        }
    });

    $('form.form-search').submit(function (event) {
        var keyword = inputSearchText.val().trim();
        if (keyword && keyword != '' && recents.indexOf(keyword) < 0) {
            recents.unshift(keyword);
            localStorage.setItem(RECENT_KEY, JSON.stringify(recents));
        }
    });

    $('.completions-more-search button').click(function () {
        $('.form-search').trigger('submit');
    });

    $('.js-search-icon').click(function () {
        $('.main-search, .completions-wrapper, .completions-background').show();
        inputSearchText.focus();
        $('body').addClass('open-search');
        $(this).toggleClass('search-active');
    });

    $('.close-search-mobile').click(function () {
        $('.main-search, .completions-wrapper, .completions-background').hide();
        $('.js-search-icon').removeClass('search-active');
        $('body').removeClass('open-search');
    });

    function searching(keyword) {
        if (timeoutRequest) {
            currentKeyword = "";
            $('.loading-search').hide();
            clearTimeout(timeoutRequest);
            timeoutRequest = undefined;
            if (request) {
                request.abort();
            }
        }

        if (keyword.length >= 1) {

            // @todo ẩn product popular, side trending search
            // @todo gọi service gợi ý từ khóa trong danh mục
            // @todo hiển thị từ khóa trending search dưới từ khóa gợi ý

            suggestKeywords(keyword);

        } else if (!keyword.length) {

            completionsAsideSelector.removeClass('hide');
            searchBoxPopularProduct.removeClass('hide');
            suggestSearchBox.addClass('hide');

            $('.completions-wrapper, #default-panel').show();
            $('#suggestion-panel, .loading-search').hide();
        }
    }

    inputSearchText.bind('keydown', function(e)
    {
        if (!REQUEST_SUGGEST.response_data) return;

        // binding up down
        let keyCode = e.keyCode || e.which;
        if (Object.values(KEYCODES).includes(keyCode)) {
            e.preventDefault();

            if (!REQUEST_SUGGEST.active_position) {
                REQUEST_SUGGEST.active_position = 0;
            }

            switch (keyCode) {
                case KEYCODES.down: REQUEST_SUGGEST.active_position ++; break;
                case KEYCODES.up: REQUEST_SUGGEST.active_position --; break;
                case KEYCODES.enter: {

                    let keyword = $('.search-suggest-list li.active-position').data('keyword');
                    if (keyword && keyword.length) {
                        inputSearchText.val(keyword);
                    }

                    $('.form-search').trigger('submit');

                    return;

                }
            }

            // length all data
            let maxPosition = parseInt(REQUEST_SUGGEST.response_data.suggest.length + REQUEST_SUGGEST.response_data.trending.length);

            if (REQUEST_SUGGEST.active_position > maxPosition) REQUEST_SUGGEST.active_position = 1; // reset to top
            if (REQUEST_SUGGEST.active_position <= 0) REQUEST_SUGGEST.active_position = maxPosition; // reset to bottom

            renderSuggestSearch(REQUEST_SUGGEST.response_data, REQUEST_SUGGEST.active_position);
        }

    });

    let typingTimeout = null;
    inputSearchText.bind('keyup', function(e)
    {
        let keyCode = e.keyCode || e.which;
        if (Object.values(KEYCODES).includes(keyCode)) return;

        clearTimeout(typingTimeout);

        const keyword = this.value.trim();
        typingTimeout = setTimeout(function() {
            searching(keyword);
            if (!keyword.length && $(window).width() < 960)  {
                $('.popular-products').animate( { scrollLeft: '-=1000' } );
            }
        }, 300);

    });

    function suggestKeywords(keyword) {
        if (request) {
            request.abort();
        }

        let url = prefixLocaleUrl + REQUEST_SUGGEST.get + '?' + 'keyword=' + keyword + '&limit=' + REQUEST_SUGGEST.limit_per_type;
        // url = 'https://printerval.com/z-search/suggest/find';

        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'text';
        request.onload = function () {
            if (request.readyState === request.DONE) {
                if (request.status === 200) {

                    let responseData = JSON.parse(request.responseText);
                    if (responseData.status === 'successful') {
                        REQUEST_SUGGEST.response_data = responseData;
                        REQUEST_SUGGEST.active_position = 0;
                        renderSuggestSearch(responseData);
                    }

                }
            }
        };
        request.send();
    }

    function renderSuggestSearch(responseData, activePosition = 0)
    {
        if (!activePosition)
        {
            $('.current-keyword').text(inputSearchText.val());

            if (!completionsAsideSelector.hasClass('hide')) {
                completionsAsideSelector.addClass('hide');
            }

            if (!searchBoxPopularProduct.hasClass('hide')) {
                searchBoxPopularProduct.addClass('hide');
            }

            if (suggestSearchBox.hasClass('hide')) {
                suggestSearchBox.removeClass('hide');
            }
        }

        let suggestKeywordTemplate = $('#suggestKeywordTemplate>li');
        let suggestTrendingTemplate = $('#suggestTrendingTemplate>li');
        let suggestBox = $('ul.search-suggest-list');

        suggestBox.html('');

        let count = 0;
        let suggestKeywords = responseData.suggest;
        for (let i = 0; i < suggestKeywords.length; i++) {

            count ++;

            let kWord = suggestKeywords[i];
            let template = suggestKeywordTemplate.clone();

            if (count === activePosition) {
                template.addClass('active-position');
            }

            template.attr('data-keyword', kWord.keyword);
            template.find('.suggest-keyword-content').text(kWord.keyword);
            suggestBox.append(template);

        }

        let trendingKeywords = responseData.trending;
        for (let i = 0; i < trendingKeywords.length; i++) {

            count ++;

            let kWord = trendingKeywords[i];
            let template = suggestTrendingTemplate.clone();

            if (count === activePosition) {
                template.addClass('active-position');
            }

            template.attr('data-keyword', kWord.keyword);
            template.find('span').text(kWord.keyword);
            suggestBox.append(template);

        }
    }

    suggestSearchBox.find('ul.search-suggest-list').on('click', function(e) {
        let keyword = $(e.target).closest('li').data('keyword');

        inputSearchText.val(keyword);
        $('.form-search').trigger('submit');
    });

    if ($('.product-item').is(':visible') == true) {
        $('.js-addtocart').click(function () {
            $('.mini-shopping-wrapper').addClass('active');
            var shoppingCartImage = $(this).parent().find('.product-link img').attr('src');
            var shoppingCartTitle = $(this).parent().find('.product-title').text();
            $('.js-shopping-cart-title').text(shoppingCartTitle);
            $('.mini-shopping-cart-image').attr('src', shoppingCartImage);

            setTimeout(function() {
                $('.mini-shopping-wrapper').removeClass('active');
            }, 5000);

            var oldValue = $('#js-cart-count').val();
            var newVal = parseFloat(oldValue) + 1;
            $('.js-mini-cart-count').text(newVal);
            $('#cart-error').hide();
            $('.mini-cart-list').show();
            $('#js-cart-count').val(newVal);
        })


        $('.close-mini-shopping-cart').click(function () {
            $('.mini-shopping-wrapper').removeClass('active');
        });
    }

    $(".js-continue").click(function () {
        $('.mini-cart-contain').toggle();
    });

    $(document).on('click', '.completions-item, .completions-background', function (event) {
        var term = $(this).data('term');
        if (term && term != '') {
            inputSearchText.val(term);
            $('.completions-wrapper, .completions-background').hide();
            $('body').removeClass('open-search');
            $('.form-search').trigger('submit');
        }
    });

    $( document ).on( 'keydown', function ( e ) {
        if ( e.keyCode === 27 ) { // ESC
            $('.completions-wrapper, .completions-background').hide();
            $('body').removeClass('open-search');
            $('#js-search-text').blur();
        }
    });

    $('.completions-content-item.category-navigate').each((index, element) => {
        let colorIndex = index;
		let colorLenght = colors.length - 1;
        if (index / colorLenght > 1) {
            while (colorIndex >= colorLenght) {
                colorIndex = colorIndex - colorLenght;
            }
        }
        setBackgroundColor($(element), colors, colorIndex);
    });

    let winWidth = $(window).width();
    $(window).on('resize', function() {
        if (winWidth !== $(window).width()) {
            winWidth = $(window).width();

            $('.sub-navigation').removeAttr('style');
            $('body').removeClass('open-menu');

            $('li.navigation-item').off('click');
            $('.navigation-link, .lev3-link, .lev2-link').off('click');
            $('.navigation-background').off('click');
            $('.goback-lev2menu').off('click');
            $('.lev2-item').off('click');
            $('.goback-lev3menu').off('click');
            $('.navigation-box').off('click');

            triggerMenuScript();
        }
    });

    // Menu script
    let mouseOutTimer = null;
    let mouseInTimer = null;
    let activeMenu = null;

    $(document).on('click', '.nav-icon', function (e) {
        e.preventDefault();
        $('body').addClass('open-menu');
        $('.navigation-background').show();
        // $('.navigation-wrapper').show();
        if (screen.width < 997) {
            $('html, body').animate({scrollTop: $("body").offset().top}, 0);
        }
    })

    // Back on safari iOS
    $(window).bind("pageshow", function(event) {
        if ((event.persisted) && $('body').hasClass('open-menu')) {
            $('body').addClass('open-menu');
            $('.navigation-background').show()
            $('.navigation-wrapper').show();
        }
    });

    // Touchmove on safari iOS
    $(window).bind('touchmove',function(event) {
        if ($('body').hasClass('open-menu')) {
            event.preventDefault();
            $('body').addClass('open-menu');
            $('.navigation-background').show()
            $('.navigation-wrapper').show();
        }
    });

    // Desktop
    if ($(window).width() > 1024) {

        // $('.lev2-item.has-lev3-menu').hover(function () {
        //     let menuHeight = $(this).parent().height();
        //     if (menuHeight) {
        //         $(this).find('.lev3-box').css('min-height', menuHeight);
        //     }
        // });

        // $('li.navigation-item').hover(function () {
        //     let menuId = $(this).data("menu-id");
        //     if (menuId) { // đợi nếu không bị cancel thì mở
        //         mouseInTimer = setTimeout(function() {
        //             activeMenu = menuId;
        //             showSubMenu(menuId);
        //         }, 100);
        //     } else  {
        //         closeSubMenu(activeMenu);
        //     }
        // }, function () {
        //     clearTimeout(mouseInTimer); // hủy bỏ lệnh show menu khi nó chưa kịp show ra
        //     if (activeMenu) { // Nếu có menu đang active -> đợi nếu menu này không còn active nữa thì đóng
        //         let currentActiveMenu = activeMenu;
        //         mouseOutTimer = setTimeout(function() {
        //             if (currentActiveMenu !== activeMenu) {
        //                 closeSubMenu(currentActiveMenu);
        //             }
        //         }, 200);
        //     }
        // });

        $('.navigation-wrapper').mouseleave(function() {
            clearTimeout(mouseOutTimer);
            clearTimeout(mouseInTimer);
            closeSubMenu(activeMenu);
        });
    }

    function triggerMenuScript () {
        // Ipad ngang
        if ($(window).width() < 1180 && $(window).width() > 997) {
            $('.navigation-link, .has-lev3-menu .lev2-link').click(function(){return false;});
            $('li.navigation-item').click(function (e) {
                $(this).toggleClass('active').siblings().removeClass('active');
                let hasSubMenu = $(this).find('.sub-navigation').length > 0;
                let menuId = $(this).data("menu-id");

                if (menuId && hasSubMenu) {
                    if (activeMenu !== menuId) {
                        closeSubMenu(activeMenu);
                        activeMenu = menuId;
                    } else {
                        let navigation = $('.navigation-box');
                        if (navigation.is(e.target) || navigation.has(e.target).length) {
                            closeSubMenu(activeMenu);
                        }
                    }
                    if (activeMenu) {
                        showSubMenu(menuId);
                        $('.navigation-background').show();
                        $('body').toggleClass('open-menu');
                    }

                } else {
                    window.location = $(this).find('.navigation-link').attr('href');
                }
            });

            $('.navigation-background').click(function () {
                $(this).hide();
                $('.navigation-item').removeClass('active');
                $('body').removeClass('open-menu');
                closeSubMenu(activeMenu);
            });

            $('.lev2-item .lev2-link').click(function() {
                $('.lev3-box.active').removeClass('active');
                $(this).parent().find('.lev3-box').addClass('active');
            });

        } else if ($(window).width() < 997) { // Mobile + Ipad dọc
            $(document).on('click', '.navigation-box', function (e) {
                if ($(this).next('.sub-navigation').length > 0) {
                    e.preventDefault();
                    $(this).next('.sub-navigation').show();
                    $(this).parent().toggleClass('show-sub-navigation');
                    $(this).parents().find('.navigation-wrapper').addClass('active-sub-navigation');
                } else {
                    let goToLink = $(this).children('.navigation-link').attr('href');
                    window.location = goToLink;
                }
            });

            $('.lev2-item.has-lev3-menu .lev2-link').click(function (e) {
                e.preventDefault();
                $('.lev2-item').removeClass('active-lev3-menu');
                $(this).parents('.navigation-lev2-list').addClass('open-lev3-menu')
                $(this).parents('.has-lev3-menu').addClass('active-lev3-menu')
                $(this).next().addClass('show-lev3-navigation');
            })

            $('.lev3-link').click(function (e) {
                if ($(this).next('.lev4-box').length > 0) {
                    e.preventDefault();
                    $(this).parent().siblings().find('.lev4-box').slideUp();
                    $(this).toggleClass('active')
                    $(this).next().slideToggle();
                } else {
                    let goToLink = $(this).attr('href');
                    window.location = goToLink;
                }
            });

            $('.goback-lev3menu').click(function (e) {
                e.preventDefault();
                $(this).parent().removeClass('show-lev3-navigation');
                $('.navigation-lev2-list').removeClass('open-lev3-menu');
                $('.lev4-box').hide(500);
                $('.lev3-link').removeClass('active')
            })

            $('.lev2-item').click(function() {
                $(this).next('.lev3-box').addClass('active')
                $(this).siblings().find('.lev3-box').removeClass('active');
            });

            $('.navigation-background').click(function () {
                $(this).hide();
                $('body').removeClass('open-menu');
            })

            $('.goback-lev2menu').click(function () {
                $('.sub-navigation').hide(250);
                $(this).stop(true,false).parents().find('.navigation-item').removeClass('show-sub-navigation', {duration:250});
                $(this).stop(true,false).parents().find('.navigation-wrapper').removeClass('active-sub-navigation', {duration:250});
            })

        }
    }

    triggerMenuScript();

    function showSubMenu (menuId) {
        let subMenu = $(".sub-navigation[data-menu-id='" + menuId + "']");
        subMenu.show();

        if (subMenu.length) {
            let level3Element = subMenu.find('.lev2-item.has-lev3-menu');
            if (!level3Element.find('.lev3-box.active')) {
                if (level3Element && level3Element.first()) {
                    level3Element.first().find('.lev3-box').addClass('active');
                }
            }
        }
    }

    function closeSubMenu (menuId) {
        let subMenu = $(".sub-navigation[data-menu-id='" + menuId + "']");
        subMenu.fadeOut('fast');
    }

    $('.user-menu-header, .user-submenu-background').click(function () {
        $('body').toggleClass('open-user-content');
    })

});

function setBackgroundColor(backgroundElement, colors, colorIndex) {
    const randomColor = colors[colorIndex];
    backgroundElement.css('background-color', randomColor);
}

// Lazy load images script
document.addEventListener("DOMContentLoaded", function () {

    let lazyloadImages;
    let lazyFunction = function(image) {
        if (image.parentElement.tagName === 'PICTURE') {
                let sources = image.parentElement.getElementsByTagName('source');
                for (let i = 0; i < sources.length; i++) {
                    sources[i].srcset = sources[i].dataset.srcset;
                }
            } else {
                image.src = image.dataset.src;
        }
        image.classList.remove("lazy");
    }

    if ("IntersectionObserver" in window) {

        lazyloadImages = document.querySelectorAll(".lazy");
        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const image = entry.target;

                    lazyFunction(image);
                    imageObserver.unobserve(image);
                }
            });
        }, {
            rootMargin: "100px"
        });

        lazyloadImages.forEach(function (image) {
            imageObserver.observe(image);
        });

    } else {

        let lazyloadThrottleTimeout;
        lazyloadImages = document.querySelectorAll(".lazy");

        function lazyload() {
            if (lazyloadThrottleTimeout) {
                clearTimeout(lazyloadThrottleTimeout);
            }

            lazyloadThrottleTimeout = setTimeout(function () {
                lazyloadImages.forEach(function (img) {
                    lazyFunction(img);
                });
                if (lazyloadImages.length === 0) {
                    document.removeEventListener("scroll", lazyload);
                    window.removeEventListener("resize", lazyload);
                    window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }

    if (screen.width > 997) {
        $(document).on('click', '.more-menu-icon', function () {
            $(this).parent().toggleClass('open-more-menu');
            //open menu
            if ($(this).parent().hasClass('open-more-menu')) {
                let countMenuItem = $('.navigation-item').length;
                let initMenu = '';
                for (let i = 9; i <= countMenuItem; i++) {
                    let element = $('.navigation-item:nth-child(n + ' + i + ')');
                    if ($(element).find('.sub-navigation').length) {
                        initMenu += $(element).find('.sub-navigation').html();
                    } else {
                        initMenu += $(element).html();
                    }
                }
                $('.more-menu-init-menu').html(initMenu);
            } else { //remove menu
                $('.more-menu-init-menu').html('');
            }
        });

        $(document).on('click', '.more-menu-item-wrapper-background', function () {
            $('.more-menu-item').removeClass('open-more-menu');
        })
    }
})
// End lazy load images script
