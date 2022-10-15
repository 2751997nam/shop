"use strict";

//cache variant choose
var variantCacheData = {};

if (screen.width < 1280) {
    $(".write-review").click(function () {
        $(".product-review-box").slideToggle();
        $(".comment-form").slideToggle();
    });

    $(".product-feature").click(function () {
        $(this).next().slideToggle();
    });

    $(document).bind('click', function (e) {
        var target = $(e.target);
        if (target.is('.read-all-review-heading')) {
            e.preventDefault(); // if you want to cancel the event flow
            $(target).next().slideToggle();
        }
    });
}

$(document).ready(function() {
    $(document).on('click', '.open-multiple-size', function () {
        $('body').addClass('open-multiple-size-wrapper');
        $('.list-product-size-wrapper').toggleClass('product-size-focus')
        $('.list-product-size-background').toggleClass('mb-show')
    })
    $('.close-multiple-sz, .multiple-size-background').click(function () {
        $('body').removeClass('open-multiple-size-wrapper')
        $('body').removeClass('mb-open-multiple-size');
    })

    $('#js-choose-size-value').click(function (e) {
        $(this).toggleClass('product-size-focus');
        $('.list-product-size-wrapper').toggleClass('product-size-focus')
        $('.list-product-size-background').toggleClass('mb-show');
        $('body').addClass('mb-open-multiple-size');
        e.stopPropagation();
    });

    $('.close-choose-size').click(function () {
        $('.list-product-size-wrapper').removeClass('product-size-focus');
        $('.list-product-size-background').removeClass('mb-show');
    });

    $('.list-product-size-background').click(function () {
        $(this).toggleClass('mb-show');
        $('.list-product-size-wrapper').toggleClass('product-size-focus');
    });
    $('.close-multiple-size, .list-product-size-background').click(function () {
        $('body').removeClass('mb-open-multiple-size');
    });

    $(document).on('click', '.header-prop', function () {
        $(this).parents('.bulk-ordering-dialog-choose').removeClass('product-size-focus');
    })

    $(document).on('click', '.bulk-ordering-dialog-choose > .select-variant', function (e) {
        e.stopPropagation();
        let parent = $(this).parent('.product-size-focus');
        if (parent && parent.length) {
            $(parent).removeClass('product-size-focus');
        } else {
            $('.bulk-ordering-dialog-choose').removeClass('product-size-focus');
            $(this).parent('.bulk-ordering-dialog-choose').addClass('product-size-focus');
        }
    });

    $(document).on('click', function (event) {
        if (!$(event.target).parents('.bulk-ordering-dialog-choose').length) {
            $('.bulk-ordering-dialog-choose').removeClass('product-size-focus');
            $('body').removeClass('mb-open-multiple-size');
        }

        if (!$(event.target).parents('.list-product-size-wrapper').length) {
            $('.list-product-size-wrapper').removeClass('product-size-focus');
            $('body').removeClass('mb-open-multiple-size');
        }
    })


    $(document).on('click', '.select-a-size', function () {
        var txt = $(this).find('.product-size-item-content').text();
        $('#js-choose-size-value').text(txt);
        $('.list-product-size-wrapper').toggleClass('product-size-focus')
        $('.list-product-size-background').toggleClass('mb-show')
        $('body').removeClass('open-multiple-size-wrapper')
        $('body').removeClass('mb-open-multiple-size');
    })

    $('.choose-image-variant').click(function () {
        var img = $(this).find('img').attr('src');
        var title = $(this).find('img').attr('alt');
        $(this).parents('.bulk-ordering-dialog-choose').find('.select-img').attr({
            'src': img,
            'alt': title,
            'title': title
        });
        $(this).parents('.bulk-ordering-dialog-choose').find('.image-title').text(title);
    })
});


$(document).ready(async function () {
    var GlobalVariantIds = null;
    var GlobalProducts = null;
    var GlobalVariantBases = null;
    var GlobalSpid = null;
    var GlobalTimeoutNav;
    var GlobalIsSelectSize = null;
    var GlobalDefaultVariant = null;
    var GlobalVariants = null;
    var GlobalSelectSize = false;
    let response = await getProductVariants();
    if (response.status == "successful") {
        GlobalVariants = response.result;
        window.globalVariants = GlobalVariants;
    }
    initTagsCollapse();

    $(".designer-list-product").slick({
        slidesToShow: 6,
        slidesToScroll: 6,
        autoplay: false,
        autoplaySpeed: 2000,
        infinite: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    arrows: false,
                },
            },
            {
                breakpoint: 996,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    arrows: false,
                },
            },
            {
                breakpoint: 760,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false,
                },
            }
        ],
    });

    $(".featured-product-list").slick({
        slidesToShow: 5,
        slidesToScroll: 4,
        autoplay: false,
        autoplaySpeed: 2000,
        infinite: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    });

    buildSlickSlide();

    $("#form-buy-now").submit(function (event) {
        event.preventDefault();
        var self = $(this);
        $(this).attr("disabled", "disabled");
        $.ajax({
            method: "POST",
            url: "/cart/add-to-cart",
            data: {
                productId: $("#productId").val(),
                quantity: $("#quantity").val(),
                _token: "{{ csrf_token() }}",
            },
        }).done(function (result) {
            if (result.status == "successful") {
                localStorage.setItem("change-cart", Date.now());
                document.location.href = "/cart";
            } else {
                alert("Fail. Try again later");
            }
            self.removeAttr("disabled");
        });
    });

    GlobalProducts = buildProductVariants();
    GlobalVariantBases = buildVariantBase();
    GlobalSpid = getParameterByName("spid");
    GlobalVariantIds = GlobalVariantBases.variantIds;
    GlobalIsSelectSize = false;
    let GlobalHasOverwriteDefaultSku = false;
    if (GlobalSpid == null) {
        GlobalVariants.productVariants.forEach(function (item) {
            if (item.is_default == 1) {
                GlobalSpid = item.id;
                GlobalDefaultVariant = item;
            }
        });
    } else {
        let check = false;
        let defaultSpid = null;
        GlobalVariants.productVariants.forEach(function (item) {
            if (item.is_default) {
                defaultSpid = item.id;
            }
            if (item.id == GlobalSpid) {
                check = true;
            }
        });

        if (!check) {
            GlobalSpid = defaultSpid;
        }
        GlobalDefaultVariant = GlobalVariants.productVariants.find(i => i.id == GlobalSpid);
    }

    if (
        typeof GlobalDefaultSkuVariantKey != 'undefined'
        && GlobalProducts.productByUniqId[GlobalDefaultSkuVariantKey]
    ) {
        GlobalSpid = GlobalProducts.productByUniqId[GlobalDefaultSkuVariantKey].id;
        GlobalDefaultVariant = GlobalProducts.productByUniqId[GlobalDefaultSkuVariantKey];
        GlobalHasOverwriteDefaultSku = true;
    }

    if (!GlobalDefaultVariant && GlobalVariants.productVariants && GlobalVariants.productVariants.length) {
        GlobalDefaultVariant = GlobalVariants.productVariants[0];
        GlobalSpid = GlobalDefaultVariant.id;
    }
    if (GlobalDefaultVariant && GlobalDefaultVariant.sku) {
        $('.span-product-sku').text(GlobalDefaultVariant.sku);
    }
    sortVariants();
    hideInvalidVariant(GlobalSpid, GlobalProducts.productById)
    buildItem(GlobalSpid, GlobalProducts.productById, true);
    //truong hop gen anh bi loi
    if (GlobalDefaultVariant && !GlobalDefaultVariant.sku) {
        let defaultKey = null;
        for (let key in GlobalProducts.productById) {
            if (GlobalProducts.productById[key].sku && GlobalProducts.productById[key].is_default == 1) {
                defaultKey = key;
                break;
            }
        }

        if (defaultKey) {
            GlobalDefaultVariant = GlobalProducts.productById[defaultKey];
            GlobalSpid = GlobalDefaultVariant.id;
            buildItem(GlobalSpid, GlobalProducts.productById, true);
            buildInfoItem(GlobalSpid, GlobalProducts.productById, getParameterByName("spid"));
        }
    }
    if (!GlobalHasOverwriteDefaultSku) {
        buildInfoItem(GlobalSpid, GlobalProducts.productById, getParameterByName("spid"));
    } else {
        $(".js-productSkuId").val(GlobalSpid).trigger('change');
    }


    $(document).on("click", ".js-choose-variant", function (event) {
        chooseVariant(event);

        return false;
    });
    $(document).on("change", ".js-select-variant", function (event) {
        selectVariant(event);

        return false;
    });

    function sortVariants() {
        if (GlobalDefaultVariant) {
            let previewVariant = null;
            let previewIndex = null;
            for (let i = 0; i < GlobalVariants.variants.length; i++) {
                if (GlobalVariants.variants[i].type == 'PREVIEW') {
                    previewVariant = GlobalVariants.variants[i];
                    previewIndex = i;
                }
            }
            if (previewVariant) {
                let selectedPreviewId = null;
                GlobalDefaultVariant.variants.forEach(value => {
                    if (value.variant_id == previewVariant.id) {
                        selectedPreviewId = value.id;
                    }
                })
                if (selectedPreviewId) {
                    previewVariant.values.sort(function (a, b) {
                        return a.id == selectedPreviewId ? -1 : (b.id == selectedPreviewId ? 1 : 0);
                    });
                    GlobalVariants.variants[previewIndex] = previewVariant;
                }
            }
        }
    }

    function hideInvalidVariant(spid, productById) {
        if (typeof productById[spid] != 'undefined') {
            var product = productById[spid];
            if (typeof product.variants != 'undefined' && product.variants.length > 1) {
                let option = product.variants[0];
                let variant = GlobalVariants.variants.find(variant => variant.id == option.variant_id);
                let options = variant.values;
                let i = 0;
                while(product.variants[i]) {
                    if (options) {
                        let hideVariant = options.find(opt => opt.id == product.variants[i].id);
                        if (hideVariant) {
                            let showOptions = hideVariant.options;
                            if (showOptions.length) {
                                let select = $('#js-select-variant-' + showOptions[0].variant_id);
                                if (!parseInt($(select).attr('data-show-invalid'))) {
                                    let elements = $(select).children();
                                    showOptions = showOptions.map(option => parseInt(option.id));
                                    elements.each((index, element) => {
                                        let id = $(element).attr('data-variant-option-id');
                                        if (!id) {
                                            id = $(element).attr('value');
                                        }
                                        if (id) {
                                            id = parseInt(id);
                                            if (!showOptions.includes(id) && id != -1) {
                                                $(element).remove();
                                            }
                                        }
                                    })
                                }
                            }
                            options = hideVariant.options;
                        }
                    }

                    i++;
                }
            }
        }
    }

    var slickGalleryBox = null;
    var slickGalleryNav = null;

    function buildSlickSlide(activeIndex = 0) {
        if ($('.gallery-nav-item').length > 4) {
            slickGalleryBox = new Swiper(".product-gallery-nav", {
                spaceBetween: 16,
                slidesPerView: 4.4,
                slidesPerGroup: 4,
                freeMode: true,
                watchSlidesProgress: true,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                breakpoints: {
                    768: {
                        direction: "vertical",
                    }
                },
            });
        }


        slickGalleryNav = new Swiper(".product-gallery-box", {
            spaceBetween: 0,
            slidesPerView: 1,
            effect: 'slide',
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            thumbs: {
                swiper: slickGalleryBox,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            on: {
                init: function () {

                    $('.swiper-button-next').removeClass('swiper-button-lock');
                    $('.swiper-button-next').removeClass('swiper-button-disabled');
                    $('.swiper-button-next').removeAttr('tabindex');
                    $('.swiper-button-next').removeAttr('aria-disabled');
                    $('.swiper-button-next').removeAttr('aria-controls');

                    let lazyloadImages = document.querySelectorAll(".swiper-lazy");
                    const imageObserver = new IntersectionObserver(function (entries, observer) {
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

                                imageObserver.unobserve(image);
                            }
                        });
                    });

                    lazyloadImages.forEach(function (image) {
                        imageObserver.observe(image);
                    });

                },
            }
        });
        if (activeIndex) {
            slickGalleryNav.slideTo(activeIndex);
        }
    }

    function buildGallery(selectedVariant) {
        let slideHtml = `<div class="product-gallery-box"><div class="swiper-wrapper">`;
        let slideContrlHtml = `<div class="product-gallery-nav"><div class="swiper-wrapper">`;
        let currentImageUrl = "";
        let zoomIn = '';
        let currentGallery = globalGallery;
        let currentVideos = globalVideos;
        for (let i = 0; i < selectedVariant.gallery.length; i++) {
            currentGallery[i] = selectedVariant.gallery[i];
        }
        let firstImageUrl = currentGallery.length ? currentGallery[0] : "";
        if (firstImageUrl) {
            firstImageUrl = getImageCdn(firstImageUrl, 1260, 0, false);
        }
        let elements = $(".slick-active .product-gallery-item img");
        if (elements) {
            currentImageUrl = $(elements[0]).attr("src");
            if (currentImageUrl != firstImageUrl && firstImageUrl) {
                currentVideos.forEach((item, index) => {
                    slideHtml += `<div class="product-gallery-item swiper-slide">
                        <video src="${item.src}" poster="${item.image_url}" controls autoplay muted loop>
                        </video>
                    </div>`;
                    if (typeof jsNotMobile !== 'undefined' && jsNotMobile) {
                        slideContrlHtml += `<div class="gallery-nav-item swiper-slide" data-index="${index}">
                            <div class="mask-video"></div>
                            <div class="icon-play">
                                <svg viewBox="-4 0 22 22"><path d="M17.446 11.966L1.701 21.348A1.125 1.125 0 0 1 0 20.38V1.618A1.125 1.125 0 0 1 1.7.652l15.746 9.381a1.125 1.125 0 0 1 0 1.933z" fill="#FFF" fill-rule="evenodd"></path></svg>
                            </div>
                            <img src="${getImageCdn(item.image_url, 0, 340, false, true, {zoomIn: zoomIn})}" />
                        </div>`;
                    }
                });
                currentGallery.forEach((imageUrl, index) => {
                    zoomIn = '';
                    if  (typeof isZoomIn !== 'undefined' && isZoomIn && index === 1) {
                        zoomIn = '/350x350:1000x1000';
                    }
                    slideHtml += `<div class="product-gallery-item swiper-slide">
                        <picture>
                            <source media="(min-width: 1030px)" srcset="${getImageCdn(imageUrl, 1260, 0, false, true, {zoomIn: zoomIn})}" />
                            <source media="(min-width: 1000px) and (max-width: 1030px)" srcset="${getImageCdn(imageUrl, 1116, 0, true, true, {zoomIn: zoomIn})}" />
                            <source media="(min-width: 760px) and (max-width: 1000px)" srcset="${getImageCdn(imageUrl, 846, 0, true, true, {zoomIn: zoomIn})}" />
                            <source media="(min-width: 370px) and (max-width: 760px)" srcset="${getImageCdn(imageUrl, 828, 0, false, true, {zoomIn: zoomIn})}" />
                            <source media="(min-width: 320px) and (max-width: 370px)" srcset="${getImageCdn(imageUrl, 360, 340, false, true, {zoomIn: zoomIn})}" />
                            <img src="/images/blank.gif" alt=""  />
                        </picture>
                    </div>`;
                    if (typeof jsNotMobile !== 'undefined' && jsNotMobile) {
                        slideContrlHtml += `<div class="gallery-nav-item swiper-slide" data-index="${currentVideos.length + index}">
                            <picture>
                                <source media="(min-width: 1030px)" srcset="${getImageCdn(imageUrl, 1260, 0, false, true, {zoomIn: zoomIn})}" />
                                <source media="(min-width: 1000px) and (max-width: 1030px)" srcset="${getImageCdn(imageUrl, 1116, 0, true, true, {zoomIn: zoomIn})}" />
                                <source media="(min-width: 760px) and (max-width: 1000px)" srcset="${getImageCdn(imageUrl, 846, 0, true, true, {zoomIn: zoomIn})}" />
                                <source media="(min-width: 370px) and (max-width: 760px)" srcset="${getImageCdn(imageUrl, 828, 0, false, true, {zoomIn: zoomIn})}" />
                                <source media="(min-width: 320px) and (max-width: 370px)" srcset="${getImageCdn(imageUrl, 360, 340, false, true, {zoomIn: zoomIn})}" />
                                <img src="/images/blank.gif" alt=""  />
                            </picture>
                        </div>`;
                    }
                });
                slideHtml += "</div>";
                slideHtml += '<div class="swiper-button-next"></div>';
                slideHtml += '<div class="swiper-button-prev"></div>';
                slideHtml += '<div class="swiper-pagination"></div>';
                slideHtml += "</div>";


                slideContrlHtml += "</div></div>";
                let html = slideHtml;
                if (currentGallery.length + currentVideos.length > 1) {
                    html += slideContrlHtml;
                }
                $(".product-slider-wrapper").html(html);
                if (currentGallery.length + currentVideos.length  > 1) {

                    buildSlickSlide(currentVideos.length);
                    // if (slickGalleryBox) slickGalleryBox.update();
                    // if (slickGalleryNav) slickGalleryNav.update();

                }
            }
        }
    }

    function chooseVariant(selector, skipBuildGallery = false) {
        if (selector.currentTarget) selector = $(selector.currentTarget);
        var id = selector.attr("data-variant-id");
        var dataOptionId = selector.attr("data-variant-option-id");
        var key = dataOptionId;
        if (!id || !dataOptionId) return;
        cacheOption(id, dataOptionId)
        $("#js-select-variant-" + id + " .js-choose-variant").removeClass("active");
        $("#js-select-variant-" + id + " .js-choose-variant").removeClass("hide-active");
        $("#js-select-variant-" + id + " .js-choose-variant").removeClass("error");
        $("#js-select-variant-" + id)
            .find('input[type="radio"]')
            .each(function (index, ele) {
                $(ele).prop("checked", false);
            });
        $("#js-variant-name-" + id).html("");
        selector.addClass("active");
        $(selector)
            .find('input[type="radio"]')
            .each(function (index, ele) {
                $(ele).prop("checked", true);
            });
        let changingVariants = GlobalVariants.variants.find((varian) => {
            if (id == varian.id) return varian;
        });

        let valueWantToChange = changingVariants.values.find((value) => {
            if (value.id == dataOptionId) return value;
        });

        if (changingVariants.slug == 'size') {
            let elements = selector.children();
            elements.each((index, element) => {
                let id = $(element).attr('value');
                if (id) {
                    id = parseInt(id);
                    if (id == -1) {
                        $(element).remove();
                    }
                }
            })
            GlobalIsSelectSize = true;
            $(`#js-select-variant-${changingVariants.id}`).attr('data-size', dataOptionId);
            $(`#js-select-size-multiple`).removeClass('error');
        }

        if (selector.attr("data-sku-key")) {
            key = selector.attr("data-sku-key");
        } else {
            key = buildKey(GlobalVariantIds, id, key);
        }
        let rebuildOption = false;
        if (!GlobalProducts.productByUniqId[key]) {
            key = buildCallbackProductVariantKey(key, id, valueWantToChange);
            rebuildOption = true;
        }
        if (typeof GlobalProducts.productByUniqId[key] != "undefined") {
            var spid = GlobalProducts.productByUniqId[key].id;
            buildInfoItem(spid, GlobalProducts.productById);
            if (!skipBuildGallery) {
                buildGallery(GlobalProducts.productByUniqId[key]);
            }
            if (rebuildOption) {
                let domOption = buildDomOption(changingVariants.type, changingVariants, parseInt($("#js-select-variant-" + id).attr('data-show-invalid')), spid);
                if (domOption) {
                    $("#js-select-variant-" + id).html(domOption);
                    $(`[data-variant-option-id=${valueWantToChange.id}]`).addClass('active');
                    let element = $(`[data-variant-option-id=${valueWantToChange.id}] > input[type="radio"]`);
                    if (element && element.length) {
                        $(element).prop("checked", true);
                    }
                }
            }
            $('.span-product-sku').text(GlobalProducts.productByUniqId[key].sku);
        }
        buildChangeVariant(valueWantToChange);
        replaceSelectSizeText('variant-size', dataOptionId);
        if (changingVariants.slug == 'size' && GlobalSelectSize) {
            document.getElementsByClassName('product-addtocart')[0].click();
            GlobalSelectSize = false;
        }
    }

    function selectVariant(selector, skipBuildGallery = false) {
        if (selector.currentTarget) selector = $(selector.currentTarget);

        $(selector).addClass("active");
        if ($(selector).hasClass("error")) {
            $(selector).removeClass("error");
        }
        let dataOptionId = $(selector).val();
        let id = selector.attr("data-variant-id");
        let key = dataOptionId;

        cacheOption(id, dataOptionId)
        if (!id || !dataOptionId) return;
        let changingVariants = GlobalVariants.variants.find((varian) => {
            if (id == varian.id) return varian;
        });

        let valueWantToChange = changingVariants.values.find((value) => {
            if (value.id == dataOptionId) return value;
        });

        if (changingVariants.slug == 'size') {
            let elements = selector.children();
            elements.each((index, element) => {
                let id = $(element).attr('value');
                if (id) {
                    id = parseInt(id);
                    if (id == -1) {
                        $(element).remove();
                    }
                }
            })
            GlobalIsSelectSize = true;
        }
        let selectedOption = selector.find(`option[value="${dataOptionId}"]`);
        if (selectedOption && selectedOption.attr("data-sku-key")) {
            key = selectedOption.attr("data-sku-key");
        } else {
            key = buildKey(GlobalVariantIds, id, key);
        }
        let rebuildOption = false;
        if (!GlobalProducts.productByUniqId[key]) {
            key = buildCallbackProductVariantKey(key, id, valueWantToChange);
            rebuildOption = true;
        }
        if (typeof GlobalProducts.productByUniqId[key] != "undefined") {
            var spid = GlobalProducts.productByUniqId[key].id;
            buildInfoItem(spid, GlobalProducts.productById);
            if (!skipBuildGallery) {
                buildGallery(GlobalProducts.productByUniqId[key]);
            }
            if (rebuildOption) {
                let domOption = buildDomOption(changingVariants.type, changingVariants, parseInt(selector.attr('data-show-invalid')), spid);
                if (domOption) {
                    selector.html(domOption);
                    selector.val(valueWantToChange.id);
                }
            }
            $('.span-product-sku').text(GlobalProducts.productByUniqId[key].sku);
        }
        buildChangeVariant(valueWantToChange);
        replaceSelectSizeText('variant-size', dataOptionId);
    }

    function buildCallbackProductVariantKey(key, variantId, valueWantToChange) {
        let oldOptionIds = key.split('-');
        let optionByVariant = {};
        for (let variant of GlobalVariants.variants) {
            let optionIds = variant.values.map(item => item.id + '');
            for (let optionId of oldOptionIds) {
                if (optionIds.includes(optionId)) {
                    optionByVariant[variant.id] = optionId;
                }
            }
        }
        let optionIds = Object.values(getOptionIds(optionByVariant, valueWantToChange, optionByVariant));
        let newKey = optionIds.join('-');
        if (!GlobalProducts.productByUniqId[newKey]) {
            let currentIndex = 0;
            for (let index in GlobalVariantIds) {
                if (GlobalVariantIds[index] == variantId) {
                    currentIndex = parseInt(index);
                    break;
                }
            }
            for (let index = currentIndex; index >= 0; index--) {
                let likeIds = oldOptionIds.slice(0, index + 1);
                let likeKey = likeIds.join('-');
                let likeKeyReverse = likeIds.reverse().join('-');
                let minPrice = 9999999999999;
                for (let uniqKey in GlobalProducts.productByUniqId) {
                    if (uniqKey.indexOf(likeKey) == 0) {
                        if (variantsStatistic[likeKey] || variantsStatistic[likeKeyReverse]) {
                            let statistic = variantsStatistic[likeKey] ? variantsStatistic[likeKey] : variantsStatistic[likeKeyReverse];
                            if (statistic.price == GlobalProducts.productByUniqId[uniqKey].price) {
                                newKey = uniqKey;
                                break;
                            }
                        } else if (parseFloat(GlobalProducts.productByUniqId[uniqKey].price) < parseFloat(minPrice)) {
                            newKey = uniqKey;
                            minPrice = parseFloat(GlobalProducts.productByUniqId[uniqKey].price);
                        }
                    }
                }
                if (GlobalProducts.productByUniqId[newKey]) {
                    break;
                }
            }
        }
        if (!GlobalProducts.productByUniqId[newKey]) {
            let firstVariant = GlobalVariants.variants[0];
            let newValueWantToChange = null;
            for (let value of firstVariant.values) {
                for (let item of value.options) {
                    if (item.id == valueWantToChange.id) {
                        newValueWantToChange = value;
                    }
                }
                if (newValueWantToChange) {
                    break;
                }
            }
            if (newValueWantToChange) {
                let optionByVariant = {};
                let oldOptionIds = newKey.split('-');
                for (let variant of GlobalVariants.variants) {
                    let optionIds = variant.values.map(item => item.id + '');
                    for (let optionId of oldOptionIds) {
                        if (optionIds.includes(optionId)) {
                            optionByVariant[variant.id] = optionId;
                        }
                    }
                }
                optionIds = Object.values(getOptionIds(optionByVariant, newValueWantToChange, optionByVariant));
                newKey = optionIds.join('-');
            }
        }
        if (GlobalProducts.productByUniqId[newKey]) {
            for (let variant of GlobalProducts.productByUniqId[newKey].variants) {
                cacheOption(variant.variant_id, variant.id);
            }
        }


        return newKey;
    }

    function cacheOption(variantId, optionId) {
        if (variantId && optionId) {
            variantCacheData[variantId] = optionId;
        }
    }

    function getOptionFromCache(variantId) {
        return variantCacheData && variantCacheData[variantId] !== null ? variantCacheData[variantId] : null;
    }

    function isContainOption(options, optionId) {
        var isContain = false;
        if (optionId && options && Array.isArray(options)) {
            for (let opt of options) {
                if (opt && opt.id == optionId) {
                    isContain = true;
                    break;
                }
            }
        }
        return isContain;

    }

    function hasOption(variant, optionId) {
        let retVal = false;
        if (variant.type == 'OPTION') {
            let element = $(`#js-select-variant-${variant.id} option[value=${optionId}]`);
            if (element.length) {
                retVal = true;
            } else if (variant.slug == 'size') {
                element = $(`#js-select-variant-${variant.id} .js-choose-variant[data-variant-option-id=${optionId}]`);
                if (element.length) {
                    retVal = true;
                }
            }
        } else {
            let element = $(`#js-select-variant-${variant.id} .js-choose-variant[data-variant-option-id=${optionId}]`);
            if (!element.length && variant.type == 'PREVIEW') {
                element = $(`.more-product-content .js-choose-variant[data-variant-option-id=${optionId}]`);
            }
            if (element.length) {
                retVal = true;
            }
        }

        return retVal;
    }

    function getOptionIds(optionByVariant, valueWantToChange, result = {}) {
        result[valueWantToChange.variant_id] = valueWantToChange.id;
        cacheOption(valueWantToChange.variant_id, valueWantToChange.id);
        if (valueWantToChange.options && valueWantToChange.options.length) {
            let option = valueWantToChange.options[0];
            let availableOptionIds = valueWantToChange.options.map(value => value.id);
            let values = []
            for (let item of GlobalVariants.variants) {
                if (item.id == option.variant_id) {
                    values = item.values;
                    break;
                }
            }
            for (let item of values) {
                // style
                if (valueWantToChange.variant_id == 5 &&  item && item.variant_id == 7) {
                    if (item.id == 155) {
                        option = item;
                        break;
                    }

                } else if (availableOptionIds.includes(item.id)) {
                    option = item;
                    break;
                }
            }

            for (let item of valueWantToChange.options) {
                if (optionByVariant[valueWantToChange.variant_id] == item.id) {
                    option = item;
                    break;
                }
            }
            result = getOptionIds(optionByVariant, option, result);
        }

        return result;
    }

    function buildKey(variantIds, currentId, key) {
        let isUseSize = false;
        let isUseStyle = false;
        if (currentId == 1) {
            isUseSize = true;
        } else if (currentId == 7) {
            isUseStyle = true;
        }
        for (var i = 0; i < variantIds.length; i++) {
            if (variantIds[i] == currentId) {
                continue;
            }
            let optionBySize = "";
            let optionByStyle = "";
            var optionId = null;
            var elmId = "#js-select-variant-" + variantIds[i];
            if (enableMultipleSize && $(elmId).attr('data-size')) {
                optionId = $(elmId).attr('data-size');
            } else {
                var childActive = $(elmId + " .js-choose-variant.active");
                if (!childActive.length && variantIds[i] == 7) {
                    childActive = $(".more-product-style-list .js-choose-variant.active");
                    if (childActive) {
                        $(elmId + " .js-choose-variant").each((index, ele) => {
                            $(ele).removeClass('active');
                        });
                    }
                } else if (variantIds[i] == 7) {
                    $(".more-product-style-list .js-choose-variant").each((index, ele) => {
                        $(ele).removeClass('active');
                    })
                }
                if (childActive) {
                    optionId = childActive.attr("data-variant-option-id")
                }
                if (!optionId) {
                    optionId = $("#js-select-variant-" + variantIds[i]).val();
                }
                if (optionId == -1) {
                    if (variantIds[i] == 1) {
                        let optionElements = $("#js-select-variant-" + variantIds[i] + ' option');
                        if (optionElements.length > 1) {
                            optionId = $(optionElements[1]).attr('value');
                        }
                    } else {
                        let sizeVariant = GlobalDefaultVariant.variants.find(i => i.variant_slug == "size");
                        if (sizeVariant && sizeVariant.id) {
                            optionBySize = sizeVariant.id;
                        }
                    }
                    let styleVariant = GlobalDefaultVariant.variants.find(i => i.variant_slug == "style");
                    if (styleVariant && styleVariant.id) {
                        optionByStyle = styleVariant.id;
                    }
                }
            }
            if (optionId && optionId != -1) {
                key += "-" + optionId;
            }
            else if (optionBySize != "" && !isUseSize) {
                isUseSize = true;
                key += "-" + optionBySize;
            }
            else if (optionByStyle != "" && !isUseStyle) {
                isUseStyle = true;
                key += "-" + optionByStyle;
            }
        }
        return key;
    }

    function buildChangeVariant(valueWantToChange) {
        if (valueWantToChange) {
            let anotherVariants = GlobalVariants.variants.filter((variant) => {
                if (valueWantToChange.variant != variant.name) return variant;
            });
            if (anotherVariants.length) {
                anotherVariants.forEach((variant, index) => {
                    let selectorVariant = $("#js-select-variant-" + variant.id);
                    let selectorVariantName = $("#js-variant-name-" + variant.id);
                    let showInvalid = parseInt($(selectorVariant).attr('data-show-invalid'));
                    let domOption = buildDomOption(variant.type, variant, showInvalid);
                    selectorVariant.html(domOption);
                    let value = null;
                    if (variant.values && variant.values.length) {
                        if (valueWantToChange
                            && valueWantToChange.variant_id == 5
                            && variant.slug == 'style'
                        ) {
                            for (let item of variant.values) {
                                if (item.id == 155) {
                                    value = item.id;
                                    break;
                                }
                            }
                        }
                        if (!value) {
                            for (let item of variant.values) {
                                if (hasOption(variant, item.id)) {
                                    value = item.id;
                                    break;
                                }
                            }
                        }

                    }
                    let valueFromCache = getOptionFromCache(variant.id);
                    if (valueFromCache && isContainOption(variant.values, valueFromCache) && hasOption(variant, valueFromCache)) {
                        value = valueFromCache;
                    }
                    if (variant.type == "OPTION") {
                        if (variant.slug == 'size' && enableMultipleSize) {
                            $(selectorVariant).attr('data-size', value);
                        }
                        if (variant.slug != 'size' || (variant.slug == 'size' && GlobalIsSelectSize)) {
                            $(selectorVariant).val(value);
                            if (variant.slug == 'size' && GlobalIsSelectSize) {
                                $('#js-choose-size-value').text($('#js-choose-variant-' + value + ' .product-size-item-content').text());
                            }
                        }
                    } else {
                        $(selectorVariant).val(value);
                        $(`[data-variant-option-id=${value}]`).addClass('active');
                        let element = $(`[data-variant-option-id=${value}] > input[type="radio"]`);
                        if (element && element.length) {
                            $(element).prop("checked", true);
                        }
                    }
                });
            }
        }
    }

    function getVariantFromValueOption(options, arrVariants = []) {
        if (options.length) {
            let option = options[0];
            let variantId = option.variant_id;
            let variant = GlobalVariants.variants.find((variant) => {
                if (variantId == variant.id) {
                    variant.options = options;
                    variant.values = options;
                    return variant;
                }
            });
            arrVariants.push(variant);
            return getVariantFromValueOption(option.options, arrVariants);
        }

        return arrVariants;
    }

    function hasLikeOption(likeKey, valueId) {
        let retVal = false;
        let key = likeKey + '-' + valueId;
        let productUniqKeys = Object.keys(GlobalProducts.productByUniqId);
        for (let uniqKey of productUniqKeys) {
            if (uniqKey.indexOf(key) == 0) {
                retVal = true;
                break;
            }
        }

        return retVal;
    }

    function buildDomOption(type, variant, showInvalid = false, currentSpid = false) {
        let dom = "";
        let values = variant.values;
        let key = "";
        if (!currentSpid) {
            currentSpid = $("#productSkuId").val();
        }
        let currentProductBySpid = GlobalProducts.productById[currentSpid];
        let variantId = variant.id;
        if (currentProductBySpid) {
            currentProductBySpid.variants.forEach(element => {
                if (element.variant_id != variantId) {
                    key += "-" + element.id;
                }
            });
            let likeKey = [];
            for (let item of currentProductBySpid.variants) {
                if (item.variant_id != variantId) {
                    likeKey.push(item.id);
                } else {
                    break;
                }
            }
            likeKey = likeKey.join('-');
            switch (type) {
                case "OPTION":
                    if (enableMultipleSize && !isCustomDesign && variant.slug == 'size' ) {
                        if (!GlobalIsSelectSize) {
                            dom += `<li class="product-size-item close-choose-size">
                                <span class="product-size-item-content">${multiSizeText.chooseASize}</span>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </span>
                            </li>`;
                        }
                        values.forEach((value) => {
                            if (
                                key != "" && GlobalProducts.productByUniqId[value.id + key] &&
                                !(typeof isHidePrice != "undefined" && isHidePrice)
                            ) {
                                dom += `<li
                                    id="js-choose-variant-${value.id}"
                                    class="product-size-item select-a-size js-choose-variant"
                                    data-variant-id="${variant.id}"
                                    data-variant-option-id="${value.id}"
                                    title="${value.name}"
                                    data-variant-name="${value.name}"
                                >
                                    <span class="product-size-item-content">
                                    ${value.name}
                                    (${GlobalProducts.productByUniqId[value.id + key].display_price})
                                </span>
                                </li>`;
                            }
                        });
                        dom += `<li class="product-size-item open-multiple-size">
                            <span>${multiSizeText.orderMultipleSize}</span>
                        </li>`;
                    } else {
                        values.forEach((value) => {
                            let keySplit = [];
                            let prefixVariant = '';
                            let variantIsOk = true;
                            if (variant.slug == 'style') {
                                keySplit = key.split('-');
                                if (keySplit && keySplit.length >= 2) {
                                    prefixVariant = keySplit[1] + '-' + value.id;
                                    variantIsOk = false;
                                    if (prefixVariant && variantsStatistic) {
                                        if (variantsStatistic[prefixVariant]) {
                                            variantIsOk = true;
                                        } else if (variantsStatistic[value.id + '-' + keySplit[1]]) {
                                            variantIsOk = true;
                                            prefixVariant = value.id + '-' + keySplit[1];
                                        }
                                    }

                                }
                            }

                            if (variantIsOk && (GlobalProducts.productByUniqId[value.id + key] || showInvalid)) {
                                if (
                                    key != "" && GlobalProducts.productByUniqId[value.id + key] &&
                                    !(typeof isHidePrice != "undefined" && isHidePrice)
                                ) {
                                    dom += `<option value="${value.id}" data-sku-key="${value.id + key}">${value.name} (${GlobalProducts.productByUniqId[value.id + key].display_price})</option>`;
                                } else if (variant.slug == 'style' && key){
                                    if (
                                        prefixVariant &&
                                        variantsStatistic &&
                                        variantsStatistic[prefixVariant] &&
                                        !(typeof isHidePrice != "undefined" && isHidePrice)
                                    ) {
                                        dom += `<option value="${value.id}">${value.name} (${variantsStatistic[prefixVariant].display_price})</option>`;
                                    }
                                }
                            }
                        });
                    }
                    break;
                case "PREVIEW":
                    let variantLimit = 5;
                    let maxDisplayedKey = 0;
                    let displayedVariant = 0;
                    let maxAvailableKey = 0;
                    let availableVariant = 0;
                    for (let index = 0; index < values.length; index++) {
                        let value = values[index];
                        if (GlobalProducts.productByUniqId[value.id + key] || hasLikeOption(likeKey, value.id) || showInvalid) {
                            if (displayedVariant < variantLimit) {
                                maxDisplayedKey = index;
                                displayedVariant++;
                                let imageUrl = null;
                                if(!GlobalProducts.productByUniqId[value.id + key]) {
                                    let productUniqKeys = Object.keys(GlobalProducts.productByUniqId);
                                    for (let uniqKey of productUniqKeys) {
                                        if (uniqKey.indexOf(`${likeKey}-${value.id}-`) == 0) {
                                            imageUrl = GlobalProducts.productByUniqId[uniqKey].image_url;
                                            break;
                                        }
                                    }
                                    if (!imageUrl) {
                                        for (let uniqKey of productUniqKeys) {
                                            if (uniqKey.indexOf(`${value.id}-`) == 0) {
                                                imageUrl = GlobalProducts.productByUniqId[uniqKey].image_url;
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    imageUrl = GlobalProducts.productByUniqId[value.id + key]['image_url'];
                                }
                                dom += `
                                <div
                                    id="js-choose-variant-${value.id}"
                                    class="js-choose-variant choose-variant-style flex-b align-c column"
                                    data-url="${variant.id}"
                                    data-variant-id="${variant.id}"
                                    data-variant-option-id="${value.id}"
                                    title="${value.name}"
                                    data-variant-name="${value.name}"
                                >
                                    <span class="choose-style-variant variant-image-item" title="${value.name}">
                                        <img
                                            src="${ getImageCdn(imageUrl, 100, 100) }"
                                            alt="${value.name}"
                                            title="${value.name}"
                                            class="w-full img-round"
                                        >
                                    </span>
                                </div>
                                `;
                            }
                            maxAvailableKey = index;
                            availableVariant++;
                        }
                    }

                    if (availableVariant > displayedVariant) {
                        $('#js-more-product-style').removeClass('hidden');
                        let moreDom = '';
                        for (let index = maxDisplayedKey + 1; index < values.length; index++) {
                            let value = values[index];
                            if (GlobalProducts.productByUniqId[value.id + key] || showInvalid) {
                                let imageUrl = null;
                                if(!GlobalProducts.productByUniqId[value.id + key]) {
                                    let productUniqKeys = Object.keys(GlobalProducts.productByUniqId);
                                    for (let uniqKey of productUniqKeys) {
                                        if (uniqKey.indexOf(`${value.id}-`) == 0) {
                                            imageUrl = GlobalProducts.productByUniqId[uniqKey].image_url;
                                            break;
                                        }
                                    }
                                } else {
                                    imageUrl = GlobalProducts.productByUniqId[value.id + key]['image_url'];
                                }
                                moreDom += `
                                <div class="more-product-style-item">
                                    <div
                                        class="js-choose-variant AttributeValueThumbnail AttributeValueThumbnail--hasMoreInfoButton AttributeValueThumbnail--hoverEnabled AttributeValueThumbnail--selected AttributeValueThumbnail--sizeM"
                                        data-variant-id="${variant.id}"
                                        data-variant-option-id="${value.id}"
                                        data-variant-name="${value.name}"
                                    >
                                        <img src="${ getImageCdn(imageUrl, 300, 300) }" alt=""${value.name}" class="attribute-value-thumbnail">
                                    </div>
                                    <div class="variant-style-title">${value.name}</div>
                                </div>`;
                            }
                        }
                        $('.more-product-style-list .more-product-content').html(moreDom);
                    } else {
                        $('#js-more-product-style').addClass('hidden');
                        $('.more-product-style-list .more-product-content').html('');
                    }

                    break;
                case "IMAGE":
                    values.forEach((value) => {
                        if (GlobalProducts.productByUniqId[value.id + key] || showInvalid) {
                            let variantImageUrl = value.image_url;
                            if (GlobalProducts.productByUniqId[value.id + key]) {
                                variantImageUrl = GlobalProducts.productByUniqId[value.id + key].image_url;
                            }
                            dom += `
                            <div
                                id="js-choose-variant-${variant.id}"
                                class="p-p5 js-choose-variant choose-image-variant "
                                data-variant-id="${variant.id}"
                                data-variant-option-id="${value.id}"
                                data-variant-name="${value.name}"
                                title="${value.name}"
                            >
                                <img src="${getImageCdn(variantImageUrl, 100, 100)}" alt="${value.name}" class="w-full img-round">
                            </div>
                            `;
                        }
                    });
                    break;
                case "RADIOBOX":
                    values.forEach((value) => {
                        if (GlobalProducts.productByUniqId[value.id + key] || showInvalid) {
                            dom += `
                            <label
                                id="js-choose-variant-${value.id}"
                                class="js-choose-variant radio-label"
                                data-url="${variant.id}"
                                data-variant-id="${variant.id}"
                                data-variant-option-id="${value.id}"
                                data-variant-name="${value.name}"
                                data-variant-option-slug="${value.slug ? value.slug : ''}"
                                title="${value.name}"
                                data-type="radio"
                            >
                                <input class="radio-selector__radio radio-input" type="radio" name="radio-${variant.id}">
                                <span class="radio-selector__select radio-name">${value.name}</span>
                            </label>
                            `;
                        }
                    });
                    break;

                default:
                    break;
            }
        }
        return dom;
    }

    function buildItem(spid, productById, skipBuildGallery = false) {
        if (typeof productById[spid] != "undefined") {
            var product = productById[spid];
            var currentSpid = getParameterByName("spid");
            if (typeof product.variants != "undefined" && product.variants.length > 0) {
                product.variants.forEach(function (item) {
                    cacheOption(item.variant_id, item.id)
                    if (item.variant_type == "OPTION" && (item.variant_slug != 'size' || (GlobalIsSelectSize && !enableMultipleSize))) {
                        $("#js-select-variant-" + item.variant_id).val(item.id);
                    } else if (item.variant_type == "OPTION" && item.variant_slug == 'size' && enableMultipleSize) {
                        $("#js-select-variant-" + item.variant_id).attr('data-size', item.id);
                    } else {
                        $("#js-choose-variant-" + item.id).addClass("active");
                        var dataOptionId = $("#js-choose-variant-" + item.id).data('variant-option-id');
                        replaceSelectSizeText('variant-size', dataOptionId, false);
                        let element = $("#js-choose-variant-" + item.id + ' > input[type="radio"]');
                        if (element && element.length) {
                            $(element).prop("checked", true);
                        }
                    }
                });
            }
        }
    }

    function buildInfoItem(spid, productById, isPushState = true) {
        if (typeof productById[spid] != "undefined") {
            if (productById[spid].variants.length > 0) {
                productById[spid].variants.forEach(function (item) {
                    $(`#js-variant-name-${item.variant_id}`).text(item.name);
                    $(`#js-preview-variant-name-${item.variant_id}`).text(item.name);
                });
            }
            $(".js-productSkuId").val(spid).trigger('change');
            if (typeof nameTemplate != "undefined" && nameTemplate != "") {
                var title = nameTemplate;
                productById[spid].variants.forEach(function (item) {
                    if (title.includes(`{${item.variant}}`)) {
                        title = title.replaceAll(`{${item.variant}}`, `${item.name}`);
                    }
                });
                $(".js-product-name").text(title);
            }
            if (productById[spid].sku != "") {
                $("#js-sku").text(productById[spid].sku);
            } else {
                $("#js-contain-sku").hide();
            }
            var price = parseInt(productById[spid].price);
            var highPrice = parseInt(productById[spid].high_price);
            var priceText = productById[spid].display_price;
            var highPriceText = productById[spid].display_high_price;
            var classPrice = "sale-price";
            if (highPrice > 0) {
                classPrice = "sale-price";
            }
            if (productById[spid].sale_percent != "" && canChangePrice) {
                $("#js-sale-percent").html(productById[spid].sale_percent);
            } else {
                $("#js-sale-percent").hide();
            }
            if (
                productById[spid].display_drop_price != "" &&
                !(typeof isHidePrice != "undefined" && isHidePrice) &&
                canChangePrice
            ) {
                $("#js-display-drop-price").html("(" + productById[spid].display_drop_price + ")");
            } else {
                $("#js-display-drop-price").hide();
            }
            if (!(typeof isHidePrice != "undefined" && isHidePrice) ||
                canChangePrice
            ) {
                $(".product-price").text(priceText);
                if (highPrice > price) {
                    $(".product-high-price").text(highPriceText);
                } else {
                    $(".product-high-price").text("");
                }
            }
            if (isPushState) {
                var url = window.location.href;
                var currentSpid = getParameterByName("spid");
                if (currentSpid) {
                    url = url.replace("spid=" + currentSpid, "spid=" + spid);
                } else {
                    if (url.indexOf("?") !== -1) {
                        url += "&spid=" + spid;
                    } else {
                        url += "?spid=" + spid;
                    }
                }
                history.replaceState(null, null, url);
                window.dispatchEvent(new Event('popstate'));
                window.dispatchEvent(new Event('variantChanged'));
            }

            var productClone = productById[spid];
            productClone.name = title;
            if (!productClone.status || productClone.status == 'ACTIVE') {
                $('.add-to-cart-btn').removeClass('hidden');
                $('.product-contact').addClass('hidden');
            } else {
                $('.add-to-cart-btn').addClass('hidden');
                $('.product-contact').removeClass('hidden');
            }
            buildDataForAddToCartBtn(productClone);
        } else {
            let options = $(".js-swipe-container").attr("data-options");
            if (options) {
                options = JSON.parse(options);
            } else {
                options = {
                    direction: "horizontal",
                    loop: true,
                };
            }

            options.navigation = {
                nextEl: ".mdi-chevron-left",
                prevEl: ".mdi-chevron-right",
            };
        }
    }

    function buildDataForAddToCartBtn(variant) {
        $(".tt-btn-addtocart").attr("data-name", variant.name);
        $(".tt-btn-addtocart").attr("data-id", variant.product_id);
        $(".tt-btn-addtocart").attr("data-sku-id", variant.id);
        $(".tt-btn-addtocart").attr("data-image", variant.image_url);
        $(".tt-btn-addtocart").attr("data-price", variant.price);
        $(".tt-btn-addtocart").attr("data-slug", toFriendlyString(variant.name));
        $(".tt-btn-addtocart").attr("data-quantity", parseInt($(".detail-product-quantity").val()));
    }

    function buildVariantBase() {
        var retVal = {};
        var variantIds = [];
        var variantById = {};
        var variantOptionById = {};
        if (GlobalVariants.variants) {
            for (var i = 0; i < GlobalVariants.variants.length; i++) {
                variantIds.push(GlobalVariants.variants[i].id);
                variantById[GlobalVariants.variants[i].id] = GlobalVariants.variants[i].name;
                for (var j = 0; j < GlobalVariants.variants[i].values.length; j++) {
                    variantOptionById[GlobalVariants.variants[i].values[j].id] = GlobalVariants.variants[i].values[j].name;
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
        if (GlobalVariants.productVariants) {
            GlobalVariants.productVariants.forEach(function (item) {
                productById[item.id] = item;
                var variantOptionIds = [];
                item.variants.forEach(function (it) {
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

    if ($('#js-product-content').is(':visible') == true && screen.width > 1030) {
        var productContent = $('.product-detail-description').height();
        $('.product-more-content').click(function() {
            $('html, body').animate({scrollTop: $('.product-detail').offset().top + 20}, 500);
            if (!$('.product-detail-content').hasClass('extra-content')) {
                $('.product-more-text').hide();
                $('.product-less-text').css('display', 'inline-flex');
                $('.product-detail-content').animate({height: $('.product-detail-description').height()});
                $('.product-detail-content').addClass('extra-content');
                $('.product-detail-content').removeClass('product-content-effect');
            } else {
                $('.product-more-text').css('display', 'inline-flex');
                $('.product-less-text').hide();
                if ($('.product-detail-content').hasClass('has-video')) {
                    $('.product-detail-content').animate({height: 830}, 100);
                } else {
                    $('.product-detail-content').animate({height: 130}, 100);
                }
                $('.product-detail-content').removeClass('extra-content');
                $('.product-detail-content').addClass('product-content-effect');
            }
        });
        if (productContent > 135) {
            $('.product-more-content').css('display', 'block');
            $('.product-detail-content').addClass('product-content-effect');
        } else {
            $('.product-more-content').hide();
        }
    } else if (screen.width < 1030) {
        $('.product-more-content').css('display', 'none');
    }

    function getRelatedDropPrice() {
        $.ajax({
            method: "GET",
            url: "/product/related-drop-price?id=" + $("#productId").val(),
        }).done(function (response) {
            if (response.status == "successful" && response.result.length > 0) {
                let html = ``;
                let className = "available-list-product-mobile";
                if (typeof jsNotMobile !== "undefined" && jsNotMobile) {
                    className = "available-list-product"
                }
                var locale = '';
                // if (typeof localePrefix !== 'undefined' && localePrefix !== '') {
                //     locale = '/' + localePrefix;
                // }
                html += `<div class="${className}">`;
                response.result.forEach(element => {
                    html += `<div class="available-product-item" style="margin-bottom: 10px;">
                    <div class="available-product">
                    <a href="${locale}${element.url}?internal_source=related-product" class="available-product-link">
                        <picture>
                            <source media="(min-width: 760px)" srcset="${getImageCdn(element.image_url, 630, 630, true)}" />
                            <source media="(min-width: 370px)" srcset="${getImageCdn(element.image_url, 320, 320, true)}" />
                            <source media="(min-width: 320px)" srcset="${getImageCdn(element.image_url, 159, 159, true)}" />
                            <img src="/images/blank.gif" alt="${element.name}" />
                        </picture>
                    </a>
                    <div class="available-product-info">
                        <a href="${locale}${element.url}?internal_source=related-product" class="available-product-link">
                            <div class="available-product-title">${element.name}</div>
                        </a>`;
                    if (element.value && Math.round(element.value) > 0 && Math.round(element.value) < 100) {
                        html += `
                            <div class="sale-off-box">
                                <span>${isShowOffText ? Math.round(element.value) : "-" + Math.round(element.value)}%</span>`;
                        if (isShowOffText) {
                            html += `<small style="text-transform: uppercase;">${offText}</small>`;
                        }
                        html += `</div>`;
                    }
                    html += `</div></div></div>`;
                });
                html += `</div></div>`;
                $("#related-drop-price").find(".slider-effect").html(html);
                $("#related-drop-price").show();
                $("#related-drop-price").find(".available-list-product").slick({
                    slidesToShow: 6,
                    slidesToScroll: 6,
                    autoplay: false,
                    autoplaySpeed: 2000,
                    infinite: false,
                    responsive: [
                        {
                            breakpoint: 1440,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4,
                                arrows: false,
                            },
                        },
                        {
                            breakpoint: 1280,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                                arrows: false,
                            },
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2,
                                arrows: false,
                            },
                        }
                    ],
                });
            }
        });
    }

    function replaceSelectSizeText(selector, optionId, changeVariant = true) {
        var option = $('.js-choose-variant');
        // var variantValue = $(`select[name=${selector}] option:selected`).val();
        // var variantStyle = $('select[name=variant-style] option:selected').val();
        var isChangeText = false;
        option.each(function(e) {
            var optionSlug = $(this).data('variant-option-slug');
            if (optionSlug && isNaN(optionSlug) && optionSlug.includes(womenText) && $(this).hasClass('active')) {
                isChangeText = true;
            }
        });
        if (isChangeText) {
            if (selectedStyleText !== "[]") {
                let spid = GlobalSpid;
                if (changeVariant) {
                    spid = getParameterByName("spid");
                }
                var product = GlobalProducts.productById[spid];
                var activeId = -1
                if (product.variants) {
                    product.variants.forEach(element => {
                        if (element.variant_slug == "style") {
                            activeId = element.id
                        }
                    });
                }
                var objectNote =  JSON.parse(selectedStyleText);
                var noteKeys = Object.keys(objectNote);
                var found = false;
                for (var idx of noteKeys) {
                    if (idx == activeId) {
                        selectSizeReplace = objectNote[idx];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    selectSizeReplace = '';
                }
            }
            $(`.text-select-size-woman`).text(selectSizeReplace);
        } else {
            $(`.text-select-size-woman`).text("");
        }
    }
    // getRelatedDropPrice();
    function getRelatedProduct() {
            $.ajax({
                url: "/product/recommendation?id=" + $("#productId").val(),
                method: "GET",
            }).done(function (response) {
                if (response.status == "successful" && response.result && response.result.length > 0) {
                    let listPro = [];
                    response.result.forEach(element => {
                        listPro.push(element.id);
                    });
                    $("#product-recommendation").val(listPro.join(","));
                }
            });
    }
    getRelatedProduct();
    window.checkSizeBeforeAddToCart = function() {
        let result = true;
        var product = GlobalProducts.productById[GlobalSpid];
        let hasSize = false;
        let hasStyle = false;
        let hasType = false;
        let sizeId = 0;
        let styleId = 0;
        let typeId = 0
        if (product && product.variants && product.variants.length > 0) {
            product.variants.forEach(element => {
                if (element.variant_slug == 'type') {
                    hasType = true;
                    typeId = element.variant_id;
                }
                if (element.variant_slug == 'size') {
                    hasSize = true;
                    sizeId = element.variant_id;
                }
                if (element.variant_slug == 'style') {
                    hasStyle = true;
                    styleId = element.variant_id;
                }
            });
        }
        if (GlobalHasOverwriteDefaultSku && hasType && typeId) {
            let elements = $(`.js-choose-variant.hide-active[data-variant-id="${typeId}"]`);
            if (elements.length) {
                result = false;
                $(elements).each((index, ele) => {
                    $(ele).addClass('error');
                    setTimeout(() => {
                        $(ele).removeClass('error');
                    }, 100);
                    setTimeout(() => {
                        $(ele).addClass('error');
                    }, 200);
                })
            }
        }
        if (hasSize) {
            let element = $("#js-select-variant-" + sizeId + "[data-size]");
            if (element && element.length) {
                if (!GlobalIsSelectSize || !element.attr('data-size')) {
                    result = false;
                    GlobalSelectSize = true;
                }
                if (!result) {
                    $('#js-select-size-multiple').addClass('active');
                    if (screen.width < 1030 && !$('#js-choose-variant-popup').length) {
                        $('html, body').animate({
                            scrollTop: $('#js-select-size-multiple').offset().top - 100
                        }, 200);
                    }
                    $('#js-select-size-multiple').addClass('error');
                    setTimeout(() => {
                        $('#js-select-size-multiple').removeClass('error');
                    }, 100);
                    setTimeout(() => {
                        $('#js-select-size-multiple').addClass('error');
                    }, 200);
                }
            } else {
                let value = $("#js-select-variant-" + sizeId).val();
                if (value == -1) {
                    result = false;
                }
                if (!result) {
                    $("#js-select-variant-" + sizeId).addClass('active');
                    if (screen.width < 1030 && !$('#js-choose-variant-popup').length) {
                        $('html, body').animate({
                            scrollTop: $("#js-select-variant-" + sizeId).offset().top - 100
                        }, 200);
                    }
                    $("#js-select-variant-" + sizeId).addClass('error');
                    setTimeout(() => {
                        $("#js-select-variant-" + sizeId).removeClass('error');
                    }, 100);
                    setTimeout(() => {
                        $("#js-select-variant-" + sizeId).addClass('error');
                    }, 200);
                }
            }

        }
        if (hasStyle) {
            let value = $("#js-select-variant-" + styleId).val();
            if (value == -1) {
                result = false;
                $("#js-select-variant-" + styleId).addClass('active');
                if (screen.width < 1030) {
                    $('html, body').animate({
                        scrollTop: $("#js-select-variant-" + styleId).offset().top - 100
                    }, 200);
                }
                $("#js-select-variant-" + styleId).addClass('error');
                setTimeout(() => {
                    $("#js-select-variant-" + styleId).removeClass('error');
                }, 100);
                setTimeout(() => {
                    $("#js-select-variant-" + styleId).addClass('error');
                }, 200);
            }
        }
        return result;
    }
    function getProductVariants() {
        return $.ajax({
            method: "GET",
            url: "/product/variant?id=" + $("#productId").val(),
        });
    }

    window.addEventListener('selectVariant', function (event) {
        selectVariant(event.detail);
    })

    $('.choose-variant-style').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    $(document).on('click', '#js-more-product-style', function () {
        $('body').addClass('open-variant');
        $('.more-product-style-list').addClass('active loading');
        setTimeout(function () {
            $('.more-product-style-list').removeClass('loading')
        }, 1000)
    })
    $(document).on('click', '.more-product-close, .more-product-bg', function () {
        $('body').removeClass('open-variant');
        $('.more-product-style-list').removeClass('active')
    })

    var quantityNumber = $("#quantity").val();
    if (quantityNumber > 1) {
        $(".product-quantity-sub").removeClass('disabled')
    }

    $(".product-quantity-sub").click(function() {
        let quantity = $("#quantity").val();
        if (quantity > 1) {
            quantity--;
            $('#quantity').val(quantity);
            $('#quantity').trigger('change');
            $('.quantity-box').removeClass('quantity-error');
            $('.js-addtocart-note-sub, .js-addtocart-note-add').fadeOut();
            $('.product-quantity-sub, .product-quantity-add').removeClass('disabled');
        } else {
            $('.js-addtocart-note-sub').show();
            $(".product-quantity-sub").addClass('disabled')
            $('.quantity-box').addClass('quantity-error')
        }
    });
    $(".product-quantity-add").click(function() {
        let quantity = $("#quantity").val();
        if (quantity < 50) {
            quantity++;
            $('#quantity').val(quantity);
            $('#quantity').trigger('change');
            $('.quantity-box').removeClass('quantity-error');
            $('.js-addtocart-note-sub, .js-addtocart-note-add').fadeOut();
            $('.product-quantity-sub, .product-quantity-add').removeClass('disabled');
        } else {
            $('.js-addtocart-note-add').show();
            $(".product-quantity-add").addClass('disabled')
            $('.quantity-box').addClass('quantity-error')
        }
    });

    $("#quantity").change(function () {
        let quantity = $("#quantity").val();
        if (quantity > 50) {
            $("#quantity").val(50);
            $("#quantity").trigger('change');
        }
        if (quantity < 1) {
            $("#quantity").val(1);
            $("#quantity").trigger('change');
        }
    });

    $(document).on('click', '.prod-rating-wrap', function () {
        $('html, body').animate({scrollTop: $('#reviews').offset().top}, 700);
    })
    // product-info-detail-contain .product-variant-wrapper .add-action-wrapper

    if (screen.width < 780) {
        var cartWrapTop = $('.add-action-wrapper').position().top;
        var cartWrap = $('.add-action-wrapper');
        var viewedContentTop = $('#reviews').position().top;

        $(document).scroll(function() {
            var y = $(this).scrollTop();
            if (y > cartWrapTop) {
                cartWrap.addClass('cartWrapTopFix')
            } else {
                cartWrap.removeClass('cartWrapTopFix');
            }

            if (y > viewedContentTop - 50) {
                cartWrap.css('transform', 'translateY(-100%)');
            } else {
                cartWrap.css('transform', 'translateY(0)');
            }
        });
    }




});


function initTagsCollapse()
{
    if (screen.width > 922) {
        $('.product-tag-search').each(function() { // 43px
            let element = $(this).get(0);
            if (element.scrollHeight > 44) {
                $(element).addClass('active');
            }
        });

        $('.more-tags .button').click(function() {
            let element = $(this).parentsUntil('.product-tag-search').parent();
            element.addClass('show-all-tags');
        });
    }
}

$('#toggle_print_back').change(function () {
    let config = $("#configurations").val();
    if (config != '') {
        config = JSON.parse(config);
    } else {
        config = {};
    }
    if ($("#toggle_print_back").is(':checked')) {
        config.is_print_back = 1;
        delete config.is_print_front;
        $("#configurations").val(JSON.stringify(config)).trigger('change');
    }
});
$('#toggle_print_front').change(function () {
    let config = $("#configurations").val();
    if (config != '') {
        config = JSON.parse(config);
    }
    if ($("#toggle_print_front").is(':checked')) {
        delete config.is_print_back;
        config.is_print_front = 1;
        $("#configurations").val(JSON.stringify(config)).trigger('change');
    }
});

$('.product-custom-box .product-detail-row').click(function () {
    if (!$(this).hasClass('.design-link')) {
        let element = $(this).find('.design-link');
        if (element) {
            window.location.href = $(element).attr('href');
        }
    }
})
