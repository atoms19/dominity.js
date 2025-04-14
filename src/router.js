import { state ,effect,untracked} from "./reactivity.js";
import { DominityElement } from "./dom.js";
export class DominityRouter {
   constructor() {
      this.routeMap = {};
      this.defaultPath = undefined;
   }
   /**
    * sets the routes
    * @param {object} routeMap 
    *
    *
    */
   setRoutes(routeMap = {}) {
      Object.keys(routeMap).forEach((key) => {
         let routeobj = {};
         let routeData = routeMap[key];
         routeobj.viewKey = state(false);
         if (routeMap[key].component instanceof DominityElement) {
            routeMap[key].component.showIf(routeobj.viewKey);
         }
         if (
            routeMap[key].getComponent != undefined &&
            typeof routeMap[key].getComponent == "function"
         ) {
            effect(async () => {
               if (routeobj.viewKey.value) {
                  let component = await untracked(
                     async () => await routeMap[key].getComponent(this)
                  );
                  if (routeMap[key].layout != undefined) {
                     component = routeMap[key].layout(component);
                  }
                  this.root.innerHTML=''
                  this.root.appendChild(
                     component.withRef((r) => {
                        effect(() => {
                           if (routeMap[key].onLoad != undefined) {
                              untracked(() => routeMap[key].onLoad(r));
                           }
                           if (this.onLoad != undefined) {
                              untracked(this.onLoad);
                           }
                        });
                     }).elem
                  );

               } 
            });
         }
         this.routeMap[key] = routeobj;
      });
   }
   /**
    * sets root of router , ie the element wheer router elements will be rendered
    * @param {HTMLElement|DominityElement} root -element to be passed in as root of router
    */
   start(root) {
      if (root instanceof DominityElement) {
         this.root = root.elem;
      } else {
         this.root = root;
      }
      addEventListener("popstate", () => {
         setTimeout(() => {
            this.assignRoute();
         }, 100);
      });
      addEventListener("load", async () => {
         setTimeout(() => {
            if (
               window.location.pathname == "/" ||
               window.location.pathname == this.defaultAltPath
            ) {
               this.routeTo(this.defaultPath);
            } else {
               this.assignRoute();
            }
         }, 200);
      });
      this.assignRoute();
   }

   async assignRoute() {
      Object.keys(this.routeMap).forEach((route) => {
         let routeData = this.routeMap[route];
         if (window.location.pathname == route) {
            routeData.viewKey.value = true;
         } else {
            routeData.viewKey.value = false;
         }
      });
   }
   /**
    * routes to a specific new route
    * @param {string} route -
    */
   routeTo(route) {
      history.pushState(null, "", route);
      this.assignRoute();
   }
   /**
    * replaces the current route with new route
    * @param {string} route
    */
   replaceRoute(route) {
      history.replaceState(null, "", route);
      this.assignRoute();
   }
   /**
    * reruns the route handler of current route
    */
   revalidateRoute() {
      history.go(0);
      this.assignRoute();
   }
   /**
    * a replacement for anchor tags that works with the router
    * @param {{href:string,replace:boolean,...attrs:any}} param0 - replace if true route is replaced instead of new redirect
    * @param  {...any} args -remaining components
    * @returns
    */
   Link({ href, replace, ...attrs }, ...args) {
      return el("a", { ...attrs }, ...args).on("click", (e) => {
         e.preventDefault();
         if (replace != null) {
            this.replaceRoute(e.target.getAttribute("href"));
         } else {
            this.routeTo(href);
         }
      });
   }
   /**gets all search queries as object */
   get queries() {
      return Object.fromEntries(
         new URLSearchParams(window.location.search).entries()
      );
   }
}

export function lazy(path) {
   return function (router) {
      const modules=import.meta.glob('./pages/*.js')
      return modules[path]().then((s) => s.default(router));
   };
}