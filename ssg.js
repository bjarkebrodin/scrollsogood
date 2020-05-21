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

    const TIMEOUT = 700;

    let current = 0;
    let max = 0;
    let lock = false;

    // Private Methods
    const setPage = (pageNum) => {
        document.body.style.transform = `translateY(-${unit.vh() * 100 * pageNum}px)`;
    }
 
    // Public Methods
    const setTransitionDuration = () => 'setTransitionDuration';
    const setTransitionFunction = () => 'setTransitionFunction';
    const getTransitionDuration = () => 'getTransitionDuration';
    const getTransitionFunction = () => 'getTransitionFunction';
    
    const getCurrentPage = () => 'getCurrentPage';
    
    const hasDown = () => current < max - 1;
    const hasUp = () => current > 0;
    const hasRight = () => 'hasRight';
    const hasLeft = () => 'hasLeft';
    
    const scrollDown = () => {
        lock = true;
        setTimeout(() => lock=false, TIMEOUT);
        setPage(++current);
        console.log('scrollDown');
    };
    const scrollUp = () => {
        lock = true;
        setTimeout(() => lock=false, TIMEOUT);
        setPage(--current);
        console.log('scrollUp')
    };
    const scrollTo = (pageNum) => 'scrollTo' + pageNum;

    const revealRight = () => 'scrollRight';
    const revealLeft = () => 'scrollLeft';

    const wheelHandler = (event) => {
        event.stopImmediatePropagation();
        if (lock) return;
        if (event.deltaY > 0 && hasDown()) 
            scrollDown();
        else if (event.deltaY < 0 && hasUp())
            scrollUp();
    }

    const init = () => {
        var css = `
            html, body {
                margin: 0;
                padding: 0;
                overflow: hidden;
            }
            .ssg.page {
                height: ${100 * unit.vh()}px;
            }
        `
        let style = create('style');
        style.innerHTML = css;
        document.body.appendChild(style);

        max = selectAll('.ssg.page').length;

        document.addEventListener('wheel', wheelHandler);
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