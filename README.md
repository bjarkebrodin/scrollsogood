
must have viewport tag defined
needs complete control over <body>, <html> and `.ssg.page` element positioning and size.

# ScrollSoGood
A Javascript library for discrete scrolling. SSG lets you structure the content of your page, in full height/width sections that can be scrolled through in a discrete fashion. SSG allows each page to have an optional child page, this can be placed either to the left or right of the page itself, and brought into view through the provided API. Events of type `ssg-scroll` are provided when changing pages.

`data-ssg-children = left | right | both`

## API

The SSG logic lives in the `ssg` object, thus all calls to the SSG api must be qualified as such.

```javascript
// Movement
scrollDown() // Transitions down one page, error if no such page
scrollUp() // Transitions up one page, error if no such page

scrollTo(pageNum) // Transitions to the specified page, error if no such page
setPage(pageNum) // Snaps to the specified page

revealLeft()
revealRight()
conceal()

// Style
get/setTransitionDuration()
get/setTransitionFunction()

getPage()
getPageIndex()
```

When the page is scrolled a custom event is fired. 

## Q&A

#### Why not horizontal scroll to left/right?
_Design decision - it would increase complexity a fair bit. Checking for four-way touch events is fairly easy, but the logic to determine if any given page **should** be horizontally scrollable, and in which directions is a little more complex. Thus i leave this for a possible future iteration of the project, if it is an in-demand feature._

#### What happens if i revealRight/Left without having a specified element that matches?
_The element translates to where the Right/Left element would be if it was there. Since there is no horizontal scrolling, simply just don't allow the user to revealRight/Left from a page that has no Right/Left children. In the future there might be a safety check built in to avoid this._