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
import {p,div} from "dominity"

div("hello world",{class:"text-primary",id:'title'})
p({class:'text-secondary'},`
lorem ipsum dolor sit amet lorem ipsum dolor sit amet 
lorem ipsum dolor sit amet 
lorem ipsum dolor sit amet 
`)

```
as can see from the above example the function named div creates a division and paragraph elements and mounts it to the body

objects with key value pairs passed in are considered attributes and strings are considered as text inside the element you can even pass in other `D.<tagname>` functions to create child elements

```js

ul(
 li(a('yo',{href:'#'})),
 li(a('yo',{href:'#'})),
 li(a('yo',{href:'#'})),
)

```
> they are arguments so dont foreget the commas 

#### Simplified Componentization

Dominity allows us to create componets with ease by encapsulating Dominity code in a function. This approach allows developers to create modular and maintainable code structures with ease, utilizing function parameters as component prop, a dominity componenet is any function that returns elements made with dominity

a simple button component 
```js
import {button,h1} from "dominity"

function Button(text,color){
return button(text).css({
backgroundColor:color
})
}

Button('click me','blue').on('click',(e)=>{
  e.target.style.backgroundColor='lavander'
})
//here button changes color when u click it

h1(Button('click me','red'))


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

`showIf()` only renders the element if the state passed into it is truthy
it hides otherwise 

#### filtering searchbar

```js
function filterSearch(){
  let search=state('')
  let items=["potatoes","chicken","rice","bread"]
  
  let filteredItems=derived(()=>{
    return items.filter(i=>i.startsWith(search.value))
  })

return div(

input({placeholder:'search in filter',
type:'search'
}).model(search),

ul().forEvery(filterdItems,(item)=>{
return li(item)
})

)

  
  
}

```
the above example uses a derived state using`.derived()`

an interesting method of dominity search element is `.model()` which allows you to actively update a state whenever its value changes and vice versa 

here you can see the derived iterable state filtered items is rendered as a list this is done by using `.forEvery()` method it accepts a reactable and a callback from the callback function you can access the value of each item in array and element returned by the callback is added as child


### fully functional tasks app

```js
let taskname=state('')
let tasks=state(JSON.parse(localStorage.tasks))




form(
  fieldset({
    role:'group'
  },
    input({
      type:'text'
      ,placeHolder:'enter task'
      ,id:'infield'
    }).model(taskname),

    input('add task',{
      type:'submit'
    })
)
 .on('submit',(e)=>{
    e.preventDefault()
    if(taskname.value !=''){
      tasks.value=[...tasks.value,{
        name:taskname.get(),
        done:false
      }]
      
      document.querySelector('#infield').value=''
      
    }
  })
  
ul().forEvery(tasks,(obj)=>{
  
    return li(
      input({
        type:'checkbox',
        checked:obj.done?'true':'false'
       
      }).on('input',()=>{
        obj.done=!obj.done
        task.value.done=obj.done
        
      }),
      
      
      span(obj.name).css({
        marginRight:'2rem',
        textDecoration:obj.done?'line-through':'none'
      }),
      button('x',{class:'outline'}).on('click',(s)=>{
 tasks.value=[tasks.value.filter(ob=>{
   return ob!=obj
 })]

      })
    
)})
  
effect(()=>{
   
 localStorage.tasks=JSON.stringify(tasks.value)
 
})

/*optional link to styleing cause it actually looks horrible without styling*/
el('link','',{
  href:'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css'
  ,rel:'stylesheet'
})


```



> you can still access orginal elements methods and props by using `<dominityElem>.elem.<orginal method>()`

