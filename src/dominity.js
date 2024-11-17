import { computed, effect, Signal, signal,untracked } from "@preact/signals-core";

// signalsF.ts-------------------------------------the following code is for states keep scrolling without paying attention till u see a heart emoji---------------
  var state = signal;
  var derived = computed;
  var DominityReactive = Signal;


  function $el(qry,...args) {
    return el(new DominityElement(qry).elem,...args);
  }
  function $$el(qry) {
    let elemArr = [];
    document.querySelectorAll(qry).forEach((e) => {
      elemArr.push(new DominityElement(e));
    });
    return elemArr;
  }
  var el = function(tagname, ...args) {
    let elem = typeof tagname== typeof "string" ? document.createElement(tagname) : tagname;
    let dElem = new DominityElement(elem);
    args.forEach((arg, index) => {
      if (typeof arg == "string") {
        let textNode = document.createTextNode(arg);
        elem.appendChild(textNode);
      } else if (typeof arg == "function" && typeof arg() == "string") {
        let textNode = document.createTextNode(arg());
        effect(() => {
          textNode.data = arg();
        });
        elem.appendChild(textNode);
      } else if (arg instanceof DominityReactive) {
        let textNode = document.createTextNode(arg.value);
        elem.appendChild(textNode);
        effect(() => {
          textNode.data = arg.value;
        });
      } else if (arg instanceof DominityElement) {
        elem.appendChild(arg.elem);
      } else if (typeof arg == "object" || typeof arg == "function" && typeof arg() == "object") {
        dElem.attr(arg);
      } else if (arg instanceof Array) {
        arg.forEach((ar) => {
          if (ar instanceof DominityElement) {
            elem.appendChild(ar.elem);
          } else {
            throw new Error("Dominity Error: invalid element type passed in as array ,all elements of the array should be of type DominityElement");
          }
        });
      } else {
        throw new Error(`Dominity Error: invalid type ${typeof arg} passed in as argument to dominity builder function`);
      }
    });
    return dElem;
  };

/**
 * 
 * a wrapper around html elements that enables dominity to function 
 * 
 */
  export class DominityElement {

    /**
     * 
     * @param {string|HTMLElement} qry 
     * @returns {this}
     */
    constructor(qry) {
      if (typeof qry == "string") {
        this.elem = document.querySelector(qry);
      } else {
        this.elem = qry;
      }
      if (this.elem == null) {
        console.error(`DominityError: element of query '${qry}'  NOT  FOUND `);
        return false;
      }
    }
    /**
     * sets inner HTML
     * @param {null |string} val - html markup as string ,returns elements innerHTML if left empty 
     * @returns {this}
     */
    html(val) {
      if (val == null) {
        return this.elem.innerHTML;
      } else {
        if (typeof val == "function") {
          effect(() => {
            this.html(val());
          });
        } else {
          this.elem.innerHTML = val;
        }
        return this;
      }
    }
    /**
     * used to apply css styling to elements
     * @param {object|string} prp -pass in an object containing key value pairs of properties or a single string propertyname to be set or get
     * @param {undefined|stirng} val -if left empty the single string property computed value is returned else its set to the value passed in
     * @returns {this}
     */
    css(prp, val = undefined) {
      if (typeof prp == "string") {
        if (val == undefined) {
          return window.getComputedStyle(this.elem, null).getPropertyValue(prp);
        } else {
          this.elem.style[prp] = val;
          return this;
        }
      } else if (typeof prp == "object") {
        Object.assign(this.elem.style, prp);
        return this;
      } else if (typeof prp == "function") {
        effect(() => {
          this.css(prp());
        });
        return this;
      }
    }

    addClass(...classnames){

      this.elem.classList.add(...classnames)
      return this 

    }

    removeClass(...classnames){

      this.elem.classList.remove(...classnames)
      return this 

    }

    removeAttr(...attrs){
      this.elem.removeAttribute(...attrs)
      return this 
    }

    
    /**
     * applies a stylesheet to the element
     * @param {string} cssStringy -the css string, $this is replaced with a random class name
     * @returns {this}
     */
    $css(cssStringy,classRetriever){
      if(cssStringy instanceof DominityReactive) {
        this.elem.classList.add(cssStringy.value)
        return this 
      }
      let randomClassName='d-styler-'+Math.floor(Math.random()*1000+Date.now())
      let parsed=cssStringy.replaceAll('$this','.'+randomClassName)
      if(!document.querySelector('#dominity-style-injected')){
        let s=document.createElement("style")
        s.id="#dominity-style-injected"
        s.innerHTML+=parsed
        document.body.append(s)
      }else{
      document.querySelector("#dominity-style-injected").innerHTML+=parsed
      }
      this.elem.classList.add(randomClassName)
      
      if(classRetriever!=undefined && classRetriever instanceof DominityReactive){
        classRetriever.value=randomClassName
      }
      return this
    }
    /**
     * used to add attributes to an element
     * @param {object|string} prp -pass in an object containing key value pairs of attributes or a single string attributename to be set or get
     * @param {undefined|stirng} val -if left empty the single string atribute value is returned else its set to the value passed in
     * @returns {this}
     */
    attr(prp, val = undefined) {
      if (typeof prp == "string") {
        if (val == undefined) {
          return this.elem.getAttribute(prp);
        } else {
          this.elem.setAttribute(prp, val);
          return this;
        }
      } else if (typeof prp == "object") {
        let attrs = Object.keys(prp);
        let vals = Object.values(prp);
        attrs.forEach((p, i) => {
        if(vals[i] instanceof DominityReactive){
          effect(()=>{
            this.attr(p,vals[i].value)
          })
  
        }else if (typeof vals[i] != "function") {
              this.attr(p, vals[i]);
        } else if (typeof vals[i] == "function") {
            effect(() => {
              this.attr(p, vals[i]());
            });
          }
        });
        return this;
      }
    }


    

    /**
     * binds a state with a class
     * @param {DominityReactive} state  
     * @param {string} trueclass -classes to be added when state is true seperated by space
     * @param {string} falseclass -classes to be added when state is false seperated by space
     */
    bindClass(state,trueclass,falseclass){
      effect(()=>{
        if(state.value){
          this.elem.classList.add(...trueclass.split(' '))
          if(falseclass!=undefined){
            this.elem.classList.remove(...falseclass.split(' '))
          }
        }else{
          this.elem.classList.remove(...trueclass.split(' '))
          if(falseclass!=undefined){
            this.elem.classList.add(...falseclass.split(' '))
          }
        }
      })

      return this 

    }


    bindAttr(state,attr,value=''){
      effect(()=>{
        if(state.value){
          this.attr(attr,value)
          
        }else{
          this.removeAttr(attr)
        }
      })

      return this 

    }

    /**
     * used to attach events to an element
     * @param {string} e -event name
     * @param {Function} cb- function to be called  
     * @param {boolean} bub -event capture false by default
     * @returns {this}
     */
    on(e, cb, bub = false) {
      this.elem.addEventListener(e, cb, bub);
      return this;
    }
    /** removes the element from the dom */
    remove() {
      this.elem.remove();
      return this;
    }
    //css based rerenderer 
    /**
     * shows and hides the element based on truthineess of passed in state or return value of function that utilises a state
     * @param {DominityReactive|Function} expression -reactive state whos truth value affects the rendering  or function
     * @returns {this}
     */
    showIf(expression) {
      let storedDisplay = this.css("display") != "none" ? this.css("display") : "block";
      if (typeof expression == "function") {
        effect(() => {
          this.showIf(expression());
        });
        return this;
      } else if (expression instanceof DominityReactive) {
        effect(() => {
          this.showIf(expression.value);
        });
      } else if (expression) {
        this.elem.style.display = storedDisplay;
      } else {
        this.elem.style.display = "none";
      }
      return this;
    }
  //loop
  /**
   * iterates over a list and renders a component for each item
   * @param {DominityReactive} list-reactive state iterable who will be iterated 
   * @param {Function} callback the function must return a component or the function must be a component (this function recives (item , count,parent elements reference ))
   * @returns {this}
   */
    forEvery(list, callback) {
      let elemS = this;
      if (list instanceof DominityReactive) {
        effect(() => {
          elemS.elem.innerHTML = "";
          list.value.forEach((item, count) => {
           untracked(()=>{
            let c=callback(item, count,elemS)
            if(c){
              c.addTo(this.elem)
            }
          })
            
          });
        });
        return this;
      }
      console.error("DominityError: list item for .forEvery has to be a reactive object made with state() and iterable");
      return this;
    }
    /**
     * used to run a function with reference to element 
     * @param {Function} func a function that recives js refernce and dominity reference as first and second parameters 
     * @returns {this} 
     */
    withRef(func){
      func(this.elem,this)
      return this
    }
    /**
     * used to store the elements javascript/DOminity refernce to a state
     * @param {DominityReactive} ref 
     * @param {boolean} org if true js reference is returned else its dominity reference
     * @returns 
     */
    giveRef(ref,org=true){
      if(ref instanceof DominityReactive){
        ref.value=org?this.elem:this
      }else{
        ref=org?this.elem:this
      }
      return this
    }
  /**
   * used to model an input's value to a state (2 way databinding)
   * @param {DominityReactive} target state to be modeled to  
   * @param {{debounce?:number,throttle:?number}} options -options are used to set optional throttle and debounce values incase 
   * @returns 
   */
    model(target, options) {
      let attr = "value"; //todo radio groups doesnt work 
      if (this.attr("type") == "checkbox") {
        attr = "checked";
      }
      if (target instanceof DominityReactive) {
        if (options?.debounce == undefined && options?.throttle == undefined) {
          effect(() => {
            if (!(target.value instanceof Array)) {
              this.elem[attr] = target.value;
            } else {
              if (target.value.includes(this.elem.name)) {
                this.elem[attr] = true;
              } else {
                this.elem[attr] = false;
              }
            }
          });
        } else {
          this.elem[attr] = target.value;
        }
        let timeoutId;
        let lastcalltime = 0;
        this.on("input", () => {
          let val = this.elem.value;
          if (this.attr("type") == "number") {
            if (val == "") {
              val = "0";
            }
            val = parseFloat(val);
          }
          if (attr == "checked") {
            if (!(target.value instanceof Array)) {
              if (this.elem.checked) {
                val = true;
              } else {
                val = false;
              }
            } else {
              if (this.elem.checked) {
                val = [...target.value, this.elem.name];
              } else {
                val = target.value.filter((t) => t != this.elem.name);
              }
            }
          }
          if (options?.debounce == undefined && options?.throttle == undefined) {
            target.value = val;
          } else if (options?.debounce) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              target.value = val;
            }, options?.debounce);
          } else if (options?.throttle) {
            const now = new Date().getTime();
            if (now - lastcalltime < options?.throttle) {
              return;
            }
            lastcalltime = now;
            target.value = val;
          }
        });
      }
      return this;
    }
    /**
     * 
     * @param {object} props properties to be animated as an object and their final values 
     * @param {number} duration duration in milliseconds
     * @param {string} easing easing function 
     * @param {Function} callback -call back that runs after the animation ends 
     * @returns {this}
     */
    animate(props, duration, easing = "linear", callback = undefined) {
      let priorkeyframes = {};
      Object.keys(props).forEach((prop) => {
        if (props[prop] instanceof Array) {
          priorkeyframes[prop] = props[prop][0];
          props[prop] = props[prop][1];
        } else {
          priorkeyframes[prop] = this.css(prop);
        }
      });
      let animation = this.elem.animate([priorkeyframes, props], {
        duration: duration * 1000,
        easing,
        fill: "forwards"
      });
      animation.onfinish = () => {
        this.css(props);
        if (typeof callback === "function") {
          callback(this);
        }
      };
      return this;
    }
    /**
   * appends the element to another element provided 
   * @param {DominityElement|HTMLELement} elm -parent element to add to
   * @returns {this}
   */
    addTo(elm){ 
      if(elm instanceof DominityElement){ 
        elm.elem.appendChild(this.elem) 
      }else{ 
        elm.appendChild(this.elem) 
      } 
  
      return this 
    }
/**
 * returns nth children of the element 
 * @param {number} index 
 * @returns 
 */
  child(index){
      return new DominityElement(this.elem.children[index])
  }

  /**
     * extends the current dominity element with the provided object
     * @param {object} extension -an object containing methods and properties to be added to the current dominity element
     * @returns {this}
*/
extend(extension){
  Object.assign(this,extension)
  return this 
}
    
  }
  /**sets up a client side router to handle page views */
  export class DominityRouter {
    constructor() {
      this.routeMap = {};
      this.defaultPath = undefined;
    }
    /**
     * sets the routes
     * @param {object} routeMap
     * 
     * @example
     * 
     * ### using component directly
     * ```
     * {
     * "/home":{
     *    component:home()
     * }
     * ,"about":{...}
     * 
     * }
     * ```
     * 
     * ### using component as function 
     * ```
     * 
     * {
     *  "/home":{
     *     getComponent:home,
     *   onLoad(){
     *      console.log('home')
     *  },
     *  layout(component){
     *    return someLayout(component)
     *  }
     * }
     * 
     * }
     * ```
     *  
     */
    setRoutes(routeMap = {}){
      
      Object.keys(routeMap).forEach((key) => {
        let routeobj = {};
        let routeData = routeMap[key];
        routeobj.viewKey = state(routeData.isDefault != null && routeData.isDefault);
        if (routeData.isDefault != null && routeData.isDefault) {
          this.defaultPath = key;
        }
        if (routeMap[key].component instanceof DominityElement) {
          routeMap[key].component.showIf(routeobj.viewKey);
        }
        if (routeMap[key].getComponent !=undefined && typeof routeMap[key].getComponent == "function") {
          effect(async ()=>{
              if(routeobj.viewKey.value){
                let component=await untracked(async()=>await routeMap[key].getComponent(this))
                if(routeMap[key].layout!=undefined){
                  component=routeMap[key].layout(component)
                }
                this.root.appendChild(component.withRef((r)=>{
                  effect(()=>{routeMap[key].componentLoaded=r
                    if(routeMap[key].onLoad!=undefined){
                      untracked(()=>routeMap[key].onLoad(r))
                    }
                    if(this.onLoad!=undefined){
                      untracked(this.onLoad)
                    }
  
                  })
                }).elem)
              }else{
                if(routeMap[key].componentLoaded){
                 
                  routeMap[key].componentLoaded.remove()
                 
                }
                }
          })
        }
        this.routeMap[key] = routeobj;
      });
    }
    /**
     * sets root of router , ie the element wheer router elements will be rendered 
     * @param {HTMLElement|DominityElement} root -element to be passed in as root of router
     */
    start(root) {
      if(root instanceof DominityElement){
        this.root=root.elem
      }else{
      this.root=root
      }
      addEventListener("popstate", () => {
        setTimeout(() => {
          this.assignRoute();
        }, 100);
      });
      addEventListener("load", async () => {
        setTimeout(() => {
          if (window.location.pathname == "/" || window.location.pathname == this.defaultAltPath) {
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
    Link({href,replace,...attrs},...args) {
      return el("a",{...attrs}, ...args).on("click", (e) => {
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
      return Object.fromEntries(new URLSearchParams(window.location.search).entries());
    }
  }
  /**
   * loads components lazilly 
   * @param {stirng} path -path to component to be lazy loaded 
   * ###in setRoutes 
     * ```
     * 
     * {
     *  "/home":{
     *     getComponent:lazy('./home.js'),
     *   onLoad(){
     *      console.log('home')
     *  },
     *  layout(component){
     *    return someLayout(component)
     *  }
     * }
     * 
     * }
     * ```
   * @returns {this}
   */
  export function lazy(path){
    return function(router){
      return import(path).then((s)=>s.default(router))
    }
  
  }

class DominityStore{
  constructor (name,storeData){
    this._values={}
    Object.keys(storeData.states).forEach((key)=>{
      this._values[key]=state(storeData.states[key])
    })

    Object.keys(storeData.actions).forEach((key)=>{
      this[key]=()=>{
        storeData.actions[key](this._values,this)
      }
    })

    Object.keys(storeData.getters).forEach((key)=>{
        this[key]=derived(storeData.getters[key])
    })
    
  }

  getRef(ref){
    return derived(()=>this._values[ref].value)
  }
  getEditableRef(ref){
    let refer=derived(()=>this._values[ref].value)
    effect(()=>{
      this._values[ref].value=refer.value
    })
    return refer
  }

  getRefs(obj){
    if(obj && obj.edit) return this._values
    let refobj={}
    for (const key in this._values){
        refobj[key]=derived(()=>this._values[key].value)
    }
    return refobj
  }
 
    } 
  

  


function createStore(name,storeData){
    return new DominityStore(name,storeData)
}


  
  
  var htmlTags = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rb",
    "rp",
    "rt",
    "rtc",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "slot"
  ];
  var D = htmlTags.reduce((dobj, tag) => {
    dobj[tag] = (...args) => {
      let Delem = el(tag, ...args);
      dobj.root.appendChild(Delem.elem);
      return Delem;
    };
    return dobj;
  }, {
    root: document.body
  });
  

  
  
  
  
  export var {
    a,
    abbr,
    address,
    area,
    article,
    aside,
    audio,
    b,
    base,
    bdi,
    bdo,
    blockquote,
    body,
    br,
    button,
    canvas,
    caption,
    cite,
    code,
    col,
    colgroup,
    data,
    datalist,
    dd,
    del,
    details,
    dfn,
    dialog,
    div,
    dl,
    dt,
    em,
    embed,
    fieldset,
    figcaption,
    figure,
    footer,
    form,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    header,
    hr,
    html,
    i,
    iframe,
    img,
    input,
    ins,
    kbd,
    label,
    legend,
    li,
    link,
    main,
    map,
    mark,
    meta,
    meter,
    nav,
    noscript,
    object,
    ol,
    optgroup,
    option,
    output,
    p,
    param,
    picture,
    pre,
    progress,
    q,
    rb,
    rp,
    rt,
    rtc,
    s,
    samp,
    script,
    section,
    select,
    small,
    source,
    span,
    strong,
    style,
    sub,
    summary,
    sup,
    table,
    tbody,
    td,
    template,
    textarea,
    tfoot,
    th,
    thead,
    time,
    title,
    tr,
    u,
    ul,
    video,
    wbr,
    slot
  } = D;
  export {
    createStore,
    DominityStore,
    effect,
    derived,
    state,
    DominityReactive,
    $el,
    $$el,
    el
  };
  
  export default {...D,effect,createStore,derived,state,DominityReactive,$el,$$el,el,DominityRouter,DominityElement}