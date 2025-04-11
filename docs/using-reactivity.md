# Working with State and Reactivity

Dominity uses a simple yet powerful reactivity system powered by signals. Unlike React's useState, states in Dominity aren't tied to components and can be shared across your application.

## Creating States

```javascript
import { state } from 'dominity'

// Create reactive states
const name = state('John')
const count = state(0)
const items = state(['apple', 'banana'])
```

## Reading and Writing State Values

```javascript
const count = state(0)

// Reading state value
console.log(count.value)  // outputs: 0

// Setting state value
count.value = 10  // updates state to 10
```

## Effects

Effects are functions that automatically re-run when their dependent states change:

```javascript
import { state, effect } from 'dominity'

const name = state('John')

effect(() => {
  console.log(`Name changed to: ${name.value}`)
})

name.value = 'Jane'  // Logs: "Name changed to: Jane"
```

### Cleanup Functions

```javascript
effect(() => {
  const interval = setInterval(() => {
    console.log(name.value)
  }, 1000)

  // Return cleanup function
  return () => clearInterval(interval)
})
```

## Derived States

Create states that depend on other states:

```javascript
import { state, derived } from 'dominity'

const count = state(0)
const doubledCount = derived(() => count.value * 2)

count.value = 5  // doubledCount automatically becomes 10
```

## Using States in Elements

### Method 1: Using Arrow Functions

```javascript
const count = state(0)

div(
  h1(() => `Count is: ${count.value}`),
  button('Increment')
    .on('click', () => count.value++)
)
```

### Method 2: Direct State Reference (Recommended)

```javascript
const count = state(0)

div(
  h1('Count is: ', count),  // Simpler syntax
  button('Increment')
    .on('click', () => count.value++)
)
```

## Practical Example

```javascript
import { state, effect } from 'dominity'

function Counter() {
  const count = state(0)
  const doubled = derived(() => count.value * 2)

  return div(
    h1('Counter Example'),
    p('Count: ', count),
    p('Doubled: ', doubled),
    button('Increment')
      .on('click', () => count.value++)
  )
}
```

## Best Practices

1. Initialize states at the top level of your modules
2. Use meaningful names for states
3. Keep state updates close to where they're defined
4. Use derived states instead of manual calculations
5. Prefer the direct state reference syntax for better readability