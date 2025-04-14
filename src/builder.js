import { DominityElement } from "./dom.js";
import { DominityReactive ,effect} from "./reactivity.js";

/**
 *  dominity builder function
 * @param {string} tagname - name of the html tag to be created
 * @param  {...string|Function|object} args - arguments can be children elements or attributes or functions that return strings or objects
 *
 * @description
 * - if the argument passed in is string it is taken as textcontent and a textnode is created for it
 * - if the argument passed in is a funcion that returns string an effect is setup that rerenders text accordingly
 * - if the argument passed in is a reactive state a textnode is setup that rerenders according to state change
 * - if the argument passed in is a dominity element (another builder function) it is taken as a child element
 * - if the argument passed in is an object or a function that returns an object those are treated as attributes
 * - if the argument passed in is an array of dominity Elements those are treated as children elements
 * @returns {DominityElement}
 */
export const  el = function (tagname, ...args) {
   let elem =
      typeof tagname == typeof "string"
         ? document.createElement(tagname)
         : tagname;
   let dElem = new DominityElement(elem);

   //maps types to the pourpose they invoke
   let actionLookup = {
      string: (arg) => {
         elem.appendChild(document.createTextNode(arg));
      },
      object: (arg) => {
         if (arg instanceof DominityElement) {
            elem.appendChild(arg.elem);
         } else if (arg instanceof DominityReactive) {
            const textNode = document.createTextNode(arg.value);
            elem.appendChild(textNode);
            effect(() => {
               textNode.data = arg.value;
            });
         } else if (arg instanceof Array) {
            processArgs([...arg]);
         } else {
            dElem.attr(arg);
         }
      },
      function: (arg) => {
         const result = arg();
         if (typeof result == "string") {
            const textNode = document.createTextNode(result);
            elem.appendChild(textNode);
            effect(() => {
               textNode.data = arg();
            });
         } else if (typeof result == "object") {
            if (!result instanceof Array) dElem.attr(result);
         } else {
            throw new Error(
               `Dominity Error: invalid type ${typeof arg} passed in as argument to dominity builder function`
            );
         }
      }
   };

   const processArgs = (args) => {
      args.forEach((arg) => {
         let handler = actionLookup[typeof arg];
         if (handler) handler(arg);
         else
            throw new Error(
               `Dominity Error: invalid type ${typeof arg} passed in as argument to dominity builder function`
            );
      });
   };
   processArgs(args);

   return dElem;
};
