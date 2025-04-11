import { body } from "../../src/dominity";
import "./style.css";
import d from "dominity";

let attrs={
   crack:'he',
   babe:'nre',
   nexk:'rer'
   ,type:'eeeeeeeeeeeeeeeeeeeeeeeeeee',
   nexek:'rer'

}

function List({ count }) {
   const items = d.state(Array.from({ length: count }), (_, i) => i);
   let classRetriever=d.state(null)

   return d.ul().forEvery(items, (_, i) => d.li({ key: i ,...attrs}, `item ${i}`).$css(`
      $this{
         background:dodgerblue;
         color:white;
         padding:10px;
         margin:5px;
         border-radius:5px;
         cursor:pointer;
      }
      $this:hover{
         border:2px solid red;
         background:salmon;
      }
      `,classRetriever).animate({
         'opacity':[0,1]
      },1));
}

function UpdateTest() {
   const items = d.state(Array.from({ length: 10000 }), (_, i) => i);
   let time = d.state(null);

   function updateItem() {
      const start = performance.now();
      let copy = [...items.value];
      copy[5000] = 'updated'
      items.value = copy;
      requestAnimationFrame(() => {
         const end = performance.now();
         time.value = end - start;
      });
   }

   return d.div(
      d.h1("updation test"),
      d.button({ class: "btn" }, "update item 500").on("click", updateItem),
      d.p(() => `render time : ${time.value?.toFixed(2)} ms`),
      d.ul().forEvery(items, (s, i) => d.li(`item ${i} ${s}`),(s, i) => typeof s === 'object' ? s.__id : i)
   );
}

function InputTest() {
   let text = d.state("");
   let lastTime = d.state();

   function handleChange(e) {
      let start = performance.now();
      text.value = e.target.value;
      requestAnimationFrame(() => {
         const end = performance.now();
         lastTime.value = end - start;
      });
   }

   return d.div(
      d.h1("Input latency test"),
      d.input({ value: text.value, class: "inp" }).on("change", handleChange),
      d.p(() => `last input latency ${lastTime.value?.toFixed(2)} ms`)
   );
}

function RenderTest() {
   let time = d.state(null);

   d.effect(() => {
      const start = performance.now();
      requestAnimationFrame(() => {
         const end = performance.now();
         time.value = end - start;
      });
   });

   return d.div(
      d.h1("initial render test"),
      d.p(() => `render time : ${time.value?.toFixed(2)} ms`),
      List({ count: 10000 })
   );
}

let c = 0;

//InputTest().addTo(document.body);
//UpdateTest().addTo(document.body);
RenderTest().addTo(document.body);
let ins = d.state(["apple", "banana", "orange", "grape", "kiwi"]);
let fruits = d.state([
   {
      name: "apple",
      id: 1
   },
   {
      name: "banana",
      id: 2
   },
   {
      name: "orange",
      id: 3
   },
   {
      name: "grape",
      id: 4
   },
   {
      name: "kiwi",
      id: 5
   }
]);

let app = d
   .div(
      d.div([d.p("open console"), "pushing p ", d.h1("primary heading")]),
      d
         .input({ class: "inp", value: "hello world" })
         .on("change", (e) => console.log(e.target.value)),

      // d.ul(
      // ()=>ins.value.map(i=>d.li(i))
      // ),
      d.ul().forEvery(
         fruits,
         (i, c) =>
            d
               .li({ key: i.id }, i.name)
               .on("click", () => {
                  fruits.value = fruits.value.filter((t) => t.id != i.id);
                
               }),
         (fruit) => fruit?.id
      ),

      d.button({ class: "btn" }, "add item").on("click", () => {
         fruits.value = [
            ...fruits.value,
            {
               name: "new item",
               id: Math.random()
            }
         ];
      }),
      d.button("sort").on("click", () => {
         fruits.value = [...fruits.value.sort((a, b) => b.id - a.id)];
      }),
      d.button("insert element in between").on("click", () => {
         fruits.value = [
            ...fruits.value.slice(0, 2),
            {
               name: "new item",
               id: Math.random()
            },
            ...fruits.value.slice(2)
         ];
      })
   )
   .$css(`
      $this{
         background:lightblue;

      
      }
         $this:hover{
         background:lightseagreen;
         }
      
      
      
      `)
   
/**
 * <div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>
 
    <div x-show="open" x-transition>
        Hello 👋
    </div>
</div>
 */
let open =d.state(true)
d.div(
   d.button("toggle").on("click", () => {
      open.value = !open.value;
   }),
   open.value ? d.div(
      d.h1("hello world")
   ): ''
).addTo(document.body)