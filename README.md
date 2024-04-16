## Dominity Documentation

### Introduction
Dominity is a concise JavaScript library designed to streamline HTML and JavaScript integration, focusing on simplifying DOM manipulation and componentization. It offers intuitive methods and utilities for efficiently building interactive web applications.

### Features

#### Bringing HTML to JavaScript
Dominity facilitates seamless interaction between HTML and JavaScript through its `el()`, `$el()`, and `$$el()` functions. These functions allow developers to effortlessly create, manipulate, and query DOM elements within JavaScript code.

- `el(typ, txt = '', attrs = {})`: Creates a DOM element of the specified type with optional text content and attributes.
- `$el(qry)`: Finds and returns a DOM element matching the specified query.
- `$$el(qry)`: Finds and returns an array of DOM elements matching the specified query.

#### Simplified Componentization
Dominity simplifies componentization by encapsulating DOM manipulation functions within reusable functions, effectively acting as components. This approach allows developers to create modular and maintainable code structures with ease, utilizing function parameters as component props.

```js
function Counter() {
  let count = reactable(0).as('count');

  el('div').
    _el('p', "count: {{count}}").$pa().
    _el('button', "increment").onClick(() => {
      count.set(count.value + 1);
    }).$pa().
    _el('button', 'decrement').onClick(() => {
      count.set(count.value - 1);
    }).
    $pa().
    reactTo(count);
}
```

#### Chaining DOM Elements
Dominity enables chaining of DOM elements using `_el()` and `$pa()` methods, allowing developers to efficiently construct complex DOM structures in a concise and readable manner.

```js
el('div')._el('p', "Paragraph 1").$pa()._el('p', "Paragraph 2").$pa();
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

### Conclusion
Dominity provides developers with essential tools for efficient DOM manipulation, componentization, and reactivity management, empowering them to create dynamic and responsive web applications .