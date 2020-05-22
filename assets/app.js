window.addEventListener('DOMContentLoaded', (event) => {
    ssg.setTransitionDuration = '.5s';

    let applyPageStyles = (i) => {
        document.body.className = 'p' + i;
        document.body.style.transitionProperty = 'all';
        document.body.style.transitionDuration = ssg.getTransitionDuration();
        document.body.style.transitionTimingFunction = ssg.getTransitionFunction();
    };
    applyPageStyles(1);
    document.addEventListener('ssg-scroll', (event) => {
        let pageNum = event.detail.targetIndx;
        applyPageStyles(pageNum+1);
    });
});