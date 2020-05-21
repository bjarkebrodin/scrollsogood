
must have viewport tag defined
needs complete control over <body>, <html> and `.ssg.page` element positioning and size.

# ScrollSoGood
A Javascript library for discrete scrolling. SSG lets you structure the content of your page, in full height/width sections that can be scrolled through in a discrete fashion. SSG allows each page to have an optional child page, this can be placed either to the left or right of the page itself, and brought into view through horizontal scrolling or through the provided API. Events of type `ssg-scroll` are provided when changing pages.


## API

The SSG logic lives in the `ssg` object, thus all calls to the SSG api must be qualified as such.

```javascript
// Movement
hasDown() // True if there is a page below the currently visible one
hasUp() // True if there is a page above the currently visible one
scrollDown() // Transitions down one page, error if no such page
scrollUp() // Transitions up one page, error if no such page
scrollTo(pageNum) // Transitions to the specified page, error if no such page

hasLeft()
hasRight() -> false if no content
left()
right()

getCurrentPage()

// Style
setTransitionTiming()
getTransitionTiming()
```

When the page is scrolled 