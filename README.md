
# ScrollSoGood

A Javascript library for discrete scrolling. SSG lets you structure the content of your page, in full height/width sections that can be scrolled through in a discrete fashion. SSG allows each page to have optional child pages, these can be placed either to the left/right of the page itself, and brought into view through the provided API. Events of type `ssg-scroll` are provided when changing pages, see [Events](#Events).

## Usage

Must have viewport tag defined needs complete control over <body>, <html> and `ssg-page` element positioning, size and transform properties. Content can be placed to the left or the right of an element, by using the `ssg-child` class. For reference see below example or the demo.

```html
<body>
    <div class="ssg-page">
        Page 1

        <button onclick="revealLeft()"> left </button>
        <button onclick="revealRight()"> right </button>

        <div class="ssg-child-left"> 
            <!-- This is hidden -->
            <button onclick="conceal()"> back </button>
        </div>

        <div class="ssg-child-right"> 
            <!-- This is hidden -->
            <button onclick="conceal()"> back </button>
        </div>
    </div>

    <div class="ssg-page">
        Page 2
    </div>
    <!-- ... -->
</body>
```

## API

The SSG logic lives in the `ssg` object, thus all calls to the SSG api must be qualified as such.

### Scrolling

Scrolling up and down is handled internally, but if you wish to modify the existing behaviour or add buttons and such, the below methods are provided 

Method | Specification | Transition
-|-|-
`ssg.scrollDown()` | Scrolls down one page, if there is one | Yes
`ssg.scrollUp()` | Scrolls up one page, if there is one | Yes
`ssg.scrollTo(pageNum)` | Scrolls to the specified page, if there is one | Yes
`ssg.setPage(pageNum)` | Snaps to the specified page, if there is one | No

##### Informative scroll methods
Method | Specification
-|-
`ssg.getPage()` | Returns the object representing the current page
`ssg.getPageIndex()` | Returns the index of the current page (starting from 0 heh)

### Horizontal Navigation

No horizontal navigation is done internally, the functionality is simply provided through the following methods. Note that since the client code has all the power here, there are __NO CHECKS__ performed, to determine whether there is actually any content to reveal!

Method | Specification | Transition
-|-|-
`ssg.revealLeft()` | Reveals the left child of the current page | Yes
`ssg.revealRight()` | Reveals the left child of the current page | Yes
`ssg.conceal()` | Resets to the default page | Yes

### Events

When the page is scrolled vertically a custom event is fired. This event has the type `ssg-scroll`. Listening for these and working with them can be done as below.

```javascript
document.addEventListener('ssg-scroll', function(event) {
    let srcPageNum = event.detail.sourceIndx+1;
    let targetPageNum = event.detail.targetIndx+1;
    let srcPage = event.detail.sourcePage;
    let targetPage = event.detail.targetPage;

    console.log(`Hey we just scrolled a page!`);
    console.log(`We were at page number ${srcPageNum}, which was this node :`);
    console.log(srcPage);
    console.log(`Now we are at page number ${targetPageNum}, which is this node :`);
    console.log(targetPage);    
});
```

### Transition
// Style
get/setTransitionDuration()
get/setTransitionFunction()


## Q&A

#### But there is no scrollbar though????

_I know :( - I will provide a default one as soon as i get to it - in the meantime, all the information necessary to create one is available through the events._

#### Why not horizontal scroll to left/right?

_Design decision - it would increase complexity a fair bit. Checking for four-way touch events is fairly easy, but the logic to determine if any given page **should** be horizontally scrollable, and in which directions is a little more complex. Thus i leave this for a possible future iteration of the project, if it is an in-demand feature._

#### What happens if i revealRight/Left without having a specified element that matches?

_The element translates to where the Right/Left element would be if it was there. Since there is no horizontal scrolling, simply just don't allow the user to revealRight/Left from a page that has no Right/Left children. In the future there might be a safety check built in to avoid this._

#### Why are there no reveal/conceal events, when there is scroll events?

_Since the decision was made, that all calls to reveal/conceal happen from client code, there seems to be no appearant need for an event, since all the information is available to clients already._
