/*
ScrollSoGood - (ssg)

A Javascript utility framework for cross-platform
full-page scrolling pages. 

Authored by Bjarke Brodin Larsen.

Breaks the default scrolling functionality and 
replaces it with a 'full page card' system. 

// Transforms may break position:fixed styles of contained elements
*/

const ssg = function() 
{
    { // Block and hoist utils, just for IDE
        var select = (query) => document.querySelector(query);
        var selectAll = (query) => document.querySelectorAll(query);
        var create = (tagName) => document.createElement(tagName);

        var unit = {
            vh: () => window.innerHeight/100,
            vw: () => window.innerWidth/100
        };
    }

    const TIMEOUT = 800;
    const TOUCH_SENSITIVITY = 5;
    const UP_KEYS = [37, 38];
    const DOWN_KEYS = [39, 40];

    let current = 0;
    let max = 0;
    let lock = false;

    // Private Methods
    const setPage = (pageNum) => {
        if (pageNum > max || pageNum < 0) {
            console.error(`ssg error: page number ${pageNum} out of bounds for [0;${max}]`);
        } 

        document.body.style.transition = 'none';
        document.body.style.transform = `translateY(-${unit.vh() * 100 * pageNum}px)`;
        document.body.style.transition = 'all .5s linear';
        
        current = pageNum;
    }
 
    // Public Methods
    const setTransitionDuration = () => 'setTransitionDuration';
    const setTransitionFunction = () => 'setTransitionFunction';
    const getTransitionDuration = () => 'getTransitionDuration';
    const getTransitionFunction = () => 'getTransitionFunction';
    
    const getCurrentPage = () => current;
    
    const hasDown = () => current < max;
    const hasUp = () => current > 0;
    const hasRight = () => 'hasRight';
    const hasLeft = () => 'hasLeft';
    
    const scrollDown = () => {
        lock = true;
        setTimeout(() => lock=false, TIMEOUT);
        scrollTo(++current);
    };

    const scrollUp = () => {
        lock = true;
        setTimeout(() => lock=false, TIMEOUT);
        scrollTo(--current);
    };

    const scrollTo = (pageNum) => {
        document.body.style.transform = `translateY(-${unit.vh() * 100 * pageNum}px)`;
    };

    const revealRight = () => 'scrollRight';
    const revealLeft = () => 'scrollLeft';

    const handleWheel = (event) => {
        // Todo: handle special scroll types like mac etc
        if (lock) return;
        if (event.deltaY > 0 && hasDown()) 
            scrollDown();
        else if (event.deltaY < 0 && hasUp())
            scrollUp();
    };

    const handleKey = (event) => {
        if (lock) return;
        let key = event.which;
        if (UP_KEYS.includes(key) && hasUp())
            scrollUp();
        else if (DOWN_KEYS.includes(key) && hasDown())
            scrollDown();
    };

    const handleTouch = (event) => {
        let startY = event.touches[0].screenY;
        
        function handleSwipe(evt) {
            if (lock) return;
            let deltaY = evt.touches[0].screenY - startY;
            if (deltaY > TOUCH_SENSITIVITY && hasUp())
                scrollUp();
            else if (deltaY < -TOUCH_SENSITIVITY && hasDown())
                scrollDown();

            document.removeEventListener('touchmove', handleSwipe);
        };

        document.addEventListener('touchmove', handleSwipe);
    }

    const computeCSS = () => `
        html, body {
            margin: 0!important;
            padding: 0!important;
            overflow: hidden!important;
        }
        .ssg.page {
            box-sizing: border-box!important;
            height: ${100 * unit.vh()}px!important;
        }
    `;

    const handleResize = (event) => {
        select('#ssgStyle').innerHTML = computeCSS();
        setPage(current);
    }

    const init = () => {
        var css = computeCSS();
        let style = create('style');
        style.innerHTML = css;
        style.setAttribute('id', 'ssgStyle');
        document.body.appendChild(style);

        max = selectAll('.ssg.page').length-1;

        window.addEventListener('resize', handleResize);
        document.addEventListener('wheel', handleWheel);
        document.addEventListener('keyup', handleKey);
        document.addEventListener('touchstart', handleTouch);

        setPage(current);
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