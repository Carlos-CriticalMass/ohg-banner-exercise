
/**
 *
 * start animating
 *
 **/

App_banner.fn.anima = function() {

  // Variables
  var tl          = new TimelineMax(),
      placeholder = $('.animation-placeholder'),
      scrollBar,
      isi1        = $('#isi'),
      isiMain     = $('#isi-main'),
      mainExit    = $('#mainExit'),
      myScroll;


  //Assign timeline to window to be able to test.
  window.tl = tl;

  //
  //Timeline Animation
  //

  tl.addLabel('frame1', '+=0.5')
    .from(placeholder, 0.6, {x: 500}, 'frame1')
  //
  // SCROLL
  //

  //Scroll init function. Keep disable options as they
  function initScrollBars(){
    myScroll = new IScroll('#isi_wrapper', {
          scrollbars: 'custom',
          interactiveScrollbars: true,
          mouseWheel: true,
          momentum: true,
          disablePointer:true,
          disableTouch:false,
          disableMouse:true
      });
      window.myScroll = myScroll;
      scrollBar = $('.iScrollVerticalScrollbar');
  }

  // scroll init
  initScrollBars();

  // Exits Listeners
  mainExit.on('click', App_banner.fn.mainExitHandler);
  $('.pi').on('click', App_banner.fn.piExitHandler);

};

//Main Exit Handler
App_banner.fn.mainExitHandler = function(e) {
  e.preventDefault();
  Enabler.exit('Main Exit','http://google.com');
}
// Pi Exit handler
App_banner.fn.piExitHandler = function(e) {
  e.preventDefault();
  Enabler.exit('Prescribing Information and Medication Guide','http://google.com');
}

//SET IDS IN DOM TO GLOBAL VARIABLES
function IDsToVars() {
  var allElements = document.getElementsByTagName("id");

  for (var q = 0; q < allElements.length; q++) {
    var el = allElements[q];
    if (el.id) {
      window[el.id] = document.getElementById(el.id);
    }
  }
};