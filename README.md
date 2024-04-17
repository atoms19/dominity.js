## Dominity js

### Introduction
Dominity is a concise JavaScript library designed to streamline HTML and JavaScript integration, focusing on simplifying DOM manipulation and componentization. It offers intuitive methods and utilities for efficiently building interactive web applications.

### Features

#### Bringing HTML to JavaScript
Dominity facilitates seamless interaction between HTML and JavaScript through its `el()`, `$el()`, and `$$el()` functions. These functions allow developers to effortlessly create, manipulate, and query DOM elements within JavaScript code.

- `el(typ, txt = '', attrs = {})`: Creates a DOM element of the specified type with optional text content and attributes.
- `$el(qry)`: Finds and returns a dominity DOM element matching the specified query.
- `$$el(qry)`: Finds and returns an array of dominity DOM elements matching the specified query.

dominity DOM elemnts are are objects that have special methods and props to make it easy to style ,add events ,change attributes etc list of all methods are given as a table in the end of documentation


#### Simplified Componentization
Dominity simplifies componentization by encapsulating DOM manipulation functions within reusable functions, effectively acting as components. This approach allows developers to create modular and maintainable code structures with ease, utilizing function parameters as component props.

```js
function Counter() {
  let count = reactable(0).as('count');

  el('div').
    _el('p', "count: {{count}}").$end().
    _el('button', "increment").onClick(() => {
      count.set(count.value + 1);
    }).$end().
    _el('button', 'decrement').onClick(() => {
      count.set(count.value - 1);
    }).
    $end().
    reactTo(count);
}
```

#### Chaining DOM Elements
Dominity enables chaining of DOM elements using `_el()` and `$pa()` methods, allowing developers to efficiently construct complex DOM structures in a concise and readable manner.

```js
el('div')._el('p', "Paragraph 1").$pa()._el('p', "Paragraph 2").$end();
```

#### Reactivity Support
Dominity simplifies reactivity management by providing `reactable().as('')`, `reactTo()`, and `set` methods, leveraging a publish-subscribe model for efficient state management. Developers can easily define reactive states and update DOM elements accordingly.

```js
let count = reactable(0).as('count');
count.subscribe((state) => {
  console.log(`Count: ${state.value}`);
});
count.set(10);
```

### Utility Functions
Dominity offers utility functions for common tasks, including copying text and generating random values.

- `copy(txt)`: Copies the specified text to the clipboard.
- `random(end, start = 0)`: Generates a random value within the specified range.
- `range(s, e, increment = 1)`: Generates an array of numbers within the specified range.

```js
copy("Hello, world!");
let randomNumber = random(1, 100);
let numberRange = range(1, 10);
```

### list of methods
these are all the methods u can chain with any element retrived or created using Dominty functions

methods included:

| Method                  | Description                                                                                    |
|-------------------------|------------------------------------------------------------------------------------------------|
| `constructor(qry)`      | Creates a new `DominityElement` instance.                                                      |
| `text(val=null)`        | Gets or sets the text content of the element.                                                  |
| `html(val=null)`        | Gets or sets the HTML content of the element.                                                   |
| `code(val=null)`        | Gets or sets the outer HTML content of the element.                                             |
| `addText(val='')`       | Appends text content to the existing content of the element.                                    |
| `addHtml(val='')`       | Appends HTML content to the existing content of the element.                                     |
| `addCode(val='')`       | Appends outer HTML content to the existing content of the element.                               |
| `insertHtml(placement,code)` | Inserts HTML content at the specified position relative to the element.                      |
| `insertTxt(placement,txt)`   | Inserts text content at the specified position relative to the element.                         |
| `style(prp, val=null)` | Gets or sets the CSS style property of the element.                                             |
| `class()`               | Adds one or more classes to the element.                                                        |
| `removeClass()`         | Removes one or more classes from the element.                                                   |
| `toggleClass()`         | Toggles one or more classes on the element.                                                     |
| `hasClass(cls)`         | Checks if the element has a specific class.                                                     |
| `getClass(index = 0)`   | Gets the class name of the element at the specified index.                                       |
| `attr(prp, val=null)`   | Gets or sets the attribute of the element.                                                      |
| `hasAttr(val=null)`     | Checks if the element has the specified attribute.                                              |
| `removeAttr()`          | Removes one or more attributes from the element.                                                |
| `toggleAttr(atr, val="")` | Toggles the specified attribute on the element.                                                |
| `value(val=null)`       | Gets or sets the value of the element (for form elements).                                      |
| `checkFor(ev, cb, bub)` | Attaches an event listener to the element.                                                      |
| `stopCheckFor(ev, func, bub)` | Removes an event listener from the element.                                                  |
| `causeEvent(ev)`        | Dispatches a custom event on the element.                                                       |
| `addTo(elm)`            | Adds the element to the specified parent element.                                               |
| `insertTo(olb,placement)` | Inserts the element into the DOM at the specified position.                                    |
| `remove()`              | Removes the element from the DOM.                                                              |
| `addChild()`            | Appends one or more child elements to the element.                                              |
| `insertChild(placement, nod)` | Inserts a child element at the specified position relative to the element.                  |
| `removeChild()`         | Removes one or more child elements from the element.                                             |
| `replaceChild(child, nod)` | Replaces a child element with another element.                                                 |
| `getChild(t)`           | Gets the first child element matching the specified CSS selector.                                |
| `getChildren(q)`        | Gets all child elements matching the specified CSS selector.                                     |
| `child(pos)`            | Gets the child element at the specified index.                                                  |
| `parent()`              | Gets the parent element of the current element.                                                 |
| `next()`                | Gets the next sibling element.                                                                  |
| `previous()`            | Gets the previous sibling element.                                                              |
| `clone(condition = true)` | Clones the element.                                                                            |
| `cloneContent(condition=true)` | Clones the content of the element.                                                           |
| `closest(q)`            | Gets the closest ancestor element that matches the selector.                                     |
| `contains(nod)`         | Checks if the element contains another node.                                                     |
| `matches(q)`            | Checks if the element matches the given selector or element.                                      |
| `hide()`                | Hides the element by setting its display property to "none".                                      |
| `show(disp = "block")`  | Shows the element by setting its display property to the specified value.                         |
| `toggleHide(ondisp, onhide)` | Toggles the visibility of the element.                                                        |
| `focus(val = true)`     | Focuses or blurs the element.                                                                   |
| `click()`               | Simulates a click event on the element.                                                          |
| `scrollTo(s = true)`    | Scrolls the element into view.                                                                  |
| `getScrollInfo()`       | Gets information about the element's scroll position.                                            |
| `getSizeInfo()`         | Gets information about the element's size and position.                                          |
| `fullScreen(val = true)`| Enters or exits full-screen mode.                                                               |
| `onClick(cb)`           | Sets up an event listener for the "click" event.                                                 |
| `enableHold(holdtime=0.5)` | Enables holding event on the element.                                                         |
| `enableSwipe(swipeDistance=50)` | Enables swipe event on the element.                                                         |

> you can still access orginal elements methods and props by using `<dominityElem>.elem.<orginal method>()`
