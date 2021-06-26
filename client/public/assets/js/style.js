$(document).ready(function () {
    $('.slider-inner').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: false,
        fade: true,
        speed: 1200
    });
    $('.slider-inner').on('beforeChange', function () {
        $(".slider-inner .item img").css("clip-path", "polygon(0 0, 100% 0, 100% 0%, 0 0%)");
        setTimeout(function () {
            $('.slider-inner .item img').css("clip-path", "polygon(0 0, 100% 0, 100% 0%, 0 0%)");
        }, 100);

        $(".slider-inner h1").css("transform", "scale(0)")
    });
    $('.slider-inner').on('afterChange', function () {
        $(".slider-inner .item img").css("clip-path", "polygon(0 0, 100% 0, 100% 100%, 0 100%)");
        setTimeout(function () {
            $('.slider-inner .item img').css("clip-path", "polygon(0 0, 100% 0, 100% 100%, 0 100%)");
        }, 100);

        $(".slider-inner h1").css("transform", "scale(1)")
    });
});

