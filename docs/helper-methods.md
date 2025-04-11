# Helper Methods

Helper methods in Dominity are chainable utilities that extend element functionality and make DOM manipulation easier.

## Core Helper Methods

### `.on()` - Event Handling

Attaches event listeners to elements. Supports all standard DOM events.

```javascript
// Basic click handler
button('Click me')
  .on('click', () => console.log('Clicked!'))

// Multiple events on same element
input()
  .on('focus', () => console.log('Focused'))
  .on('blur', () => console.log('Blurred'))
  .on('input', (e) => console.log('Value:', e.target.value))

// Event with modifiers
button('Delete')
  .on('click', (e) => {
    e.preventDefault()
    if (confirm('Are you sure?')) {
      deleteItem()
    }
  })

// Using with states
const count = state(0)
button('Increment')
  .on('click', () => count.value++)

// Event delegation pattern
ul()
  .on('click', (e) => {
    if (e.target.matches('li')) {
      console.log('Clicked list item:', e.target.textContent)
    }
  })
```

Events are automatically cleaned up when the element is removed from the DOM, so you don't need to manually remove listeners.

### `.html()` - HTML Content

Sets raw HTML content within an element. Use with caution to avoid XSS vulnerabilities.

```javascript
// Adding SVG icon
button().html('<svg viewBox="0 0 20 20">...</svg>');

// Rich text formatting
p().html("Text with <strong>bold</strong> and <em>italic</em> content");

// Warning: Never use with untrusted content
div().html(userProvidedContent); // ❌ Unsafe
```

### `.attr()` - HTML Attributes

Sets or updates HTML attributes on an element.

```javascript
// Single attribute
input().attr("type", "email");

// Multiple attributes
img().attr({
   src: "/images/logo.png",
   alt: "Company Logo",
   width: "200",
   height: "100"
});



// Data attributes
div().attr({
   "data-id": "123",
   "data-type": "container"
});
```
### Reactive Attributes

The `.attr()` method also supports reactive values using functions and ternary operators:

```javascript
const isDisabled = state(false)
const theme = state('light')

button('Toggle')
  .attr({
    // Reactive disabled attribute
    disabled: () => isDisabled.value,
    
    // Reactive class using ternary
    class: () => theme.value === 'dark' ? 'dark-btn' : 'light-btn',
    
    // Reactive data attributes
    'data-state': () => isDisabled.value ? 'disabled' : 'enabled'
  })

// Attributes update automatically when states change
isDisabled.value = true  // Button becomes disabled
theme.value = 'dark'     // Button class updates
```

You can combine static and reactive attributes in the same `.attr()` call:

```javascript
input()
  .attr({
    type: 'text',                    // Static attribute
    disabled: () => isDisabled.value, // Reactive attribute
    placeholder: 'Enter text'         // Static attribute
  })
```

### `.addTo()` - DOM Insertion

Appends the element to a specified parent element., this method is also used to mount the app to the body of the document 

```javascript
// Add to document body
button("Click me").addTo(document.body);

// Add to specific container
const container = document.getElementById("app");
div("Content").addTo(container);

// Chain with other methods
div("Hello").css({ color: "blue" }).addTo(document.body);
```

### `.remove()` - DOM Removal

Removes the element from the DOM.

```javascript
const notification = div("Alert message").addTo(document.body);

// Remove after 3 seconds
setTimeout(() => {
   notification.remove();
}, 3000);
```

### `.giveRef()` - Element References

Binds the DOM element reference to a state for external access.

```javascript
const modalRef = state(null);
const inputRef = state(null);

function Modal() {
   return div(
      { class: "modal" },
      input().giveRef(inputRef),
      button("Close").giveRef(modalRef)
   );
}

// Access elements after mounting
effect(() => {
   if (modalRef.value) {
      // Focus input when modal is shown
      inputRef.value?.focus();

      // Add external event listener
      const handleEscape = (e) => {
         if (e.key === "Escape") modalRef.value?.click();
      };
      document.addEventListener("keydown", handleEscape);

      return () => document.removeEventListener("keydown", handleEscape);
   }
});
```

## Best Practices

1. **Use `.html()` sparingly** - Prefer creating elements directly for better security
2. **Chain methods** for cleaner code - Most helpers return the element for chaining
3. **Clean up references** - Remove event listeners and clear refs when elements are removed
4. **Use TypeScript** - Get better type safety and autocompletion for attributes
5. **Document refs** - Comment what refs are used for when sharing across components
