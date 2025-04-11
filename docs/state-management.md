
# Dominity Store

The Dominity Store system provides a simple and reactive way to manage shared state in your app. It supports state, computed getters, and actions for modifying state. The store system is inspired by modern patterns, but minimal by design to stay in line with Dominity's core philosophy.

## Creating a Store

Use `createStore` to define a store. You define your state with `state()`, optionally add `getters` to derive computed values, and `actions` to update the state.

```js
import { createStore, state } from "dominity";

export let counterStore = createStore("count", {
  states: {
    count: state(0),
  },
  getters: {
    double(store) {
      return store.count.value * 2;
    },
  },
  actions: {
    increment(store) {
      store.count.value += 1;
    },
  },
});
```

### Explanation

- **states**: Define reactive properties using `state()`.
- **getters**: Define derived values that auto-update when their dependencies change.
- **actions**: Functions that modify the state. Receives the state object and the full store instance.

---

## Using the Store in Components

To use the store inside components, retrieve values using `getRef()` and call actions directly.

```js
import { counterStore } from "stores";
import { div, button } from "dominity";

export function counter() {
  let count = counterStore.getRef("count");

  return div(
    count,
    button("add").on("click", () => counterStore.increment())
  );
}
```

---

## Editable Store Refs

You can retrieve multiple reactive refs using `getAllRefs({ edit: true })`. This is especially useful for forms or user inputs.

```js
import { userFormData } from "stores";

function userForm() {
  let { username, password, email, feedback } = userFormData.getAllRefs({ edit: true });

  return form(
    input({ placeholder: "name" }).model(username),
    input({ placeholder: "password" }).model(password),
    input({ placeholder: "email" }).model(email)
  ).on("submit", (e) => {
    e.preventDefault();
    userFormData.submit();
  });
}
```

---

## Store API

### `createStore(name, config)`
Creates a new store instance with:
- `states`: Plain reactive values.
- `getters`: Derived values.
- `actions`: State modification functions.

### `store.getRef(key)`
Returns a read-only derived value.

### `store.getEditableRef(key)`
Returns a two-way reactive ref, useful for binding.

### `store.getAllRefs({ edit: true })`
Returns all internal states as editable refs.

### `store.getAllRefs()`
Returns all state values as read-only derived refs.

---

## Persisting Store State

You can persist your store's state to localStorage automatically by adding the `persist` option to your store configuration.

```javascript
// filepath: /home/atoms/programming/web/dominity-docs-v2/docs/state-management.md
...existing code...

## Store Persistence

### Basic Local Storage

```javascript
import { createStore, state } from "dominity";

export const todoStore = createStore("todos", {
  states: {
    todos: state([]),
    filter: state('all')
  },
  persist: true  // Enable automatic localStorage persistence
});
```

### Custom Persistence Options

> note
this feature is in beta and will not be rolled out till `v6.4.8`


You can configure how the store persists data:

```javascript
export const userStore = createStore("user", {
  states: {
    profile: state({}),
    settings: state({})
  },
  persist: {
    key: "app_user_data",     // Custom storage key
    include: ["settings"],     // Only persist specific states
    exclude: ["profile"],      // Exclude specific states
    storage: sessionStorage,   // Use different storage method
    serialize: JSON.stringify, // Custom serialization
    deserialize: JSON.parse    // Custom deserialization
  }
});
```

### Manual State Persistence

You can also manually control when to save and load state:

```javascript
// Save current state
todoStore.save();

// Load saved state
todoStore.load();

// Clear saved state
todoStore.clearSaved();
```

### Persistence Events

The store emits events during persistence operations:

```javascript
todoStore.on('beforeSave', (state) => {
  // Modify state before saving
  return state;
});

todoStore.on('afterLoad', (state) => {
  // Process loaded state
  return state;
});
```

> **Note:** Be cautious with sensitive data - localStorage is not secure storage. Use `persist: false` (default) for stores containing sensitive information.