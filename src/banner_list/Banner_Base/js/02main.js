'use strict';

/**
 *
 * Main Application
 *
 **/

function App_banner() {
  if (App_banner.instance !== undefined) {
    return App_banner.instance;
  } else {
    App_banner.instance = this;
  }
  LTApp.call(this);
  return App_banner.instance;
}
App_banner.prototype = new LTApp();
App_banner.fn = App_banner.prototype;

/**
 *
 * Singleton thing
 *
 **/
App_banner.getInstance = function() {
  if (App_banner.instance === undefined) {
    new App_banner();
  }
  return App_banner.instance;
}

/**
 *
 * Initialize your app, surcharge with whatever needed
 *
 **/
App_banner.fn.init = function() {
  if (!this.INITED) {
    this.INITED = true;

    /**
     * Add the images url you want to preload in the empty array on the first parameter
     */
    this.preload([], this.display.bind(this));
  }
};

/**
 *
 * shows everything, start animating
 *
 **/
App_banner.fn.display = function() {
  this.steps = $('.step');
  this.goTo(1);
  $('body').removeClass('loading');
  $('body').addClass('loaded');
};

/**
 *
 * Display the given step
 *
 */
App_banner.fn.goTo = function(stepNumber) { 
  this.steps.each(function(i, el) {
    var $el = $(el);

    if ($el.data('order') == stepNumber) {
      $('.step-active').removeClass('step-active');
      $el.addClass('step-active');
    }
  });

  if (this['step' + stepNumber]) {
    this['step' + stepNumber]();
  }
};

/**
 *
 * Display the given step
 *
 */

App_banner.fn.goToAndWait = function(stepNumber, seconds) {
  this.steps.each(function(i, el) {
    var $el = $(el);
    var $old;

    if ($el.data('order') == stepNumber) {
      $old = $('.step-active');
      $el.addClass('step-active');

      setTimeout(function() {
        $old.removeClass('step-active');
      }, seconds);
    }
  });

  if (this['step' + stepNumber]) {
    this['step' + stepNumber]();
  }
};


App_banner.fn.step1 = function() {

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

