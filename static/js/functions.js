$(document).ready(function () {

    /*******************************
     *          GLOBALS            *
     *******************************/
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

    //Keeps track of where in the gallery the user is
    var currPhotoListIndex = 0;

    //Number of photos per gallery page
    var picturesPerPage = 20;

    /*******************************
     *      Selector Listings      *
     *******************************/
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
     *  Params: none
     *
     *  Return: none
     *
     *  Notes: Should only be called as a success callback from the /findpictures ajax request.
     *
     */
    function generateGallery() {
        var photoLists = [];
        var i, j = 0;
        var currListNumber = 0;

        while (j < pathArray.length) {
            photoLists.push("GPA" + currListNumber);
            $(gallerySlider).append(
                    '<div class="' + galleryPhotoArea + '" id="GPA' + currListNumber + '">' +
                        '<ul id="photo-list-' + currListNumber + '"></ul>'
            );
            for (i = 0; i < picturesPerPage; i++) {
                if(j < pathArray.length) {
                    $('#photo-list-' + currListNumber).append(
                        '<li>' +
                            '<a href=' + pathArray[j] + ' data-lightbox="gallery">' +
                                '<img src=' + pathArray[j] + '>' +
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
        scrollToImageList({data: {dIndex: 0}});
        currPhotoListIndex = 0;
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

    function findPictures() {
        $.getJSON('/findpictures', {startdate: startDatePicker.datetimepicker('getDate'), enddate: endDatePicker.datetimepicker('getDate')}, function(result) {
            console.log(result);
        }).fail(picturesError);
    }

    function picturesError(jqXHR, status, errorThrown) {
        alert(jqXHR.responseText);
    }

    /*******************************
     *     Page Initialization     *
     *******************************/
    //datetimepicker element setup
    $(startDatePicker).datetimepicker({
        controlType: 'select',
        oneLine: true
    });
    $(endDatePicker).datetimepicker({
        controlType: 'select',
        oneLine: true
    });
    resizePhotoArea(); //Binds width of photo areas properly
    generateGallery(); //Generates the first photo gallery instance
    $("html, body").scrollTop('.nav-selected'); //Scrolls to the selected element (Gallery)
});
