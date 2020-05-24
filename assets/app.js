window.addEventListener('DOMContentLoaded', (event) => {
    ssg.setTransitionDuration = '.2s';

    let scrollbar = document.querySelector('#scrollbar');
    let scrollTicks = [];
    for (let i = 0; i < ssg.getPages().length; i++) {
        let scrollbarTick = document.createElement('div');
        scrollbarTick.className = 'scrolltick';
        scrollbarTick.style.transitionProperty = 'all';
        scrollbarTick.style.transitionDuration = ssg.getTransitionDuration();
        scrollbarTick.style.transitionTimingFunction = ssg.getTransitionFunction();
        scrollbar.appendChild(scrollbarTick);
        scrollTicks.push(scrollbarTick);
    }

    let applyPageStyles = (i) => {
        document.body.className = 'p' + i;
        document.body.style.transitionProperty = 'all';
        document.body.style.transitionDuration = ssg.getTransitionDuration();
        document.body.style.transitionTimingFunction = ssg.getTransitionFunction();

        for(let tick of scrollTicks) {
            if (tick.className.indexOf('active') != -1) {
                tick.classList.remove('active');
            }
        }
        scrollTicks[i-1].classList.add('active');
    };

    applyPageStyles(1);
    document.addEventListener('ssg-scroll', (event) => {
        let pageNum = event.targetIndex;
        applyPageStyles(pageNum+1);
    });

    let title = document.querySelector('h1');
    title.style.transitionProperty = 'all';
    title.style.transitionDuration = ssg.getTransitionDuration();
    title.style.transitionDelay = '.5s';
    title.style.transitionTimingFunction = ssg.getTransitionFunction();
    title.style.fontSize = '4rem';
    title.style.color = '#fefefe';
});

function SSGEvent(type, from, to) {
    let params = {
        bubbles: true,
        cancelable: false,
        detail: null
    };

    let self = Reflect.construct(CustomEvent, [type, params], this.constructor);

    self.from = from;
    self.to = to;

    return self;
}

SSGEvent.prototype = Object.create(CustomEvent.prototype);
SSGEvent.prototype.constructor = SSGEvent;
Object.setPrototypeOf(SSGEvent, CustomEvent);

var emmit = () => {
    var e = new SSGEvent('ssg', 1, 2);
    console.log(e)
    document.body.dispatchEvent(e);
};

window.addEventListener('ssg', (e) => console.log(e));