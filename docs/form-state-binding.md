

# .model() – Two-Way Data Binding

The `.model()` helper in Dominity connects an input field to a reactive `state` variable, enabling automatic synchronization between the DOM and your application's data layer.

It supports all standard form controls: text inputs, checkboxes, radios, textareas, and select elements.


## Basic Usage

```js
const username = state('')

input({ type: 'text', placeholder: 'Enter name' }).model(username)

p('Current: ', username)
```

As the user types into the input, the `username` state automatically updates, and the `p` element reflects the change.

---

## Binding Checkboxes

Checkboxes bind to boolean or array values depending on context.

```js
const isChecked = state(false)

input({ type: 'checkbox' }).model(isChecked)
p(() => isChecked.value ? 'Enabled' : 'Disabled')
```

---

## Binding Radio Buttons

For radio buttons, the value is synced with the selected radio.

```js
const choice = state('B')

div(
  label(
    input({ type: 'radio', name: 'level', value: 'A' }).model(choice),
    'A'
  ),
  label(
    input({ type: 'radio', name: 'level', value: 'B' }).model(choice),
    'B'
  )
)

p('Selected: ', choice)
```

---

## Binding Select Elements

You can bind dropdown selections just like any input:

```js
const lang = state('en')

select(
  option({ value: 'en' }, 'English'),
  option({ value: 'es' }, 'Spanish')
).model(lang)

p('Selected Language: ', lang)
```

---

## Use in Forms

You can use `.model()` to create fully reactive forms:

```js
const formState = {
  email: state(''),
  password: state('')
}

form(
  input({ type: 'email', placeholder: 'Email' }).model(formState.email),
  input({ type: 'password', placeholder: 'Password' }).model(formState.password),
  button({ type: 'submit' }, 'Submit')
).on('submit', e => {
  e.preventDefault()
  console.log(formState.email.value, formState.password.value)
})
```

---

## Behind the Scenes

The `.model()` method:

- Binds the element’s value or checked state to a `DominityReactive`
- Sets up an event listener (`input`, `change`) to keep state updated
- Reflects any state change back into the DOM

---

## Supported Inputs

| Type        | Behavior                         |
|-------------|----------------------------------|
| `text`      | Binds `.value`                   |
| `checkbox`  | Binds `.checked` (boolean)       |
| `radio`     | Binds `.value` based on selection|
| `textarea`  | Same as `text`                   |
| `select`    | Binds to selected option         |

---

## Summary

| Feature           | Description                                  |
|-------------------|----------------------------------------------|
| Two-way binding   | Sync DOM with reactive state and vice versa |
| Simple usage      | Chain `.model()` directly on form elements   |
| Reactive updates  | Any DOM or state change reflects automatically |
| Input-aware       | Adapts to different form field types         |

---

## Best Practices

- Use one `.model()` per reactive state
- Use `.on('submit')` to manually handle form actions
- Don’t mutate input DOM manually after binding
- Prefer single-responsibility: one state, one field


Here’s a **basic contact form** example using `.model()` with **validation**. We’ll keep it simple and reactive without bringing in Zod or external libs, focusing on how to build it within **Dominity**'s style:

---

### `contact-form-validation.js`

```js
const name = state('')
const email = state('')
const message = state('')

const errors = state({
  name: '',
  email: '',
  message: ''
})

function validate() {
  let valid = true
  const newErrors = { name: '', email: '', message: '' }

  if (!name.value.trim()) {
    newErrors.name = 'Name is required'
    valid = false
  }

  if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    newErrors.email = 'Enter a valid email'
    valid = false
  }

  if (message.value.trim().length < 10) {
    newErrors.message = 'Message must be at least 10 characters'
    valid = false
  }

  errors.value = newErrors
  return valid
}

form(
  div(
    label('Name'),
    input({ type: 'text', placeholder: 'Your Name' }).model(name),
    p(errors.value.name).showIf(() => errors.value.name !== '').css({ color: 'red' })
  ),

  div(
    label('Email'),
    input({ type: 'email', placeholder: 'Your Email' }).model(email),
    p(errors.value.email).showIf(() => errors.value.email !== '').css({ color: 'red' })
  ),

  div(
    label('Message'),
    textarea({ placeholder: 'Your Message' }).model(message),
    p(errors.value.message).showIf(() => errors.value.message !== '').css({ color: 'red' })
  ),

  button({ type: 'submit' }, 'Send Message')
)
.on('submit', e => {
  e.preventDefault()
  if (validate()) {
    console.log('Submit:', {
      name: name.value,
      email: email.value,
      message: message.value
    })
    alert('Form sent successfully.')
  }
})
```

---

### Features in this example:

- Uses `.model()` to bind inputs to state.
- Errors are stored in a reactive object `errors`.
- `showIf()` shows error messages conditionally.
- `validate()` checks all fields and updates error state.
- Form only submits if validation passes.
