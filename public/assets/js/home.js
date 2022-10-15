$('.banner-home-slide').on('init', function(event, slick){
    $('.banner-home-slide').css('visibility', 'visible');
    $('.base-banner-layer').css('visibility', 'hidden');
});

$('.banner-home-slide').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    infinite: false,
    dots: true,
    responsive: [
    {
        breakpoint: 600,
        settings: {
            arrows: true,
            dots: false,
        }
    }
]
});

$('.trend-topics-list').slick({
    lazyLoad: 'ondemand',
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: false,
    autoplaySpeed: 2000,
    infinite: false,
    variableWidth: true,
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
        }
    ]
});

if (screen.width > 1180) {
    $('.featured-product-list').slick({
        speed: 1000,
        rows: 2,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: true,
        autoplaySpeed: 8000,
        infinite: false,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                dots: false,
                arrows: false,
            }
        },{
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: false,
            }
        }]
    });
}


$('.tab-item').click(function () {
    var currentValue = $(this).attr('data-href');
    $(this).addClass('tab-selected').siblings().removeClass('tab-selected');
    $(currentValue).addClass('active').siblings().removeClass('active');
    if ($(window).width() < 1024) {
        $('.top-sale-list').animate( { scrollLeft: '-=10000' } );
    }
});

$('.top-sale-list-slider').slick({
    lazyLoad: 'ondemand',
    speed: 200,
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
        }
    ]
});

$('#home-page-title').text(document.title);

document.addEventListener("DOMContentLoaded", function(event) {
    $.ajax({url: "/product/recommendation"}).done(function(response) {
        var locale = '';
        if (typeof localePrefix !== 'undefined' && localePrefix !== '') {
            locale = '/' + localePrefix;
        }
        if (response.status == 'successful') {
            const recommendationProducts = response.result;
            if (recommendationProducts && recommendationProducts.length > 0) {
                let html = "";
                for (let index = 0; index < recommendationProducts.length; index++) {
                    let url = recommendationProducts[index].url;
                    if (locale != '' && !recommendationProducts[index].url.includes(locale)) {
                        url = locale + url;
                    }
                    if (recommendationProducts[index].attributes && recommendationProducts[index].attributes.is_hide_home_page && recommendationProducts[index].attributes.is_hide_home_page == 1) {
                        continue;
                    }
                    html += `
                    <div class="featured-product-item-box">
                    `;
                    html += `
                        <div class="featured-product">
                            <div class="featured-product-item">
                                <a class="featured-product-link" href="${url}?internal_source=home-recommendation" tabindex="0">
                                    <img
                                        src="${getImageCdn(recommendationProducts[index].image_url, 630, 630)}"
                                        alt="${recommendationProducts[index].name}"
                                </a>
                                <div class="featured-product-title-box flex-b align-c">
                                    <a class="featured-product-title" href="${url}?internal_source=home-recommendation" tabindex="0">
                                        <h3 class="featured-product-title">${recommendationProducts[index].name}</h3>
                                    </a>
                                </div>
                                <div style="display: flex;">
                                    <div class="featured-product-price product-count">
                                        ${recommendationProducts[index].display_price}
                                    </div>
                        `;
                            if (recommendationProducts[index].high_price && recommendationProducts[index].high_price > recommendationProducts[index].price) {
                                html +=`
                                    <div class="featured-product-high-price product-count">
                                        ${recommendationProducts[index].display_high_price}
                                    </div>`
                            };
                        html += `
                                </div>
                            </div>
                        </div>
                    `;
                    if (typeof isMobile !== 'undefined' && isMobile && recommendationProducts.length > 4) {
                        index++;
                        if (recommendationProducts[index]) {
                            let mobileUrl = recommendationProducts[index].url;
                            if (locale != '' && !recommendationProducts[index].url.includes(locale)) {
                                mobileUrl = locale + mobileUrl;
                            }
                            html += `
                                <div class="featured-product">
                                    <div class="featured-product-item">
                                        <a class="featured-product-link" href="${mobileUrl}?internal_source=home-recommendation" tabindex="0">
                                            <img
                                                src="${getImageCdn(recommendationProducts[index].image_url, 630, 630)}"
                                                alt="${recommendationProducts[index].name}"
                                        </a>
                                        <div class="featured-product-title-box flex-b align-c">
                                            <a class="featured-product-title" href="${mobileUrl}?internal_source=home-recommendation" tabindex="0">
                                                <h3 class="featured-product-title">${recommendationProducts[index].name}</h3>
                                            </a>
                                        </div>
                                        <div style="display: flex;">
                                            <div class="featured-product-price product-count">
                                                ${recommendationProducts[index].display_price}
                                            </div>
                                `;
                                    if (recommendationProducts[index].high_price && recommendationProducts[index].high_price > recommendationProducts[index].price) {
                                        html +=`
                                            <div class="featured-product-high-price product-count">
                                                ${recommendationProducts[index].display_high_price}
                                            </div>`
                                    };
                                html += `
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    }
                    html += `
                    </div>
                    `;
                }
                $(".home-recommendation-product").find(".home-recommendation-product-list").html(html);
                $(".home-recommendation-product").show();
            }
        }
    })
})
