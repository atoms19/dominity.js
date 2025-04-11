# `.showIf()` – Conditional Rendering

The `.showIf()` helper controls an element's visibility based on a reactive state or a derived condition. It toggles the display style of the element (`display: none`) without removing it from the DOM, maintaining state and structure.

## Basic Usage

You can pass a reactive state directly:

```js
const isVisible = state(true)

div('This is visible').showIf(isVisible)

div('Conditionally visible').showIf(() => someState.value === 'ready')

```

Here’s a complete documentation file for **conditional rendering using `.showIf()`**, including a dropdown menu example, reactive toggling, and best practices.

---

### 📄 `showIf.md`

```md
# `.showIf()` – Conditional Rendering

The `.showIf()` helper controls an element's visibility based on a reactive state or a derived condition. It toggles the display style of the element (`display: none`) without removing it from the DOM, maintaining state and structure.

## Basic Usage

You can pass a reactive state directly:

```js
const isVisible = state(true)

div('This is visible').showIf(isVisible)
```

Or provide a function for dynamic conditions:

```js
div('Conditionally visible').showIf(() => someState.value === 'ready')
```

---

## Example: Toggle Visibility Button

```js
const showDetails = state(false)

div(
  button('Toggle Details').on('click', () => showDetails.value = !showDetails.value),
  div('Extra details here...').showIf(showDetails)
)
```

---

##  Example: Dropdown Menu

Here’s how you can build a simple dropdown using `.showIf()`:

```js

function Dropdown() {
    const isOpen = state(false)

  return div({ class: 'dropdown' },
    button('Toggle Menu')
      .on('click', () => isOpen.value = !isOpen.value),

    ul({ class: 'dropdown-menu' },
      li('Home'),
      li('Profile'),
      li('Settings')
    ).showIf(isOpen)
  )
}
```

### Styling Suggestion

You can enhance this with styles (via `.css()` or `$css()`): see [Styling](styling.md) for more details.

```js
ul({ class: 'dropdown-menu' })
  .$css(`
    $this {
      background: white;
      border: 1px solid #ccc;
      padding: 0.5rem;
      list-style: none;
      margin-top: 0.5rem;
    }

    $this li {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }

    $this li:hover {
      background: #f0f0f0;
    }
  `)
  .showIf(isOpen)
```

---

##  Notes

- The element is not removed from the DOM. It’s hidden via `display: none`.
- The `.showIf()` condition is reactive — it will update automatically when the state changes.
- You can chain it after any element creation method.

---

##  Best Practices

- Use `.showIf()` instead of manual DOM toggling or `if` conditions.
- Pair it with state toggling (`state()`) for reactivity.
- Avoid nesting too many `.showIf()` calls — extract logic into functions if needed.

---

##  Summary

| Use Case          | Example                            |
|-------------------|------------------------------------|
| Show/hide content | `div().showIf(showContent)`        |
| Toggle element    | `button().on('click', ...)` + `.showIf()` |
| Conditional logic | `el().showIf(() => x.value > 5)`   |