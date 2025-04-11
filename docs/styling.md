
# Styling in Dominity

Dominity provides multiple styling APIs to apply and manage styles on components efficiently. You can style elements inline, attach dynamic classes, or inject custom CSS at runtime using `$css`.

---

## 1. `.css()` – Inline Styles (Reactively or Statically)

This method is used to directly apply styles to an element. It supports multiple use cases:

### 🔹 a. Apply multiple styles using an object:

```javascript
div('Styled Box').css({
  backgroundColor: 'blue',
  padding: '10px',
  color: 'white'
})
```

### 🔹 b. Set or get a specific property:

```javascript
// Set a single style
div('Text').css('fontSize', '20px')

// Get the computed value of a property
const size = div().css('fontSize') // returns something like '16px'
```

### 🔹 c. Reactive styling using a function:

```javascript
const isLarge = state(false)

div('Resizable Box').css(() => ({
  width: isLarge.value ? '200px' : '100px',
  transition: '0.3s'
}))
```

---

## 2. `.addClass()` / `.removeClass()` – Manual Class Management

Use these to manually toggle classes:

```javascript
div('Box')
  .addClass('bg-red', 'rounded', 'shadow')
  .removeClass('shadow')
```

---


## 4. `$css()` – Inject Dynamic CSS (like Tailwind macros)

The `$css()` method allows you to write scoped CSS dynamically, injecting it into the DOM. `$this` is replaced with a randomly generated class name, applied automatically to the element.

### 🔹 a. Basic Usage:

```javascript
div('Fancy Button').$css(`
  $this {
    background-color: teal;
    padding: 10px;
    border-radius: 5px;
    color: white;
  }
  $this:hover {
    background-color: darkcyan;
  }
`)
```

### 🔹 b. Storing Generated Classname in Reactive State

You can preserve the generated classname using a state for reuse:

```javascript
const classRef = state(null)

div('Styled Div').$css(`
  $this {
    color: white;
    background-color: purple;
    padding: 12px;
  }
`, classRef)

p('Another').addClass(classRef.value) // Apply the same style elsewhere

or 

p('Another').$css(classRef) //automatically recogonize the classRef
```

If `classRef.value` is already set, it will reuse it and not generate a new class.


---

## 5. `.bindClass()` – Class Binding Based on State

This method binds class toggling to a reactive state. It adds or removes class names based on the value of a state.

### 🔹 Example:

```javascript
const isActive = state(false)

button('Toggle')
  .on('click', () => isActive.value = !isActive.value)

div('Toggle Style Box')
  .bindClass(isActive, 'bg-green-500 text-white', 'bg-gray-300 text-black')
  .css({ padding: '10px', borderRadius: '8px', transition: '0.3s' })
```

When `isActive` becomes `true`, the green style is applied; otherwise, the gray one is.

---

##  Combining Styling Methods

You can combine these methods for maximum flexibility:

```javascript
const isDark = state(false)
const dynamicClass = state(null)

div('Themed Box')
  .$css(`
    $this {
      transition: 0.3s;
      padding: 1rem;
    }

    $this.dark {
      background-color: #222;
      color: white;
    }

    $this.light {
      background-color: #eee;
      color: black;
    }

    $this:hover {
      transform: scale(1.02);
    }
  `, dynamicClass)
  .bindClass(isDark, 'dark', 'light')
```

---

## Summary Table

| Method         | Description                                                            |
|----------------|------------------------------------------------------------------------|
| `.css()`        | Inline styles (single/multiple/reactive)                              |
| `.addClass()`   | Adds one or more class names                                           |
| `.removeClass()`| Removes one or more class names                                        |
| `$css()`        | Injects scoped CSS and applies it using an auto/random class          |
| `.bindClass()`  | Dynamically toggles class names based on a reactive state             |

---
