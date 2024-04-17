## Dominity js

### Introduction

Dominity is a simple JavaScript library designed to help u write HTML like syntax in javascript  which makes logic integration and componentation way easier

it also has bunch of methods to do traditional tasks u do with js like removing an attribute or toggling a class firing an event etc faster and smoother

it even has reactive states allowing you to automatically update the elements contents when the state changes
making webdev carefree
 
#### target audience 
Dominity is made for small scale projects but there's no one stopping you from using it on your big projects  

Dominity doesn't have to replace HTML at all ,u can use it with HTML to add interactability and reactivity easily with less hassle 

### usage
u can easily add dominity to your HTML file using a script tag

```html

<script src="https://cdn.jsdelivr.net/gh/atoms19/src/dominityV6.min.js"></script>
```
its minified size is tiny and wont impact your performance at all unlike other bulky frameworks 


### basics

there are 2 styles to use Dominity

1) pure js style
2) html+js style


#### pure js style
 In this style of programming you'll not be touching the HTML file after u placed the `dominity.js` script tag in your head 

You'll be making all elements using dominity's `el()` function

`el(typ, txt = '', attrs = {})`: creates an element and attaches it to the body,
- 1st argument specifies the tagname
- 2nd argument text, its option it can be left as blank string '' 
- 3rd is argument accepts an object which takes in attributes of the tag as key value pairs

youllbe making child nodes by chaining `._el()` which takes the same set of formal argumants
any opened tag can be optionally closed by chaining `.$end()` 

see more on syntax section

#### html + js style

in this style of programming with Dominity you'll be using your HTML file and make a web page traditionally. you'll use dominity functions when you need to bring interactivity or reactivity to the element 
here Dominity operates similiar to JQuery a popular js library

- `$el(qry)`: Finds and returns a dominity DOM element matching the specified query.

- `$$el(qry)`: Finds and returns an array of dominity DOM elements matching the specified query.


dominity DOM elemnts are are objects that have special methods and props to make it easy to style ,add events ,change attributes etc list of all methods are given as a table in the end of documentation

Dominity DOM elements support chaining for all methods except for those meant to retrive data
Dominity DOM elements are capable of being stored in a variable like any other object


#### Simplified Componentization

Dominity allows us to create componets with ease by encapsulating Dominity code in a function. This approach allows developers to create modular and maintainable code structures with ease, utilizing function parameters as component prop

a simple button component 
```js

function Button(text,color='red'){
return el('button',text).style({
backgroundColor:color
})
//returning to allow further chaining
}

//addTo() is used to add the component where u want

Button('click me','blue').addTo($el('#h')).onClick((s)=>{
s.style({
backgroundColor:'red'
   })
})
//here button changes color when u click it

```

#### Chaining DOM Elements

Dominity enables chaining of DOM elements using `_el()` and `$end()` methods, allowing developers to efficiently construct complex DOM structures in a concise and readable manner.

```js
el('div')._el('p', "Paragraph 1").$end()._el('p', "Paragraph 2").$end();
```
once use  the `el()` or `$el()` you are allowed to chain methods to it n number of times , think of it as opening an HTML tag.
when u chain the `.$end()` it closes the tag according to analogy as long as u dont close it u can chain methods to modify, add events or style whatever

 you can create a child elemnt by chainig `._el()` which is same as `el()` but
 syntactically nicer 

we recommend using intendation to make it look nice and legible
```js
el('div').
  _el('p','howdy').$end().
  _el('button','join us').onClick(joinAction).$end()
  _el('div').
    _el('img','',{
      alt:'profile pic',
      src:'https://...'
    }).$end()
  .$end()
.$end()
```
now that you've opened a child tag using `._el()` now methods u chain to it will work on the child to go back to working with parent close the child by chainig `$end()`

in Dominity unlike HTML its not mandatory to close the tag at all if u dont want to go back to working with the parent element 

technically when u chain `$end()` its returning the parent instance back to u so u can continue working on the parent again 
so in above example last three `$end()` chain can be entirely omitted and it will still work

#### Reactivity System

Dominity has a unique reactive system which isn't complex ir capable as the ones in other ones but its a neat way to make your dominity elements react to data


```js
let opinion = reactable('good').as('op');

el("h1","you are so {{op}}").reactTo(opinion)

```

function `reactable()` is used to create any litteral that is reactive it can be a integer,float,string,an object an array whats so ever ,it returns an object whixh stores the actual value in the `.value`
property , you have to chain `.as()` to this to set up the name you'll be using in the text of elems

in elements text string you can use double moustaches to surround the name u gave to reactable with `as()` and make that element attached to the reactable by using `reactTo(<reactableobject>)` pass in reactable stored in variable

it carries over to child element if its on parent element as well

in the above example whenever we change the value of opinion by using `.set()` method its change is reflected on the h1 tag

```js
opinion.set('bad')
```

given below is an example of a simple counter using dominity

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


reactables can be derived from other reactables which allows one to depend on others value
```js

let name=reactable('vishal')

let nameAsList=reactable().deriveFrom(name,(value)=>{
return Array.from(value)
})

```
each time name updates its derived one will also update 

### examples

#### a simple dropdown

```js
function Dropdown(op=false){
  let open=reactable(op)
  
  return el('div').
    _el('button','dropdown button').onClick(()=>{
     open.set(!open.value)
    })
    .$end().
    _el('div','some very respectable dropdown content').showIf(open)
  
 
}
```

`showIf()` only renders the element if the reactable passed into it is truthy
it hides otherwise

it can also take in a condition but it wont be dynamic unless it is a reactable 

#### filtered searchbar

```js
function filterSearch(){
  let search=reactable('')
  let items=["potatoes","chicken","rice","bread"]
  
  let filteredItems=reactable().deriveFrom(search,(val)=>{
    return items.filter(i=>i.startsWith(val))
  })

  return el('div').
    _el('input','',{
      placeHolder:'search in filter'
      ,type:'search'
    }).modal(search)
    .$end().
    _el('ul').loops(filteredItems,(item,parent)=>{
        parent.
          _el('li',item)
      }).$end()
  
}

```
the above example uses a derived reactable using`.deriveFrom()` method of a reactable
to get a filtered list each time search value updates

an interesting method of dominity search element is `.modal()` which allows you to actively update a reactable whenever its value changes and vice versa 

here you can see the derived reactable filtered items is rendered as a list this is done by using `.loops()` method it accepts a reactable and a callback from the callback function you can access the value of each item in array and also the parent element for adding child elements







### Utility Functions
Dominity offers a few utility functions for common tasks, including copying text and generating random values.

- `copy(txt)`: Copies the specified text to the clipboard of user 

- `random(end, start = 0)`: Generates a random value within the specified range, it can also take just an array as argument and it will automatically chose a random element from that array

- `range(s, e, increment = 1)`: Generates an array of numbers within the specified range. it can also generate an array of alphabets 

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
| `enableHold(holdtime=0.5)` | Enables holding event on the element,you'll have to listen to this using checkFor.                                                         |
| `enableSwipe(swipeDistance=50)` | Enables swipe event on the element, use checkFor same as above.                                                         |

> you can still access orginal elements methods and props by using `<dominityElem>.elem.<orginal method>()`

