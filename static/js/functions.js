$(document).ready(function () {

    //*****Code for fixing keyboard resize issue on mobile*****//
    $(window).bind('resize', function (e) {
        $('body').css('height', '100vh');
        $('body').css('width', '100vw');
    });

    //*****Code for scrolling links*****//
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

    //*****Code for Lightbox2 image gallery*****//
    //*****Image setup*****//
    var pathArray = ["static/images/sample/1.jpg", "static/images/sample/2.jpg", "static/images/sample/3.jpg", "static/images/sample/4.jpg",
        "static/images/sample/5.jpg", "static/images/sample/6.jpg", "static/images/sample/7.jpg", "static/images/sample/8.jpg",
        "static/images/sample/9.jpg", "static/images/sample/10.jpg", "static/images/sample/11.jpg", "static/images/sample/12.jpg",
        "static/images/sample/13.jpg", "static/images/sample/14.jpg", "static/images/sample/15.jpg", "static/images/sample/16.jpg",
        "static/images/sample/17.jpg", "static/images/sample/18.jpg", "static/images/sample/19.jpg", "static/images/sample/20.jpg",
        "static/images/sample/21.jpg", "static/images/sample/22.jpg", "static/images/sample/23.jpg", "static/images/sample/24.jpg",
        "static/images/sample/1.jpg", "static/images/sample/2.jpg", "static/images/sample/3.jpg", "static/images/sample/4.jpg",
        "static/images/sample/5.jpg", "static/images/sample/6.jpg", "static/images/sample/7.jpg", "static/images/sample/8.jpg",
        "static/images/sample/9.jpg", "static/images/sample/10.jpg", "static/images/sample/11.jpg", "static/images/sample/12.jpg",
        "static/images/sample/13.jpg", "static/images/sample/14.jpg", "static/images/sample/15.jpg", "static/images/sample/16.jpg",
        "static/images/sample/17.jpg", "static/images/sample/18.jpg", "static/images/sample/19.jpg", "static/images/sample/20.jpg",
        "static/images/sample/21.jpg", "static/images/sample/22.jpg", "static/images/sample/23.jpg", "static/images/sample/24.jpg"];

    //Code for scrolling between photo lists
    var photoLists = [];
    var currPhotoListIndex = 0;

    //*****HTML Writing*****//
    //For each x photos, make a new photo area
    var x = 20;
    var i, j = 0;
    var listnumber = 0;
    var length = pathArray.length;

    while (j < length) {
        photoLists.push("GPA" + listnumber);
        console.log(photoLists);
        $(".gallery-slider").append(
                '<div class="gallery-photo-area" id="GPA' + listnumber + '">' +
                    '<ul id="photo-list-' + listnumber + '"></ul>'
        );
        for (i = 0; i < x; i++) {
            if(j < length) {
                $("#photo-list-" + listnumber).append(
                    '<li>' +
                        '<a href=' + pathArray[j] + ' data-lightbox="gallery">' +
                            '<img src=' + pathArray[j] + '>' +
                        '</a>' +
                    '</li>'
                );
                j++;
            }
        }
        $(".gallery-w-padding").append(
            '</div>'
        );
        listnumber++;
    }

    //*****CSS Writing*****//
    function initCSS() {
        $(".gallery-photo-area").css('width', ($(".gallery-w-padding").width() + 'px'));
    }
    initCSS();

    $(window).resize(initCSS);


    //*****Datepicker setup*****//
    $('#gallery-start-date-selector').datetimepicker({
        controlType: 'select',
        oneLine: true,
    });
    $('#gallery-end-date-selector').datetimepicker({
        controlType: 'select',
        oneLine: true,
    });

    //Configuring Lightbox options
    lightbox.option({
        'alwaysShowNavOnTouchDevices' : true,
        'fadeduration': 1000,
        'imageFadeDuration': 400,
        'wrapAround': true
    });

    //*****Element listings*****//
    var startDatePicker = $('#gallery-start-date-selector');
    var endDatePicker = $('#gallery-end-date-selector');
    var findPicturesButton = $('#find-pictures-button');
    $(findPicturesButton).click(findPictures);

    //*****Request handling*****//
    function findPictures() {
        $.getJSON('/findpictures', {startdate: startDatePicker.datetimepicker('getDate'), enddate: endDatePicker.datetimepicker('getDate')}, function(result) {
            console.log(result);
        }).fail(picturesError);
    }

    //*****Error handling*****//
    function picturesError(jqXHR, status, errorThrown) {
        alert(jqXHR.responseText);
    }

});
