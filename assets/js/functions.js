$(document).ready(function () {

    //Code for scroll buttons
    $('#gallery-link').click({scrollTo: '#gallery-wrapper'}, scrollToDiv);
    $('#performance-link').click({scrollTo: '#performance-wrapper'}, scrollToDiv);
    $('#analytics-link').click({scrollTo: '#analytics-wrapper'}, scrollToDiv);
    $('#gallery-link').addClass('nav-selected');
    $("html, body").scrollTop('.nav-selected');

    function scrollToDiv(event) {
        $('#nav-links li a').each(function (index) {
            $(this).removeClass('nav-selected');
        });
        $(event.target).addClass('nav-selected');
        $('html, body').animate({
            'scrollTop': $(event.data.scrollTo).position().top
        });
    }

    //Code for Lightbox2 image gallery

    //Datepicker setup
    $(".datepicker").datepicker();

    //Image setup
    var pathArray = ["assets/images/sample/1.jpg", "assets/images/sample/2.jpg", "assets/images/sample/3.jpg", "assets/images/sample/4.jpg",
        "assets/images/sample/5.jpg", "assets/images/sample/6.jpg", "assets/images/sample/7.jpg", "assets/images/sample/8.jpg",
        "assets/images/sample/9.jpg", "assets/images/sample/10.jpg", "assets/images/sample/11.jpg", "assets/images/sample/12.jpg",
        "assets/images/sample/13.jpg", "assets/images/sample/14.jpg", "assets/images/sample/15.jpg", "assets/images/sample/16.jpg",
        "assets/images/sample/17.jpg", "assets/images/sample/18.jpg", "assets/images/sample/19.jpg", "assets/images/sample/20.jpg",
        "assets/images/sample/21.jpg", "assets/images/sample/22.jpg", "assets/images/sample/23.jpg", "assets/images/sample/24.jpg"];

    $.each(pathArray, function (index, value) {
        $("#photo-list").append(
            '<li>' +
                '<a href=' + value + ' data-lightbox="gallery">' +
                    '<img src=' + value + '>' +
                '</a>' +
            '</li>'
        );
    });

    //Configuring Lightbox options
    lightbox.option({
        'alwaysShowNavOnTouchDevices' : true,
        'fadeduration': 100,
        'imageFadeDuration': 100,
        'resizeduration': 100,
        'wrapAround': true
    });

});
