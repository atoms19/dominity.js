## Dominity js

[View Docs](https://dominity.vercel.app)

[Read Handbook](https://dominity-docs.vercel.app)
### Introduction

Dominity is a simple and lightweight JavaScript library designed to help you write html like syntax in js to make reusable reactive components.

Its reactive hence allows you to automatically update the elements contents when the state changes.
Its coupled with a client side router as well. 
 

### Usage
You can start a new dominity project easily by importing straight from a cdn

```js
import D from "https://esm.sh/dominity@latest"
```
Its final bundle size is just around 6-7 Kb. 

## Adding to an Existing Project

You can add dominity to an existing project by installing it form npm and using it
```
npm i dominity@latest
```
```js
import {state} from "dominity"
```

## Using with Vite
To use with vite either create vanilla template and add the package manually or use this command to get a starter project setup. 
```
npx degit https://github.com/atoms19/dominity-vite-app
```
cd into the project directory and do `npm i` and `npm run dev` to start developing 

### Mission 
The syntax is very similiar to <a href="https://hyperscript.org/">Hyperscript</a> therefore there is no learning curve here, any function that returns this kinda hyperscript is viewed as a component , and calling the function and passing it as an argument creates compositioning of elements , theres reactivity sprinkled througout the project in the form of signals and helper methods to get things going


### Basics
Dominity gives u functions that create HTML elements that's it 
```js
import {p,div} from "dominity"

div("hello world",{class:"text-primary",id:'title'})

p({class:'text-secondary'},`
lorem ipsum dolor sit amet lorem ipsum dolor sit amet 
lorem ipsum dolor sit amet 
lorem ipsum do
`)

```
As can see from the above example the function named div creates a division and paragraph elements and mounts it to the body.

Objects with key value pairs passed in, are considered attributes and strings are considered as text inside the element, you can even pass in other hyperscript functions or components to create child elements

```js

ul(
 li(a('yo',{href:'#'})),
 li(a('yo',{href:'#'})),
 li(a('yo',{href:'#'})),
)

```
> they are arguments so dont foreget the commas 

#### Simplified Componentization

Dominity allows us to create components with ease by encapsulating Dominity code in a function. This approach allows developers to create modular and maintainable code structures with ease, utilizing function parameters as component prop, a dominity componenet is any function that returns elements made with dominity

A simple button component 
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


We recommend using intendation to make it look nice and legible
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

Function `state()` is used to create any litteral that is reactive it can be a integer,float,string,an object an array whats so ever ,it returns an object which stores the actual value in the `.value`

It carries over to child element if its on parent element as well.

In the above example whenever we change the value of opinion by assigning to `.value` property its change is reflected on the h1 tag.

```js
opinion.value='bad'
```

Given below is an example of a simple counter using dominity.

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
Each time name updates its derived value will also get updated automatically. 

### Examples

#### A simple Dropdown

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

`showIf()` only renders the element if the state passed into it is true.
It hides otherwise. 

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
The above example uses a derived state using`.derived()`.

An interesting method of dominity search element is `.model()` which allows you to actively update a state whenever its value changes and vice versa. 

Here you can see the derived iterable state filtered items is rendered as a list this is done by using `.forEvery()` method it accepts a reactable and a callback from the callback function you can access the value of each item in array and element returned by the callback is added as child.


### Fully functional tasks app

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

## Routing in dominity 

clientside routing is simpler than ever before with dominity's in built router 

```js

let r=new DominityRouter()
r.setRoutes({
"/home":{
component:homeComponent(),
isDefault:true //sets /home as default route on page load to /
},

"/marketing":{
component:marketingComponent()
},

"/about":{
component:aboutComponent()
}

})
r.start() //initialises the routing 
```


use `r.Link` ie <router>.Link({href:''},....) as instead of anchor tags to trigger client side routing instead of browsers routing 

use `r.getQueries` to get access to an object with all search queries passed in to the object

dominity aids u in every way possible to create a fully fledged single page application ,its also ideal for progressive web apps 

### using getComponents as routing mechanism 
in dominity there exists 2 ways to route one is the above , above is more ideal in a scenerio where all your components and router are in the same file 
in cases where your components and routes are in differernt files its better to use the api provided below again its very similiar just that u just pass in the function name instead of the whole function and use `getComponent` instead of `component`
and also provide a root while the router is starting 
```js
import homeComponent from ....
import marketingComponent form ...
import aboutComponent from ....

let r=new DominityRouter()
r.setRoutes({
"/home":{
getComponent:homeComponent,
isDefault:true //sets /home as default route on page load to /
},

"/marketing":{
getComponent:marketingComponent
},

"/about":{
getComponent:aboutComponent
}

})
r.start(document.body) //initialises the routing at document.body must for this method
```

each component would recive the router instance as the parameter automatically , and u wont have to import the router to get `r.Link`,`r.queries` etc 

```js

export default function homeComponent(r){
  return div(
      r.Link({href:'/about'},"about page")
  , r.Link({href:'/marketing'},"market page")
  ....
  )
}


```

