
/**
 *
 * start animating
 *
 **/

App_banner.fn.anima = function() {
    // isi clone, NOTE: if you want to see a copy of the ISI next to the banner uncomment the follow line
    // $('#isi').clone().addClass('uat').attr('id', 'isi-clone').appendTo('body');

  // Variables
  var tl          = new TimelineMax(),
      placeholder = $('.animation-placeholder'),
      isi1        = $('.isi'),
			isiMain     = $('.isi-main'),
			isi_wrapper = $('.isi_wrapper'),
      mainExit    = $('#mainExit'),
      myScroll,
      scrollBar,
      scrollSpeed,
      scrolledPercentage,
      scrollWrapHeight,
      isiHeight,
      scrollSetUp,
      intialScrollSpeed = 90000,
      animationFinished = false,
      scrollWrapHeight = isi_wrapper.clientHeight;

  //Assign timeline to window to be able to test.
  window.tl = tl;

    //Scroll init function. Keep disable options as they
    function initScrollBars() {
      myScroll = new IScroll('.isi_wrapper', {
        scrollbars: 'custom',
        interactiveScrollbars: true,
        resizeScrollbars: false,
        mouseWheel: true,
        momentum: true,
        click: true,
        disablePointer: true,
        disableTouch: false,
        disableMouse: false
      });

      window.myScroll = myScroll;

      scrollBar = $('.iScrollVerticalScrollbar');
    }

    function finishedAnimation() {
      animationFinished = true;
      startScroll();
    }

    function startScroll() {
      scrollWrapHeight = $('.isi_wrapper').outerHeight(),
      isiHeight = -1 * (isi1.outerHeight() - scrollWrapHeight),
      intialScrollSpeed = 90000;
      scrolledPercentage = myScroll.y * 100 / isiHeight,
      scrollSpeed = intialScrollSpeed - intialScrollSpeed * (scrolledPercentage / 100);

      myScroll.refresh();
      setTimeout(function () {
        myScroll.scrollTo(0, isiHeight, scrollSpeed, {
          fn: function (k) {
            return k
          }
        })
      }, 300);
    }

    function stopScroll() {
      myScroll.isAnimating = false; //stop animation
    }

    // scroll init
    initScrollBars();

   scrollSetUp = function (e) {
      myScroll.scrollBy(0, 0, 1, {
        fn: function (k) {
          return k
        }
      });
    }

    scrollBar.mouseenter(function () {
      scrollSetUp();
    });

    myScroll.on('scrollStart', function () {
      if (animationFinished) {
        if (myScroll.isAnimating) {
          stopScroll();
        }
      }
    });

  //
  //Timeline Animation
  //

  tl.addLabel('frame1', '+=0.5')
    .from(placeholder, 0.6, {x: 500}, 'frame1')

  // Exits Listeners
  mainExit.on('click', App_banner.fn.mainExitHandler);
  $('#wrapper').on('click', App_banner.fn.piExitHandler);

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
