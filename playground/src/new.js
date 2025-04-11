import d from "dominity";

let taskname = d.state("");
let tasks = d.state([]);

function addTodo() {
   tasks.value = [...tasks.value, taskname.value];
}

d.div(
   d.h1("hello"),
   d.input().model(taskname),
   d.button("submit").on("click", addTodo),
   d.ul().forEvery(tasks, (task) =>
      d.li(
         task,
         d
            .button("x")
            .on(
               "click",
               () => (tasks.value = tasks.value.filter((t) => t != task))
            )
      )
   )
).addTo(document.body);