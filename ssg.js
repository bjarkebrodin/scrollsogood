'use strict';

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

// TODO: touch is still iffy - especially missing reload on samsung drag on long drag up from first page
// TODO: make *long* swipe up refresh or default on first page
// TODO: Improve touch detection by adding touch module
// TODO: Polyfill classes and thus improve events - implement conceal/reveal and page-shown events

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

const ssg = function() {
    const CONTAINER_SYMBOL = '#ssg-container';
    const PAGE_SYMBOL = '.ssg-page';
    const L_CHILD_SYMBOL = '.ssg-child-left';
    const R_CHILD_SYMBOL = '.ssg-child-right';

    const TIMEOUT = 800;
    const TOUCH_SENSITIVITY = 10;
    const LONG_SWIPE = 25;
    const UP_KEYS = [37, 38];
    const DOWN_KEYS = [39, 40];

    let pages;
    let current = 0;
    let max = 0;
    let lock = false;
    let state = '';

    { // Block and hoist utils, just for IDE
        var select = function(query) { return document.querySelector(query); };
        var selectAll = function(query) { return document.querySelectorAll(query); };
        var create = function(tagName) { return document.createElement(tagName); };

        var unit = {
            vh: function(){ return window.innerHeight/100; },
            vw: function(){ return window.innerWidth/100; }
        };

        var outOfBoundsErr = function(pageNum) {
            console.error(`ssg error: page number ${pageNum} out of bounds for [0;${max}]`);
        };

        { // Specialization of CustomEvent, wtb es6 support </3
            var SSGEvent = function(type, from, to) {
                let params = {
                    bubbles: true,
                    cancelable: false,
                    detail: null
                };
                let self = Reflect.construct(CustomEvent, [type, params], this.constructor);
            
                self.srcIndex = from;
                self.targetIndex = to;
                self.srcPage = pages[from];
                self.targetPageIndex = pages[to];

                return self;
            }
            SSGEvent.prototype = Object.create(CustomEvent.prototype);
            SSGEvent.prototype.constructor = SSGEvent;
            Object.setPrototypeOf(SSGEvent, CustomEvent);
        }

        var dispatchScrollEvent = function(from, to) {
            pages[from].dispatchEvent(new SSGEvent('ssg-scroll', from, to));
        };
    }

    const transition = {
        duration: '0.4s',
        function: 'cubic-bezier(.85,.14,.37,.98)'
    };

    const setPage = function(pageNum) {
        if (pageNum > max || pageNum < 0) {
            outOfBoundsErr(pageNum, max);
            return;
        } 

        removeTransition();
        scrollTo(pageNum);
        if ( state === 'left' ) revealLeft();
        else if ( state === 'right' ) revealRight();
        applyTransition();
    }
 
    const setTransitionDuration = function(time) { 
        transition.duration = time; 
    };

    const setTransitionFunction = function(func) { 
        transition.function = func 
    };
    
    const getTransitionDuration = function() { 
        return transition.duration; 
    };
    
    const getTransitionFunction = function() { 
        return transition.function 
    };
    
    const getPage = function() { 
        return pages[current]; 
    };
    
    const getIndex = function() { 
        return current; 
    }; 

    const getPages = function() {
        return pages;
    }

    const hasDown = function() { 
        return current < max; 
    };
    
    const hasUp = function() { 
        return current > 0; 
    };
    
    const scrollDown = function() {
        if (current + 1 > max) {
            outOfBoundsErr(current + 1);
            return;
        }

        lock = true;
        setTimeout(() => lock=false, TIMEOUT);
        scrollTo(++current);
        dispatchScrollEvent(current-1, current);
    };

    const scrollUp = function() {
        if (current - 1 < 0) {
            outOfBoundsErr(current - 1);
            return;
        }

        lock = true;
        setTimeout(function() { lock=false; }, TIMEOUT);
        scrollTo(--current);
        dispatchScrollEvent(current+1, current);
    };

    const scrollTo = function(pageNum) {
        if (pageNum > max || pageNum < 0) {
            outOfBoundsErr(pageNum);
            return;
        }

        select(CONTAINER_SYMBOL).style.transform = `translateY(-${unit.vh() * 100 * pageNum}px)`;
        current = pageNum;
    };

    const revealRight = function() { 
        pages[current].style.transform = `translateX(-${100 * unit.vw()}px)`;
        state = 'right';
        lock = true;
    };

    const revealLeft = function() { 
        pages[current].style.transform = `translateX(${100 * unit.vw()}px)`;
        state = 'left';
        lock = true;
    };

    const conceal = function() {
        pages[current].style.transform = `translateX(0px)`;
        state = '';
        lock = false;
    }

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


            if (deltaY > TOUCH_SENSITIVITY) {
                if (hasUp()){ 
                    scrollUp(); 
                } else if (deltaY > LONG_SWIPE) {
                    window.location.reload();
                }
            } else if (deltaY < -TOUCH_SENSITIVITY && hasDown()) {
                scrollDown();
            }

            document.removeEventListener('touchmove', handleSwipe);
        };

        document.addEventListener('touchmove', handleSwipe);
    }

    const computeCSS = function (){ 
        return `
            html, body, ${CONTAINER_SYMBOL} {
                margin: 0!important;
                padding: 0!important;
                overflow: hidden!important;
            }
            ${CONTAINER_SYMBOL} {
                position: fixed!important;
                top: 0!important;
                left: 0!important;
                width: ${100 * unit.vw()}px!important;
            }
            ${PAGE_SYMBOL} {
                box-sizing: border-box!important;
                height: ${100 * unit.vh()}px!important;
            }
            ${R_CHILD_SYMBOL},
            ${L_CHILD_SYMBOL} {
                position: absolute;
                top: 0;
                height: ${100 * unit.vh()}px!important;
                width: ${100 * unit.vw()}px!important;
                overflow-y: scroll;
            }
            ${R_CHILD_SYMBOL} {
                left: ${100 * unit.vw()}px;
            }
            ${L_CHILD_SYMBOL} {
                left: -${100 * unit.vw()}px;
            }
        `;
    };

    const applyTransition = function() {
        let apply = function(element) {
            let style = element.style;
            style.transitionProperty = 'transform';
            style.transitionDuration = transition.duration;
            style.transitionTimingFunction = transition.function;
        }

        apply(select(CONTAINER_SYMBOL));

        // for .. of is appearantly not supported in IE
        for (let i = 0; i <= max; i++) {
            apply(pages[i]);
        }
    }

    const removeTransition = function() {
        let remove = function(element) {
            let style = element.style;
            style.transitionProperty = '';
            style.transitionDuration = '';
            style.transitionTimingFunction = '';
        }

        remove(select(CONTAINER_SYMBOL));

        // for .. of is appearantly not supported in IE
        for (let i = 0; i <= max; i++) {
            remove(pages[i]);
        }
    }

    const applyStyle = function() {
        select('#ssgStyle').innerHTML = computeCSS();
    }

    const handleResize = function(event) {
        removeTransition();
        applyStyle();
        setPage(current);
        applyTransition();
    };

    const init = function() {
        window.pageYOffset = 0;
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        document.body.parentNode.scrollTop = 0;

        let style = create('style');
        style.setAttribute('id', 'ssgStyle');
        document.body.appendChild(style);
        pages = selectAll(PAGE_SYMBOL);
        max = pages.length-1;

        applyStyle();
        applyTransition();
        setPage(current);

        window.addEventListener('resize', handleResize);
        document.addEventListener('wheel', handleWheel);
        document.addEventListener('keyup', handleKey);
        document.addEventListener('touchstart', handleTouch);
    };
    
    window.addEventListener('DOMContentLoaded', init);

    return {
        scrollDown: scrollDown,
        scrollUp: scrollUp,
        scrollTo: scrollTo,

        setPage: setPage,

        revealRight: revealRight,
        revealLeft: revealLeft,
        conceal: conceal,

        getPage: getPage,
        getIndex: getIndex,
        getPages: getPages,

        getTransitionDuration: getTransitionDuration,
        getTransitionFunction: getTransitionFunction,

        setTransitionDuration: setTransitionDuration,
        setTransitionFunction: setTransitionFunction,
    };
}();