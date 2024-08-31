// signalsF.ts-------------------------------------the following code is for states keep scrolling without paying attention till u see a heart emoji---------------
var startBatch = function() {
    batchDepth++;
  };
  var endBatch = function() {
    if (batchDepth > 1) {
      batchDepth--;
      return;
    }
    let error;
    let hasError = false;
    while (batchedEffect !== undefined) {
      let effect = batchedEffect;
      batchedEffect = undefined;
      batchIteration++;
      while (effect !== undefined) {
        const next = effect._nextBatchedEffect;
        effect._nextBatchedEffect = undefined;
        effect._flags &= ~NOTIFIED;
        if (!(effect._flags & DISPOSED) && needsToRecompute(effect)) {
          try {
            effect._callback();
          } catch (err) {
            if (!hasError) {
              error = err;
              hasError = true;
            }
          }
        }
        effect = next;
      }
    }
    batchIteration = 0;
    batchDepth--;
    if (hasError) {
      throw error;
    }
  };
  var batch = function(fn) {
    if (batchDepth > 0) {
      return fn();
    }
    startBatch();
    try {
      return fn();
    } finally {
      endBatch();
    }
  };
  var untracked = function(fn) {
    const prevContext = evalContext;
    evalContext = undefined;
    try {
      return fn();
    } finally {
      evalContext = prevContext;
    }
  };
  var addDependency = function(signal) {
    if (evalContext === undefined) {
      return;
    }
    let node = signal._node;
    if (node === undefined || node._target !== evalContext) {
      node = {
        _version: 0,
        _source: signal,
        _prevSource: evalContext._sources,
        _nextSource: undefined,
        _target: evalContext,
        _prevTarget: undefined,
        _nextTarget: undefined,
        _rollbackNode: node
      };
      if (evalContext._sources !== undefined) {
        evalContext._sources._nextSource = node;
      }
      evalContext._sources = node;
      signal._node = node;
      if (evalContext._flags & TRACKING) {
        signal._subscribe(node);
      }
      return node;
    } else if (node._version === -1) {
      node._version = 0;
      if (node._nextSource !== undefined) {
        node._nextSource._prevSource = node._prevSource;
        if (node._prevSource !== undefined) {
          node._prevSource._nextSource = node._nextSource;
        }
        node._prevSource = evalContext._sources;
        node._nextSource = undefined;
        evalContext._sources._nextSource = node;
        evalContext._sources = node;
      }
      return node;
    }
    return;
  };
  var Signal = function(value) {
    this._value = value;
    this._version = 0;
    this._node = undefined;
    this._targets = undefined;
  };
  function signal(value) {
    return new Signal(value);
  }
  var needsToRecompute = function(target) {
    for (let node = target._sources;node !== undefined; node = node._nextSource) {
      if (node._source._version !== node._version || !node._source._refresh() || node._source._version !== node._version) {
        return true;
      }
    }
    return false;
  };
  var prepareSources = function(target) {
    for (let node = target._sources;node !== undefined; node = node._nextSource) {
      const rollbackNode = node._source._node;
      if (rollbackNode !== undefined) {
        node._rollbackNode = rollbackNode;
      }
      node._source._node = node;
      node._version = -1;
      if (node._nextSource === undefined) {
        target._sources = node;
        break;
      }
    }
  };
  var cleanupSources = function(target) {
    let node = target._sources;
    let head = undefined;
    while (node !== undefined) {
      const prev = node._prevSource;
      if (node._version === -1) {
        node._source._unsubscribe(node);
        if (prev !== undefined) {
          prev._nextSource = node._nextSource;
        }
        if (node._nextSource !== undefined) {
          node._nextSource._prevSource = prev;
        }
      } else {
        head = node;
      }
      node._source._node = node._rollbackNode;
      if (node._rollbackNode !== undefined) {
        node._rollbackNode = undefined;
      }
      node = prev;
    }
    target._sources = head;
  };
  var Computed = function(fn) {
    Signal.call(this, undefined);
    this._fn = fn;
    this._sources = undefined;
    this._globalVersion = globalVersion - 1;
    this._flags = OUTDATED;
  };
  var computed = function(fn) {
    return new Computed(fn);
  };
  var cleanupEffect = function(effect) {
    const cleanup = effect._cleanup;
    effect._cleanup = undefined;
    if (typeof cleanup === "function") {
      startBatch();
      const prevContext = evalContext;
      evalContext = undefined;
      try {
        cleanup();
      } catch (err) {
        effect._flags &= ~RUNNING;
        effect._flags |= DISPOSED;
        disposeEffect(effect);
        throw err;
      } finally {
        evalContext = prevContext;
        endBatch();
      }
    }
  };
  var disposeEffect = function(effect) {
    for (let node = effect._sources;node !== undefined; node = node._nextSource) {
      node._source._unsubscribe(node);
    }
    effect._fn = undefined;
    effect._sources = undefined;
    cleanupEffect(effect);
  };
  var endEffect = function(prevContext) {
    if (evalContext !== this) {
      throw new Error("Out-of-order effect");
    }
    cleanupSources(this);
    evalContext = prevContext;
    this._flags &= ~RUNNING;
    if (this._flags & DISPOSED) {
      disposeEffect(this);
    }
    endBatch();
  };
  var Effect = function(fn) {
    this._fn = fn;
    this._cleanup = undefined;
    this._sources = undefined;
    this._nextBatchedEffect = undefined;
    this._flags = TRACKING;
  };
  var effect = function(fn) {
    const effect2 = new Effect(fn);
    try {
      effect2._callback();
    } catch (err) {
      effect2._dispose();
      throw err;
    }
    return effect2._dispose.bind(effect2);
  };
  var BRAND_SYMBOL = Symbol.for("preact-signals");
  var RUNNING = 1 << 0;
  var NOTIFIED = 1 << 1;
  var OUTDATED = 1 << 2;
  var DISPOSED = 1 << 3;
  var HAS_ERROR = 1 << 4;
  var TRACKING = 1 << 5;
  var evalContext = undefined;
  var batchedEffect = undefined;
  var batchDepth = 0;
  var batchIteration = 0;
  var globalVersion = 0;
  Signal.prototype.brand = BRAND_SYMBOL;
  Signal.prototype._refresh = function() {
    return true;
  };
  Signal.prototype._subscribe = function(node) {
    if (this._targets !== node && node._prevTarget === undefined) {
      node._nextTarget = this._targets;
      if (this._targets !== undefined) {
        this._targets._prevTarget = node;
      }
      this._targets = node;
    }
  };
  Signal.prototype._unsubscribe = function(node) {
    if (this._targets !== undefined) {
      const prev = node._prevTarget;
      const next = node._nextTarget;
      if (prev !== undefined) {
        prev._nextTarget = next;
        node._prevTarget = undefined;
      }
      if (next !== undefined) {
        next._prevTarget = prev;
        node._nextTarget = undefined;
      }
      if (node === this._targets) {
        this._targets = next;
      }
    }
  };
  Signal.prototype.subscribe = function(fn) {
    return effect(() => {
      const value = this.value;
      const prevContext = evalContext;
      evalContext = undefined;
      try {
        fn(value);
      } finally {
        evalContext = prevContext;
      }
    });
  };
  Signal.prototype.valueOf = function() {
    return this.value;
  };
  Signal.prototype.toString = function() {
    return this.value + "";
  };
  Signal.prototype.toJSON = function() {
    return this.value;
  };
  Signal.prototype.peek = function() {
    const prevContext = evalContext;
    evalContext = undefined;
    try {
      return this.value;
    } finally {
      evalContext = prevContext;
    }
  };
  Object.defineProperty(Signal.prototype, "value", {
    get() {
      const node = addDependency(this);
      if (node !== undefined) {
        node._version = this._version;
      }
      return this._value;
    },
    set(value) {
      if (value !== this._value) {
        if (batchIteration > 100) {
          throw new Error("Cycle detected");
        }
        this._value = value;
        this._version++;
        globalVersion++;
        startBatch();
        try {
          for (let node = this._targets;node !== undefined; node = node._nextTarget) {
            node._target._notify();
          }
        } finally {
          endBatch();
        }
      }
    }
  });
  Computed.prototype = new Signal;
  Computed.prototype._refresh = function() {
    this._flags &= ~NOTIFIED;
    if (this._flags & RUNNING) {
      return false;
    }
    if ((this._flags & (OUTDATED | TRACKING)) === TRACKING) {
      return true;
    }
    this._flags &= ~OUTDATED;
    if (this._globalVersion === globalVersion) {
      return true;
    }
    this._globalVersion = globalVersion;
    this._flags |= RUNNING;
    if (this._version > 0 && !needsToRecompute(this)) {
      this._flags &= ~RUNNING;
      return true;
    }
    const prevContext = evalContext;
    try {
      prepareSources(this);
      evalContext = this;
      const value = this._fn();
      if (this._flags & HAS_ERROR || this._value !== value || this._version === 0) {
        this._value = value;
        this._flags &= ~HAS_ERROR;
        this._version++;
      }
    } catch (err) {
      this._value = err;
      this._flags |= HAS_ERROR;
      this._version++;
    }
    evalContext = prevContext;
    cleanupSources(this);
    this._flags &= ~RUNNING;
    return true;
  };
  Computed.prototype._subscribe = function(node) {
    if (this._targets === undefined) {
      this._flags |= OUTDATED | TRACKING;
      for (let node2 = this._sources;node2 !== undefined; node2 = node2._nextSource) {
        node2._source._subscribe(node2);
      }
    }
    Signal.prototype._subscribe.call(this, node);
  };
  Computed.prototype._unsubscribe = function(node) {
    if (this._targets !== undefined) {
      Signal.prototype._unsubscribe.call(this, node);
      if (this._targets === undefined) {
        this._flags &= ~TRACKING;
        for (let node2 = this._sources;node2 !== undefined; node2 = node2._nextSource) {
          node2._source._unsubscribe(node2);
        }
      }
    }
  };
  Computed.prototype._notify = function() {
    if (!(this._flags & NOTIFIED)) {
      this._flags |= OUTDATED | NOTIFIED;
      for (let node = this._targets;node !== undefined; node = node._nextTarget) {
        node._target._notify();
      }
    }
  };
  Object.defineProperty(Computed.prototype, "value", {
    get() {
      if (this._flags & RUNNING) {
        throw new Error("Cycle detected");
      }
      const node = addDependency(this);
      this._refresh();
      if (node !== undefined) {
        node._version = this._version;
      }
      if (this._flags & HAS_ERROR) {
        throw this._value;
      }
      return this._value;
    }
  });
  Effect.prototype._callback = function() {
    const finish = this._start();
    try {
      if (this._flags & DISPOSED)
        return;
      if (this._fn === undefined)
        return;
      const cleanup = this._fn();
      if (typeof cleanup === "function") {
        this._cleanup = cleanup;
      }
    } finally {
      finish();
    }
  };
  Effect.prototype._start = function() {
    if (this._flags & RUNNING) {
      throw new Error("Cycle detected");
    }
    this._flags |= RUNNING;
    this._flags &= ~DISPOSED;
    cleanupEffect(this);
    prepareSources(this);
    startBatch();
    const prevContext = evalContext;
    evalContext = this;
    return endEffect.bind(this, prevContext);
  };
  Effect.prototype._notify = function() {
    if (!(this._flags & NOTIFIED)) {
      this._flags |= NOTIFIED;
      this._nextBatchedEffect = batchedEffect;
      batchedEffect = this;
    }
  };
  Effect.prototype._dispose = function() {
    this._flags |= DISPOSED;
    if (!(this._flags & RUNNING)) {
      disposeEffect(this);
    }
  };
  // dominityF.ts
  function $el(qry) {
    return new DominityElement(qry);
  }
  function $$el(qry) {
    let elemArr = [];
    document.querySelectorAll(qry).forEach((e) => {
      elemArr.push(new DominityElement(e));
    });
    return elemArr;
  }
  var el = function(tagname, ...args) {
    let elem = document.createElement(tagname);
    let dElem = new DominityElement(elem);
    args.forEach((arg, index) => {
      if (typeof arg == "string") {
        let textNode = document.createTextNode(arg);
        elem.appendChild(textNode);
      } else if (typeof arg == "function" && typeof arg() == "string") {
        let textNode = document.createTextNode(arg());
        effect2(() => {
          textNode.data = arg();
        });
        elem.appendChild(textNode);
      } else if (arg instanceof DominityReactive) {
        let textNode = document.createTextNode(arg.value);
        elem.appendChild(textNode);
        effect2(() => {
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
  var effect2 = effect; //this is a bundler problem it gets renamed but in the final export its effect itself not effect2
  var state = signal;
  var derived = computed;
  var DominityReactive = Signal;
  //------------------------------------------💓💓💓💓💓💓💓 thanks for scrolling ------------------------------------------------


 
/**
 * 
 * a wrapper around html elements that enables dominity to function 
 * 
 */
  class DominityElement {

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
        return;
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
          effect2(() => {
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
        effect2(() => {
          this.css(prp());
        });
        return this;
      }
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
          effect2(()=>{
            this.attr(p,vals[i].value)
          })
  
        }else if (typeof vals[i] != "function") {
              this.attr(p, vals[i]);
        } else if (typeof vals[i] == "function") {
            effect2(() => {
              this.attr(p, vals[i]());
            });
          }
        });
        return this;
      }
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
        effect2(() => {
          this.showIf(expression());
        });
        return this;
      } else if (expression instanceof DominityReactive) {
        effect2(() => {
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
        effect2(() => {
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
          effect2(() => {
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
      if(elm.dominityElem){ 
        elm.addChild(this) 
      }else{ 
        elm.appendChild(this.elem) 
      } 
  
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
          effect2(async ()=>{
              if(routeobj.viewKey.value){
                let component=untracked(async()=>await routeMap[key].getComponent(this))
                if(routeMap[key].layout!=undefined){
                  component=routeMap[key].layout(component)
                }
                this.root.appendChild(component.withRef((r)=>{
                  effect2(()=>{routeMap[key].componentLoaded=r
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
    effect2 as effect,
    derived,
    state,
    DominityReactive,
    $el,
    $$el
  };
  
  export default {...D,effect:(f)=>effect2(f),derived,state,DominityReactive,$el,$$el,DominityRouter,}