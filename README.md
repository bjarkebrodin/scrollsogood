
# ScrollSoGood :coffee: :zap:

A Javascript library for discrete scrolling. SSG lets you structure the content of your page, in full height/width sections that can be scrolled through in a discrete fashion. SSG allows each page to have optional child pages, these can be placed either to the left/right of the page itself, and brought into view through the provided API. Events of type `ssg-scroll` are provided when changing pages, see [Events](#Events). If anything is weird, out-of-place, or inconvenient, let me know or post an issue, and i will take a look at it as soon as time permits. Note that this is still a young library so any and all reaction is valuable and encouraged :beer:

## Usage

Must have viewport tag defined for mobile - the library needs control over a few properties on `html`, `body`, `#ssg-container`, `.ssg-page` and `.ssg-child-right`/`.ssg-child-left`. The reserved properties are `margin`,`padding`,`height`,`width`,`overflow`,`transform`,`box-sizing`,`top|right|bottom|left` and `transition`. The inconvenience of having to modify the transition through API is an unfortunate consequence of having to toggle it on and off during some operations.

To use the plugin, first you must define a container for the pages using `id="ssg-container"` - it is highly recommended to NOT choose body, since this breaks `position: fixed` on perifal stuff you wish to build on top of the scrollable content (scrollbar, pagenumber etc). Each page should then be defined sequentially inside the container, using `class="ssg-page"`.

There are no requirements for tagnames of pages, children or the container - but it is recommended to use block-level grouping tags such as `div`, `section`, `main`, `header`, `footer`, `aside` etc.. - remember as well that violating the reserved properties as described above will break stuff.

There are no requirements for the element hierarchy either, except naturally that pages are in a container and children are in a page. Elements can be placed in between pages, or pages can be grouped semantically - but you should avoid placing any element with a nonzero height outside of a page, since this breaks viewport aligned positioning.

### Example Structure

```html
<body>
    <!-- fixed content -->
    <div id="ssg-container">
        <div class="ssg-page">
            Page 1
            <button onclick="revealLeft()"> left </button>
            <button onclick="revealRight()"> right </button>
            <div class="ssg-child-left"> 
                <button onclick="conceal()"> back </button>
            </div>

            <div class="ssg-child-right"> 
                <button onclick="conceal()"> back </button>
            </div>
        </div>

        <div class="ssg-page">
            Page 2
        </div>
    </div>
</body>
```

Due to browser handling of `position: fixed` in combination with `transform: translate(..)`, globally fixed content has to be placed outside the `ssg-container`. This is a little more obtrusive than i would like it, but seems unavoidable.

## API

The SSG logic lives in the `ssg` object, thus all calls to the SSG api must be qualified as such.

### Scrolling

Scrolling up and down is handled internally by default, but if you wish to modify the existing behaviour or add buttons and such, the below methods are provided 

Method | Specification | Transition
-|-|-
`ssg.scrollDown()` | Scrolls down one page, if there is one | Yes
`ssg.scrollUp()` | Scrolls up one page, if there is one | Yes
`ssg.scrollTo(pageNum)` | Scrolls to the specified page, if there is one | Yes
`ssg.setIndex(pageNum)` | Snaps to the specified page, if there is one | No

##### Informative scroll methods
Method | Specification
-|-
`ssg.getPage()` | Returns the object representing the current page
`ssg.getPages()`| Returns an array containing all the pages in order
`ssg.getIndex()` | Returns the index of the current page (starting from 0 heh)

### Horizontal Navigation

No horizontal navigation is done internally, the functionality is simply provided through the following methods.

Method | Specification | Transition
-|-|-
`ssg.revealLeft()` | Reveals the left child of the current page | Yes
`ssg.revealRight()` | Reveals the left child of the current page | Yes
`ssg.conceal()` | Resets to the default page | Yes

### Transition

If you wish to specify custom transition properties for animations, this can be done through below methods. 

Method | Specification
-|-
`ssg.getTransitionDuration()` | Returns a string, the transition duration, eg. `"1s"`
`ssg.getTransitionFunction()` | Returns a string, the transition function, eg. `"ease-in"`
`ssg.getScrollTimeout()` | Returns an integer, the time scroll is disabled after a scroll event fires - in miliseconds.

If you wish to use the default, or if it is otherwise convenient to you, these accessors are provided

Method | Specification
-|-
`ssg.setTransitionDuration(time)` | Assigns time as the duration of the used transition, must be a stringified css version, eg `"1s"`.
`ssg.setTransitionFunction(func)` | Assigns func as the timing function of the used transition, must be a stringified css version, eg `"ease-in"`.
`ssg.setScrollTimeout()` | Sets the time scroll is disabled after a scroll event fires - in miliseconds.

__NOTE__ that a timeout is used to prevent devices with accelerated scroll behaviour from firing many events in a single scroll action, thus there is an imposed barrier of a fraction of a second for how often a new page can be scrolled to - i am working on getting this timeout as low as possible - but it is a tricky problem. This __does not directly affect transitions__, but if you are expecting that setting the timing duration to 0 will make everything instant, it will not - the animation will be instant, but there will still be a timeout before the user can scroll again.

## Events

When the page is scrolled vertically a custom event is fired. This event has the type `ssg-scroll`. Listening for these and working with them can be done as below.

```javascript
document.addEventListener('ssg-scroll', function(event) {
    let srcPageNum = event.srcIndex;
    let targetPageNum = event.targetIndex;
    let srcPage = event.srcPage;
    let targetPage = event.targetPage;

    console.log(`Hey we just scrolled a page!`);
    console.log(`We were at page number ${srcPageNum}, which was this node :`);
    console.log(srcPage);
    console.log(`Now we are at page number ${targetPageNum}, which is this node :`);
    console.log(targetPage);    
});
```

## Q&A

#### But there is no scrollbar though????

_I know, all the information necessary to create one is available through the events. In the near future an optional scrollbar module will be added to this repo._

#### Why not horizontal scroll to left/right?

_Design decision, the revealable content is thought of as sub-pages and not integral parts of the 'main'-flow._

#### Why are there no reveal/conceal events, when there is scroll events?

_Since the decision was made, that all calls to reveal/conceal happen from client code, there seems to be no appearant need for an event, since all the information is available to clients already. Simply include the logic you need for this in your own calls._
