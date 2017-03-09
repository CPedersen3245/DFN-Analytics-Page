$(document).ready(function () {

    /*******************************
     *          GLOBALS            *
     *******************************/
    var pathJSON = {};

    //Keeps track of where in the gallery the user is
    var currPhotoListIndex = 0;

    //Number of photos per gallery page
    var picturesPerPage = 20;

    /*******************************
     *      Selector Listings      *
     *******************************/
    var errorSpan = '.error-span';

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
        hour: 12
    }).on('input change', setEndDate);
    $(endDatePicker).datetimepicker({
        controlType: 'select',
        oneLine: true,
        hour: 12
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
        $('body').css('height', '100vh');
        $('body').css('width', '100vw');
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
        var numPhotos = Object.keys(inFiles).length;
        var i, j = 0;
        var currListNumber = 0;

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

        while (j < numPhotos) {
            $(gallerySlider).append(
                    '<div class="' + galleryPhotoArea.replace('.', '') + '" id="GPA' + currListNumber + '">' +
                        '<ul id="photo-list-' + currListNumber + '"></ul>'
            );
            for (i = 0; i < picturesPerPage; i++) {
                $.each(inFilesArray[j], function(key, value) {
                    tempFilePath = value;
                    tempTimestamp = key;
                });
                if(j < numPhotos) {
                    $('#photo-list-' + currListNumber).append(
                        '<li>' +
                            '<a href=' + tempFilePath + ' data-lightbox="gallery", data-title="Time Taken: ' + tempTimestamp +'">' +
                                '<img src=' + tempFilePath + '>' +
                            '</a>' +
                        '</li>'
                    );
                    j++;
                }
            }
            $(galleryWPadding).append(
                '</div>'
            );
            currListNumber++;
        }
        currPhotoListIndex = 0;
        scrollToImageList({data: {dIndex: 0}});
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
        if ($(photoAreaDisplayID).length != 0) {
            currPhotoListIndex += event.data.dIndex;
            $(galleryPhotoArea).css('display', 'none');
            $(photoAreaDisplayID).css('display', 'flex');
            $(galleryFeedbackSpan).text('Page ' + (currPhotoListIndex+1) + ' of ' + $(galleryPhotoArea).length);
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
     *  Notes: On success of request,
     *
     */
    function findPictures() {
        $.getJSON('/findpictures', {startdate: $(startDatePicker).datetimepicker('getDate'), enddate: $(endDatePicker).datetimepicker('getDate')}, function(result) {
            pathJSON = {};
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
        $(errorSpan).text(message);
        $(errorSpan).css('display', 'inline');
        $(errorSpan).css('color', '#FF4136');
        $(errorSpan).animate({
            color: 'transparent'
        }, 2000, 'easeInQuint', function() { $(errorSpan).css('display', 'none'); });

    }

    /*******************************
     *     Page Initialization     *
     *******************************/
    resizePhotoArea(); //Binds width of photo areas properly
    //generateGallery(); //Generates the first photo gallery instance
    $("html, body").scrollTop('.nav-selected'); //Scrolls to the selected element (Gallery)
});
