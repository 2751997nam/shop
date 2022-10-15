$(document).ready(function() {
    $('.sorter-item').click (function () {
        var dataValue = $(this.getAttribute('data-char'));
        var navHeight = $('.sorter-list').height();
        console.log(navHeight);
        if (dataValue.length) {
            if ($(window).width() > 750) {
                $('html, body').animate({scrollTop: $(dataValue).offset().top - navHeight - 10}, 700);
            } else {
                $('html, body').animate({scrollTop: $(dataValue).offset().top}, 700);
            }
        }
        $('.letter-char').removeClass('active')
        $(dataValue).addClass('active');
    })

    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var topSticky =  $('.main-content').position().top;
        if (scroll > topSticky) {
            $('.topics-top').addClass('sticky');
        } else {
            $('.topics-top').removeClass('sticky');
        }
    })

    $(document).on("scroll", onScroll);
    function onScroll(event){
        var scrollPos = $(document).scrollTop();
        $('.sorter-item').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr('href'));
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.sorter-item').removeClass("active");
                currLink.addClass("active");
            }
            else{
                currLink.removeClass("active");
            }
        });
    }

    $('.click-choose').click( function () {
        $('body').addClass('open-char');
    });

    $('.close-char').click( function () {
        $('body').removeClass('open-char');
    })
});
