/* eslint-disable no-undef */

/**
 *
 * start animating
 *
 **/

AppBanner.fn.anima = function() {
    // isi clone, NOTE: if you want to see a copy of the ISI next to the banner uncomment the follow line
    // $('#isi').clone().addClass('uat').attr('id', 'isi-clone').appendTo('body');

    // Variables
    const tl = new TimelineMax();
    const placeholder = $('.animation-placeholder');
    const isi = $('.isi');
    const isiMain = $('.isi-main');
    const isiWrapper = $('.isi_wrapper');
    const mainExit = $('#mainExit');
    const initialScrollSpeed = 90000;
    const scrollToTop = true; // Set to false if you do not need to scroll to the top when the auto scroll finished
    let myScroll = null;
    let scrollBar = null;
    let scrollSpeed = 0;
    let scrolledPercentage = 0;
    let isiHeight = 0;
    let isiFinished = false;
    let animationFinished = false;
    let scrollWrapHeight = isiWrapper.clientHeight;
    // Assign timeline to window to be able to test.
    window.tl = tl;

    // Scroll init function. Keep disable options as they
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
            disableMouse: false,
        });

        window.myScroll = myScroll;

        scrollBar = $('.iScrollVerticalScrollbar');
    }

    function scrollSetUp(e) {
        myScroll.scrollBy(0, 0, 1, {
            fn: function(k) {
                return k;
            },
        });
    }

    function finishedAnimation() {
        animationFinished = true;
        startScroll();
    }

    function startScroll() {
        scrollWrapHeight = $('.isi_wrapper').outerHeight(),
        isiHeight = -1 * (isi.outerHeight() - scrollWrapHeight),
        scrolledPercentage = myScroll.y * 100 / isiHeight,
        scrollSpeed = initialScrollSpeed - (initialScrollSpeed * (scrolledPercentage / 100));

        myScroll.refresh();
        setTimeout(function() {
            if (scrolledPercentage >= 100) {
                isiFinished = true;
            }
            myScroll.scrollTo(0, isiHeight, scrollSpeed, {
                fn: function(k) {
                    return k;
                },
            });
        }, 300);
    }

    function stopScroll() {
        myScroll.isAnimating = false; // stop animation
    }

    // scroll init
    initScrollBars();

    scrollBar.mouseenter(function() {
        scrollSetUp();
    });

    isiMain.mouseenter(function() {
        stopScroll();
    });

    isiMain.mouseleave(function() {
        if (animationFinished) {
            if (!isiFinished) {
                startScroll();
            }
        }
    });

    myScroll.on('scrollStart', function() {
        if (animationFinished) {
            if (myScroll.isAnimating) {
                stopScroll();
            }
        }
    });

    myScroll.on('scrollEnd', function() {
        if (!scrollToTop) return;
        if (myScroll.maxScrollY >= myScroll.y) {
            stopScroll();
            setTimeout(function() {
                myScroll.scrollTo(0, 0, 2000);
            }, 3000);
        }
    });

    //
    // Timeline Animation
    //

    tl.addLabel('frame1', '+=0.5')
        .from(placeholder, 0.6, { x: 500 }, 'frame1')
        .add(function() {
            finishedAnimation();
        }, 'frame1+=3');

    // Exits Listeners
    mainExit.on('click', AppBanner.fn.mainExitHandler);
    $('#wrapper').on('click', AppBanner.fn.piExitHandler);
};

// Main Exit Handler
AppBanner.fn.mainExitHandler = function(e) {
    e.preventDefault();
    Enabler.exit('clickTag1', clickTag1);
};
// Pi Exit handler
AppBanner.fn.piExitHandler = function(e) {
    e.preventDefault();
    Enabler.exit('clickTag2', clickTag2);
};
