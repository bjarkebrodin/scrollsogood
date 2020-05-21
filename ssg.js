/*
ScrollSoGood - (ssg)

A Javascript utility framework for cross-platform
full-page scrolling pages. 

Authored by Bjarke Brodin Larsen.

Breaks the default scrolling functionality and 
replaces it with a 'full page card' system. 

References 
[1] Chris Ferdinandi. See: https://gomakethings.com/custom-events-with-vanilla-javascript/

*/

// Polyfill for custom events, thanks to [1]
(function() {
    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

// Polyfill for custom classes, 

const ssg = function() {
    { // Block and hoist utils, just for IDE
        var select = function(query) { return document.querySelector(query); };
        var selectAll = function(query) { return document.querySelectorAll(query); };
        var create = function(tagName) { return document.createElement(tagName); };

        var unit = {
            vh: function(){ return window.innerHeight/100; },
            vw: function(){ return window.innerWidth/100; }
        };

        var outOfBoundsErr = function(page, maxPage) {
            console.error(`ssg error: page number ${page} out of bounds for [0;${maxPage}]`);
        };

        // Todo: polyfill or rewrite
        class SSGEvent extends CustomEvent {
            constructor(from, to) {
                super('ssg-scroll', {
                    bubbles: true,
                    cancelable: false,
                });
                this.sourcePage = pages[from];
                this.targetPage = pages[to];
                this.sourceIndx = from;
                this.targetIndx = to;
            }
        }

        var dispatchEvent = function(from, to) {
            pages[from].dispatchEvent(new SSGEvent(from,to));
        };
    }

    const TIMEOUT = 800;
    const TOUCH_SENSITIVITY = 5;
    const UP_KEYS = [37, 38];
    const DOWN_KEYS = [39, 40];

    let pages;
    let current = 0;
    let max = 0;
    let lock = false;

    const transition = {
        duration: '.5s',
        function: 'linear'
    };

    const setPage = function(pageNum) {
        if (pageNum > max || pageNum < 0) {
            outOfBoundsErr(pageNum, max);
            return;
        } 

        document.body.style.transitionDuration = '0s';
        document.body.style.transform = `translateY(-${unit.vh() * 100 * pageNum}px)`;
        document.body.style.transitionDuration = transition.duration;
        
        current = pageNum;
    }
 
    const setTransitionDuration = function() { return 'setTransitionDuration'; };
    const setTransitionFunction = function() { return 'setTransitionFunction'; };
    const getTransitionDuration = function() { return 'getTransitionDuration'; };
    const getTransitionFunction = function() { return 'getTransitionFunction'; };
    
    const getCurrentPage = function() { return current; };
    
    const hasDown = function() { return current < max; };
    const hasUp = function() { return current > 0; };
    const hasRight = function() { return 'hasRight'; };
    const hasLeft = function() { return 'hasLeft'; };
    
    const scrollDown = function() {
        if (current + 1 > max) {
            outOfBoundsErr(current + 1, max);
            return;
        }

        lock = true;
        setTimeout(() => lock=false, TIMEOUT);
        scrollTo(++current);
        dispatchEvent(current-1, current);
    };

    const scrollUp = function() {
        if (current - 1 < 0) {
            outOfBoundsErr(current - 1, max);
            return;
        }

        lock = true;
        setTimeout(function() { lock=false; }, TIMEOUT);
        scrollTo(--current);
        dispatchEvent(current+1, current);
    };

    const scrollTo = function(pageNum) {
        if (pageNum > max || pageNum < 0) {
            outOfBoundsErr(pageNum, max);
            return;
        }

        document.body.style.transform = `translateY(-${unit.vh() * 100 * pageNum}px)`;
    };

    const revealRight = function() { return 'scrollRight'; };
    const revealLeft = function() { return 'scrollLeft'; };

    const handleWheel = function(event) {
        event.stopPropagation();

        // Todo: handle special scroll types like mac etc
        if (lock) { return; }

        if (event.deltaY > 0 && hasDown()) {
            scrollDown();
        } else if (event.deltaY < 0 && hasUp()) {
            scrollUp();
        }
    };

    const handleKey = function(event) {
        if (lock) { return; }
        let key = event.which;

        if (UP_KEYS.includes(key) && hasUp()) {
            scrollUp();
        } else if (DOWN_KEYS.includes(key) && hasDown()) {
            scrollDown();
        }
    };

    const handleTouch = function(event) {
        event.stopPropagation();

        let startY = event.touches[0].screenY;
        
        function handleSwipe(evt) {
            if (lock) { return; }
            let deltaY = evt.touches[0].screenY - startY;

            if (deltaY > TOUCH_SENSITIVITY && hasUp()) {
                scrollUp();
            } else if (deltaY < -TOUCH_SENSITIVITY && hasDown()) {
                scrollDown();
            }

            document.removeEventListener('touchmove', handleSwipe);
        };

        document.addEventListener('touchmove', handleSwipe);
    }

    const computeCSS = function (){ 
        return `
            html, body {
                margin: 0!important;
                padding: 0!important;
                overflow: hidden!important;
            }
            body {
                position: fixed!important;
                top: 0!important;
                left: 0!important;
                width: ${100 * unit.vw()}px!important;
            }
            .ssg.page {
                box-sizing: border-box!important;
                height: ${100 * unit.vh()}px!important;
            }
        `;
    };

    const applyTransition = function() {
        let style = document.body.style;
        style.transitionProperty = 'transform';
        style.transitionDuration = transition.duration;
        style.transitionTimingFunction = transition.function;
    }

    const applyStyle = function() {
        select('#ssgStyle').innerHTML = computeCSS();
    }

    const init = function() {
        window.pageYOffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        document.body.parentNode.scrollTop = 0;

        let style = create('style');
        style.setAttribute('id', 'ssgStyle');
        document.body.appendChild(style);
        pages = selectAll('.ssg.page');
        max = pages.length-1;

        applyStyle();
        applyTransition();
        setPage(current);

        window.addEventListener('resize', (event) => applyStyle());
        document.addEventListener('wheel', handleWheel);
        document.addEventListener('keyup', handleKey);
        document.addEventListener('touchstart', handleTouch);
    };
    
    window.onload = init;

    return {
        hasDown: hasDown,
        hasUp: hasUp,
        hasRight: hasRight,
        hasLeft: hasLeft,

        scrollDown: scrollDown,
        scrollUp: scrollUp,
        scrollTo: scrollTo,

        revealRight: revealRight,
        revealLeft: revealLeft,

        getCurrentPage: getCurrentPage,
        getTransitionDuration: getTransitionDuration,
        getTransitionFunction: getTransitionFunction,

        setTransitionDuration: setTransitionDuration,
        setTransitionFunction: setTransitionFunction,
    };
}();