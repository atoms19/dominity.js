
---

### `forEvery.md`

```md
# .forEvery() – Iterative Rendering

The `.forEvery()` helper is used to render a list of elements based on a reactive iterable (like an array or `state([])` list). It is highly performant and automatically updates the DOM when the list changes.

Unlike manual loops, `.forEvery()` tracks changes efficiently using a virtual key-diffing strategy, minimizing DOM updates when possible.

---

## Basic Usage

```js
const fruits = state(['Apple', 'Banana', 'Cherry'])

ul().forEvery(fruits, fruit => li(fruit))
```

This will render:

```html
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>
```

---

## Using Keys (Recommended)

`.forEvery()` supports keying each item to optimize re-renders and preserve element identity.

```js
const users = state([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
])

ul().forEvery(users, user => li(user.name), user => user.id)
```

If an item is moved or updated, `.forEvery()` will use the key to avoid re-creating the DOM node.

---

## Example: Todo List

```js
const todos = state([
  { id: 1, task: 'Write docs' },
  { id: 2, task: 'Refactor code' }
])

function TodoItem(todo) {
  return li(todo.task)
}

ul().forEvery(todos, TodoItem, todo => todo.id)
```

You can dynamically add or remove items:

```js
button('Add Task')
  .on('click', () => {
    todos.value = [
      ...todos.value,
      { id: Date.now(), task: 'New Task' }
    ]
  })
```

---

## Example: Table Rendering

```js
const rows = state([
  { name: 'Item A', qty: 2 },
  { name: 'Item B', qty: 5 }
])

table({ border: 1 },
  thead(
    tr(th('Name'), th('Quantity'))
  ),
  tbody().forEvery(rows, row =>
    tr(
      td(row.name),
      td(String(row.qty))
    ),
    row => row.name // key by name
  )
)
```

---

## Performance

`.forEvery()` is reactive and uses internal key-diffing to:

- Minimize DOM changes
- Maintain input focus or local state
- Efficiently reorder or patch lists

Avoid using `.forEvery()` without a key for dynamic data. If the key is missing or unstable, the entire list may re-render.

---

## When To Use

| Situation             | Recommendation          |
|----------------------|--------------------------|
| Static content        | Use normal loops (if outside of render) |
| Reactive lists        | Use `.forEvery()`        |
| Mutable arrays        | Update `.value` directly and re-render |
| Unique IDs per item   | Always use keys          |

---

## Best Practices

- Always provide a stable key for each item.
- Avoid heavy computation inside the render function. especially dont use `$css()` without classRef
- Use `.forEvery()` only with reactive states (like `state([])`).
- To clear the list, set `state.value = []`.

---

## Summary

| Feature            | Description                                |
|--------------------|--------------------------------------------|
| Reactive           | Updates DOM when data changes              |
| Key support        | Helps with optimized diffing               |
| DOM preserving     | Minimizes reflows and maintains stability  |
| Declarative        | Clean and readable syntax                  |
```
