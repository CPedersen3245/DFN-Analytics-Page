$( document ).ready(function() {

  //Code for scroll buttons
  $('#gallery-link').click({scrollTo: '#gallery-wrapper'}, scrollToDiv);
  $('#performance-link').click({scrollTo: '#performance-wrapper'}, scrollToDiv);
  $('#analytics-link').click({scrollTo: '#analytics-wrapper'}, scrollToDiv);
  $('#gallery-link').addClass('nav-selected');
  $("html, body").scrollTop('.nav-selected');

  function scrollToDiv(event) {
    $('#nav-links li a').each(function(index) {
      $(this).removeClass('nav-selected');
    })
    $(event.target).addClass('nav-selected');
    $('html, body').animate({
        'scrollTop' : $(event.data.scrollTo).position().top
    });
  }

});
