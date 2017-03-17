/*
 * * * * * * * * * *
 * Filename:    functions.js
 *
 * Purpose:     The javascript (and jQuery) functions for the DFN-Analytics-Page project.
 *
 * Copyright:   2017 Fireballs in the Sky, all rights reserved
 * * * * * * * * * *
*/


$(document).ready(function () {

    /*******************************
     *          GLOBALS            *
     *******************************/
    //Keeps track of where in the gallery the user is
    var currPhotoListIndex = 0;

    //Keeps track of all photo list HTML to be later rendered
    var photoListDirectory = [];

    //Number of photos per gallery page
    var picturesPerPage = 30;

    /*******************************
     *      Selector Listings      *
     *******************************/
    var galleryErrorSpan = '.gallery-error-span';

    var galleryLink = '#gallery-link';
    var performanceLink = '#performance-link';
    var analyticsLink = '#analytics-link';
    var navLinks = '#nav-links';
    var galleryLeftArrow = '#gallery-left-arrow';
    var galleryRightArrow = '#gallery-right-arrow';
    var galleryWPadding = '.gallery-w-padding';
    var gallerySlider = '.gallery-slider';
    var galleryFeedbackSpan = '#gallery-feedback-span';
    var galleryPhotoArea = '.gallery-photo-area';

    var startDatePicker = '#gallery-start-date-selector';
    var endDatePicker = '#gallery-end-date-selector';
    var findPicturesButton = '#find-pictures-button';

    /*******************************
     *     Setting up callbacks    *
     *******************************/
    $(findPicturesButton).click(findPictures);
    $(galleryLink).click({scrollTo: '#gallery-wrapper'}, scrollToDiv);
    $(performanceLink).click({scrollTo: '#performance-wrapper'}, scrollToDiv);
    $(analyticsLink).click({scrollTo: '#analytics-wrapper'}, scrollToDiv);
    $(galleryLeftArrow).click({dIndex: -1}, scrollToImageList);
    $(galleryRightArrow).click({dIndex: 1}, scrollToImageList);

    /*******************************
     *        Datetimepicker       *
     *******************************/
    //datetimepicker element setup
    $(startDatePicker).datetimepicker({
        controlType: 'select',
        oneLine: true,
        hour: 12,
        beforeShow: function() {setTimeout(function(){
            $('.ui-datepicker').css('z-index', 100);
            }, 0)}
    }).on('input change', setEndDate);
    $(endDatePicker).datetimepicker({
        controlType: 'select',
        oneLine: true,
        hour: 12,
        beforeShow: function() {setTimeout(function(){
            $('.ui-datepicker').css('z-index', 100);
            }, 0)}
    });

    /*
     *
     *  Name: setEndDate
     *
     *  Purpose: Sets the end date automatically to one day after initial selection
     *
     *  Params: event: a JSON with information about the event.
     *
     *  Return: none
     *
     *  Notes: Should only be called as a callback for the input change event for startDatePicker
     *
     */
    function setEndDate(e) {
        var startDate = $(startDatePicker).datetimepicker('getDate');
        var tomorrow = new Date(startDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        $(endDatePicker).datetimepicker('setDate', tomorrow);
    }

    /*******************************
     *        Responsiveness       *
     *******************************/

    //*****Fixing keyboard resize issue on mobile*****//
    $(window).bind('resize', function (e) {
        $('html, body').css('height', $(window).height);
        $('html, body').css('width', $(window).height);
    });

    /*
     *
     *  Name: scrollToDiv
     *
     *  Purpose: Scrolls to the selected div on the nav.
     *
     *  Params: event: a JSON with information about the click event. Contains scrollTo,
     *  the wrapper to scroll the body to.
     *
     *  Return: none
     *
     *  Notes: Should only be called as a callback for the click event on the nav links.
     *
     */
    function scrollToDiv(event) {
        $(navLinks + ' li a').each(function (index) {
            $(this).removeClass('nav-selected');
        });
        $(event.target).addClass('nav-selected');

        $('html, body').animate({
            'scrollTop': $(event.data.scrollTo).position().top
        });
    }

    /*
     *
     *  Name: resizePhotoArea
     *
     *  Purpose: Enables photo-areas to be responsive
     *
     *  Params: none
     *
     *  Return: none
     *
     *  Notes: This method is tied to the window.resize method, but is also called on page load.
     *
     */
    function resizePhotoArea() {
        $(galleryPhotoArea).css('width', ($(galleryWPadding).width() + 'px'));
    }
    $(window).resize(resizePhotoArea);

    /*******************************
     *        Image Gallery        *
     *******************************/
    //Configuring Lightbox options
    lightbox.option({
        'alwaysShowNavOnTouchDevices' : true,
        'fadeduration': 1000,
        'imageFadeDuration': 400,
        'wrapAround': true
    });

    /*
     *
     *  Name: generateGallery
     *
     *  Purpose: Generates the images gallery, using the array of filenames currently in RAM
     *
     *  Params: A JSON object with lots of keys, in the form {(timestamp), (filepath)}
     *
     *  Return: none
     *
     *  Notes: Should only be called as a success callback from the /findpictures ajax request.
     *
     */
    function generateGallery(inFiles) {
        var inFilesArray = [];

        var tempJSON = {};
        var tempFilePath;
        var tempTimestamp;

        //Create an array out of input JSON
        $.each(inFiles, function (key, value) {
            tempJSON = {};
            tempJSON[key] = value;
            inFilesArray.push(tempJSON)
        });

        $(gallerySlider).empty();
        photoListDirectory = [];

        var numPhotos = Object.keys(inFiles).length;
        var totalPhotoCount = 0;
        var currPhotoList = 0;

        photoListDirectory.push('Pranked');
        photoListDirectory[0] += 'memed';
        console.log(photoListDirectory);
        photoListDirectory = [];

        //For every photo in the photo array
        while (totalPhotoCount < numPhotos) {
            //Create the start of the photo list HTML
            photoListDirectory.push(
                '<div class="' + galleryPhotoArea.replace('.', '') + '" id="GPA' + currPhotoList + '">' +
                    '<ul id="photo-list-' + currPhotoList + '">');
            //For each photo in the photo area, max cap is picturesPerPage
            for (var photoInArea = 0; photoInArea < picturesPerPage; photoInArea++) {
                //Retrieve single photo data point from array
                $.each(inFilesArray[totalPhotoCount], function (key, value) {
                    tempFilePath = value;
                    tempTimestamp = key;
                });
                //Append photo item to current photo list only if there are photos remaining
                if (totalPhotoCount < numPhotos) {
                    photoListDirectory[currPhotoList] +=
                        '<li>' +
                            '<a href=' + tempFilePath + ' data-lightbox="gallery", data-title="Time Taken: ' + tempTimestamp + '">' +
                                '<img src=' + tempFilePath + '>' +
                            '</a>' +
                        '</li>';
                }
                //Move to next photo
                totalPhotoCount++;
            }
            //End the list, and the photo area
            photoListDirectory[currPhotoList] += '</ul></div>';
            currPhotoList++;
        }
        if(photoListDirectory[0] != null) {
            $(gallerySlider).append(photoListDirectory[0]);
            currPhotoListIndex = 0;
            scrollToImageList({data: {dIndex: 0}});
        }
    }

    /*
     *
     *  Name: scrollToImageList
     *
     *  Purpose: Scrolls to the requested image list.
     *
     *  Params: event: a JSON with information about the click event. Contains dIndex,
     *  (delta index), where to scroll from the current index
     *
     *  Return: none
     *
     *  Notes: Called at the end of generateGallery, to scroll to the beginning.
     *
     */
    function scrollToImageList(event) {
        var photoAreaDisplayID = '#GPA' + (currPhotoListIndex + event.data.dIndex);
        //If it's not in the directory, get outta here.
        if (photoListDirectory[currPhotoListIndex + event.data.dIndex] != null) {
            currPhotoListIndex += event.data.dIndex;
            //If not already on the page, render it.
            if ($(photoAreaDisplayID).length == 0) {
                $(gallerySlider).append(photoListDirectory[currPhotoListIndex]);
            }
            //Then, "scroll" to the photo area.
            $(galleryPhotoArea).css('display', 'none');
            $(photoAreaDisplayID).css('display', 'flex');
            $(galleryFeedbackSpan).text('Page ' + (currPhotoListIndex+1) + ' of ' + photoListDirectory.length);
            $(gallerySlider).scrollTop(0);
        }
    }

    /*******************************
     *        AJAX Requests        *
     *******************************/

    /*
     *
     *  Name: findPictures
     *
     *  Purpose: AJAX request for finding all picture URLs between two dates
     *
     *  Params: None, but the function fetches the starting date and ending date objects from the datetimepickers.
     *
     *  Return: none
     *
     *  Notes: On success of request, it will generate the new gallery and show the 1st page.
     *
     */
    function findPictures() {
        $(gallerySlider).empty();
        $(gallerySlider).append(
            '<img src="static/images/loading.gif" class="gallery-loading-image">'
        );
        $(galleryFeedbackSpan).text('No images to display.');
        $.getJSON('/findpictures', {startdate: $(startDatePicker).datetimepicker('getDate'), enddate: $(endDatePicker).datetimepicker('getDate')}, function(result) {
            generateGallery(result);
        }).fail(picturesError);
    }

    /*******************************
     *        Error Handling       *
     *******************************/

    /*
     *
     *  Name: picturesError
     *
     *  Purpose: Error handler for findPictures
     *
     *  Params: jqXHR (the http response), status (the error code), errorThrown (other information about the event)
     *
     *  Return: none
     *
     *  Notes: none
     *
     */
    function picturesError(jqXHR, status, errorThrown) {
        $(gallerySlider).empty();
        showErrorSpan(jqXHR.responseText);
    }

    /*
     *
     *  Name: showErrorSpan
     *
     *  Purpose: Briefly shows an error message on the screen, before fading.
     *
     *  Params: A string, to display.
     *
     *  Return: none
     *
     *  Notes: none
     *
     */
    function showErrorSpan(message) {
        $(galleryErrorSpan).text(message);
        var tempSpan = $(galleryErrorSpan).clone();
        $(galleryErrorSpan).replaceWith(tempSpan);

    }

    /*******************************
     *     Page Initialization     *
     *******************************/
    resizePhotoArea(); //Binds width of photo areas properly
    $(performanceLink).click(); //Scrolls to the selected element (Gallery)
});
