## Dominity js

[view js docs](https://atoms19.github.io/dominity.js/js%20docs-outdated)

[visit documentation site](https://dominity-docs.vercel.app)
### Introduction

Dominity is a simple and lightweight JavaScript library designed to help u write html like syntax in js to make reusable reactive componets

its reactive hence allows you to automatically update the elements contents when the state changes
its coupled with a client side router as well 
 

### usage
u can easily add dominity to your HTML file using a script tag or by our npm package

```html

<script src="https://cdn.jsdelivr.net/gh/atoms19/dominity.js@latest/dist/dominity.min.js"></script>
```
its minified size is tiny and wont impact your performance at all unlike other bulky frameworks 
so tiny infact its just little less than 5kib

### basics
dominity gives u functions that create HTML elements thats it 
```js
import D from "dominity"

D.div("hello world",{class:"text-primary",id:'title'})
D.p({class:'text-secondary'},`
lorem ipsum dolor sit amet lorem ipsum dolor sit amet 
lorem ipsum dolor sit amet 
lorem ipsum dolor sit amet 
`)

D.mount("body")
```
as can see from the above example the function named div creates a division and paragraph elements and mounts it to the body

objects with key value pairs passed in are considered attributes and strings are considered as text inside the element you can even pass in other `D.<tagname>` functions to create child elements

```js

D.ul(
 D.li(D.a('yo',{href:'#'})),
 D.li(D.a('yo',{href:'#'})),
 D.li(D.a('yo',{href:'#'})),
)

```
> they are arguments so dont foreget the commas 

#### Simplified Componentization

Dominity allows us to create componets with ease by encapsulating Dominity code in a function. This approach allows developers to create modular and maintainable code structures with ease, utilizing function parameters as component prop, a dominity componenet is any function that returns elements made with dominity

a simple button component 
```js
import D from "dominity"

function Button(text,color){
return D.button(text).css({
backgroundColor:color
})
}

Button('click me','blue').on('click',(e)=>{
  e.target.style.backgroundColor='lavander'
})
//here button changes color when u click it

D.h1(Button('click me','red'))

D.mount('body')


```

#### Nesting DOM Elements


```js
div(p("paragraph 1") ,p("paragraph"))
```


we recommend using intendation to make it look nice and legible
```js
import {div,p,button,img} from "dominity"

div(
  p('howdy'),
button('join us').on('click',joinAction),
 div(
   img({
       alt:'profile pic',
       src:'https://...'
     })
 )
)


```

#### Reactivity System

Dominity has a unique and simple reactivity system

```js
let opinion = state('good')

h1("you are so ",opinion) //you are so good

```

function `state()` is used to create any litteral that is reactive it can be a integer,float,string,an object an array whats so ever ,it returns an object whixh stores the actual value in the `.value`

it carries over to child element if its on parent element as well

in the above example whenever we change the value of opinion by assigning to `.value` property its change is reflected on the h1 tag

```js
opinion.value='bad'
```

given below is an example of a simple counter using dominity

```js
function Counter() {
  let count = state(0);

  rerurn div(
    p("count:",count),
    button("increment").on('click',() => {
      count.value=count.value+1;
    }),

    button('decrement').on('click',() => {
            count.value=count.value+1;
    }),
)
}
```

```js

let name=state('vishal')

let nameAsList=derived(()=>{
return Array.from(name.value)
})

```
each time name updates its derived one will also update 

### examples

#### a simple dropdown

```js
function Dropdown(op=false){
  let open=state(op)
  
  return div(
    button('dropdown button').on('click',()=>{
     open.value=!open.value
    })
    ,

    div('some very respectable dropdown content').showIf(open)
  )
 
}
```

`showIf()` only renders the element if the reactable passed into it is truthy
it hides otherwise

it can also take in a condition but it wont be dynamic unless it is a reactable 

#### filtering searchbar

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


### fully functional tasks app

```js
let taskname=reactable('')
let tasks=reactable(JSON.parse(localStorage.tasks))
el('form')
  ._el('fieldset','',{
    role:'group'
  }).
    _el('input',{
      type:'text'
      ,placeHolder:'enter task'
      ,id:'infield'
    }).modal(taskname).$end().
    _el('input','add task',{
      type:'submit'
    }).$end()
  .$end().
  checkFor('submit',(e)=>{
    e.preventDefault()
    if(taskname.value !=''){
      tasks.value.push({
        name:taskname.get(),
        done:false
      })
      tasks.update()
      $el('#infield').value('')
      
    }
  })
  
el('ul').loops(tasks,(obj,p)=>{
  p.
    _el('li').
      _el('input',{
        type:'checkbox',
       
      }).attr(obj.done?('checked'):'unchecked','').checkFor('input',()=>{
        obj.done=!obj.done
        tasks.setProp('done',obj.done)
        
      })
      
      .$end().
      _el('span',obj.name).style({
        marginRight:'2rem',
        textDecoration:obj.done?'line-through':'none'
      }).$end().
      _el('button','x').class('outline').onClick((s)=>{
 tasks.set(tasks.value.filter(ob=>{
   return ob!=obj
 }))

      })
    
})
  
tasks.subscribe(()=>{
   
 localStorage.tasks=JSON.stringify(tasks.value)
 
})

/*optional link to styleing cause it actually looks horrible without styling*/
el('link','',{
  href:'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css'
  ,rel:'stylesheet'
})


```
normally to make something like this it takes a lot of time and thinking but in dominity its all very simple `.subscribe()` method allows u to call a function when desired reactable is changed 



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

> you can still access orginal elements methods and props by using `<dominityElem>.elem.<orginal method>()`

