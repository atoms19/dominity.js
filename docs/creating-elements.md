# Creating Elements in Dominity

## Basic Elements

Dominity elements are functions that mirror HTML elements in behavior. They're intuitive and straightforward to use.

```js
import d from "dominity"

d.h1("Hello",d.span("world"));
```

```javascript
import { h1, span } from "dominity";

// Creates: <h1>Hello <span>world</span></h1>
h1("Hello", span("world"));
```

## Element Arguments

Dominity elements handle different types of arguments in specific ways:

1. **Strings**
   -  Treated as text nodes

   ```javascript
   p("This is a text node");
   ```

2. **Other Dominity Elements**
   -  Treated as child nodes

   ```javascript
   div(h1("Title"), p("Paragraph"));
   ```

3. **Objects**
   -  Treated as element attributes

   ```javascript
   input({
      type: "text",
      placeholder: "Enter your name",
      "aria-label": "form-input"
   });
   ```

4. **Functions/Template Literals**
   -  Create reactive text nodes that update when state changes
   ```javascript
   const count = state(0);
   div(() => `Count: ${count()}`);
   ```

## Example Usage

```javascript
// Creating a menu list
ul({ class: "menu-list" }, li("Item 1"), li("Item 2"), li("Item 3"));

// Creating a form input
input({
   type: "text",
   placeholder: "Enter your name",
   "aria-label": "form-input"
});

// Attributes can be placed anywhere in the arguments
main(h1("Title"), "Content", { class: "container" });
```

## Event Handling

Add event listeners using the `.on()` method:

```javascript
button("Click me").on("click", (e) => {
   console.log("Button clicked!", e);
});

// Multiple events
button("Interactive")
   .on("click", () => console.log("Clicked"))
   .on("mouseover", () => console.log("Hover"));
```

## Inline Styling

Apply CSS styles using the `.css()` method:

```javascript
button("Submit").css({
   background: "var(--primary)",
   color: "white",
   borderRadius: "8px",
   padding: "1rem 2rem",
   border: "none"
});
```

> **Note:** The `.css()` method doesn't support pseudo-classes (`:hover`, `:after`) or media queries. For more complex styling use `.$css()` see advanced styling [click here ](./installation.md), use external CSS files or CSS-in-JS solutions like Tailwind or Synxia.

## Method Chaining

You can chain multiple methods together:

```javascript
button("Interactive Button")
   .css({ background: "blue" })
   .on("click", () => console.log("Clicked"))
   .on("mouseover", () => console.log("Hover"));
```
