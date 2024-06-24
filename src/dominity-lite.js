/*Dominity.js
==================================================>
-DominityELement (create,el,_el,$el,$$el)
-Reactive   (reactable)
----------

*/


/**
 * a wrapper for normal DOM elements with additional methods to make it reactive 
 * @class
 */
class DominityElement{ 
    /**
     * creates a new instance of  DOminityElement
     * @constructor
     * @param {string|HTMLElement} qry -query or HTMLELement to be converted to DominityInstance
     */
      constructor (qry){ 
        if(typeof qry=='string'){ 
          this.elem=document.querySelector(qry)
          
        }else{ 
          this.elem=qry 
        } 
        if(this.elem==null){
          console.error(`DominityError: element of query '${qry}'  NOT  FOUND `)
          return
        }
        this.dominityElem=true
        this.tag=this.elem.tagName
        this.template=false //for later use to store content
        
      }
      
    /**
     * gets or sets the text content of element
     * @param {string} [val] -value can be left blank to get the current text inside the element
     * @returns {string|this} 
     */
      text(val=null){ 
        if(val==null){ 
          return this.elem.textContent 
    
        }else{
    if(!this.template){
      this.template=val //stores previous content
    }
          this.elem.textContent=val 
          return this 
        } 
      }
    
      /**
       * to make text of an element reactive to reactables
       * @param  {...reactive} s- reactables u want the content of this element to stay reactive to
       * @returns {this}
       */
      reactTo(...s){
    
          let template=this.html()
          
    
         s.forEach((r)=>{
          
        r.subscribe((t)=>{
          if(typeof t.value!='object'){
         this.text(template.replace(new RegExp('{{'+r.name+'}}','gi'),t.value))
         
          }else{
    
            Object.keys(t.value).forEach((k)=>{
              this.html(template.replace(new RegExp('{{'+r.name+'.'+k+'}}','gi'),t.value[k]))
              template=this.html()
            })
          }
    
        })
        r.update()
         })
    
       return this
      }
  
  
    
      /**
       * used to set or get the innerHTML of an element
       * @param {string} [val]- the innerHTML to be set
       * @returns {string|this}
       */
      html(val=null){ 
        if(val==null){ 
          return this.elem.innerHTML 
        }else{ 
          this.elem.innerHTML=val 
          return this 
        } 
      } 
    
    
     
    //css styling  
    /**
     * allows u to get or set CSS properties
     * @param {string|object} prp -property value to be get or set 
     * @param {string} [val] - value to set the prop
     * 
     * you can provide an object with multiple prop value pairs to bulk set style 
     * @returns {string|this}
     */
      style(prp,val=null){ 
        if(typeof prp=='string'){ 
          if(val==null){ 
            return window.getComputedStyle(this.elem,null).getPropertyValue(prp) 
          }else{ 
            this.elem.style[prp]=val 
            return this 
          } 
        }else if(typeof prp=='object'){ 
          Object.assign(this.elem.style,prp)
          return this 
        } 
      } 
    
      //class manipulation 
      /**used to set classes to an element
       * @param {...string} className- classes to be set on the element
       * @returns {this}
       */
      class(){ 
        Array.from(arguments).forEach((c)=>{ 
          this.elem.classList.add(c) 
        }) 
        return this 
      } 
      /**
       * used to remove classes from an element
       * @param {...string} className- classes to be removed
       * @returns {this}
       */
      removeClass() { 
        Array.from(arguments).forEach((c) => { 
          this.elem.classList.remove(c) 
        }) 
        return this 
      } 
      /**
       * used to toggle classes from an element
       * @param {...string} className- classes to be toggled
       * @returns {this}
       */
      toggleClass() { 
        Array.from(arguments).forEach((c) => { 
          this.elem.classList.toggle(c) 
        }) 
        return this 
      }
      /**
       * used to conditionally toggle a class
       * 
       */
      bindClass(react,classname,swap='',byprocess=(v)=>v){
        if(react instanceof DominityReactive){
          react.subscribe((v)=>{
            this.bindClass(byprocess(v.value),classname)
          })
        }else{
          if(react){
            this.class(classname)
            if(swap!=''){
              if(this.hasClass(swap)) this.removeClass(swap)
              
            }
            }else{
              this.removeClass(classname)
              if(swap!='') this.class(swap)
            }
        }
        return this
      }
  
      /**
       * used to check if an element has certain class
       * @param {...string} className- classes to be checked
       * @returns {boolean}
       */ 
      hasClass(cls) { 
        return this.elem.classList.contains(cls) 
      }
  
    
      //attribute manipulation 
      /**
     * allows u to get or set attributes of an element
     * @param {string|object} prp -attribute value to be get or set 
     * @param {string} [val] - value to set the attribute to 
     * you can provide an object with multiple attribute value pairs to bulk set attributes
     * @returns {string|this}
     */
      attr(prp,val=null){ 
        if(typeof prp=='string'){ 
          if(val==null){ 
            return this.elem.getAttribute(prp) 
          }else{ 
            this.elem.setAttribute(prp,val) 
            return this 
          } 
        }else if(typeof prp=='object'){ 
          let attrs=Object.keys(prp) 
          let vals=Object.values(prp) 
          attrs.forEach((p,i)=>{ 
            this.attr(p,vals[i]) 
          }) 
          return this 
        } 
      }
      /**
       * used to check if an element has certain attribute
       * @param {...string} attributeName- attribute to be checked
       * @returns {boolean}
       */ 
      hasAttr(val=null){ 
        if(val!=null){ 
       return this.elem.hasAttribute(val) 
        }else if(val==null){ 
          return this.elem.hasAttributes() 
        } 
      }
      /**
       * used to remove attbutes from an element
       * @param {...string} attributes-attributes to be removed
       * @returns {this}
       */
      removeAttr(){ 
        Array.from(arguments).forEach((at)=>{ 
          this.elem.removeAttribute(at) 
        }) 
      }
      /**
       * used to toggle attribute of an element
       * @param {string} atr- attribute to be toggled
       * @param {string} [val]- value of attribute to be toggled
       * @returns {this}
       */
      toggleAttr(atr,val=""){ 
        if(this.hasAttr(atr)){ 
          this.removeAttr(atr) 
        }else{ 
          this.attr(atr,val) 
        } 
        return this 
      } 
     
    
      //value and input methods------------------- 
      /**
       * used to set or get value of an input element
       * @param {any} val 
       * @returns {any}
       */
      value(val=null){ 
        if(val==null){ 
          return this.elem.value 
        }else{ 
          this.elem.value=val 
        } 
      } 
    
    
      //events manipulation---------------------------
      /**
       * checks for an event and adds an event listener
       * @param {string} e- eventname to be checked 
       * @param {function} cb -callback function
       * @param {boolean} bub -event bubling 
       * @returns {this}
       */ 
      checkFor(e,cb,bub){
        this.elem.addEventListener(e,cb,bub) 
        return this 
      }
      /**
       * stops listening for an event
       * @param {Event} ev -event
       * @param {function} func -function  
       * @param {boolean} bub -bubling
       * @returns {this}
       */
      stopCheckFor(ev, func, bub) { 
        this.elem.removeEventListener(ev, func, bub) 
        return this 
      } 
      /**
       * triggers a new event
       * @param {any} ev -event to be dispatched
       * @returns {this}
       */
      causeEvent(ev) { 
        this.elem.dispatchEvent(ev) 
    
        return this 
      }
      /**
       * triggers a custom event directly
       * @param {string} name -name of the event
       * @param {object} data -to be sent with the event
       */
      causeCustomEvent(name,data={}){
        this.causeEvent(new CustomEvent(name,{
          detail:data
        }))
        return this
      }
  
  
      /**
       * checks for click events
       * @param {function} cb -call back function
       * @returns {this}
       */
     onClick(cb){
       this.checkFor('click',(e)=>{
         cb(this,e)
       })
       return this
     }
     
     
      //dom manipulation{this} 
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
    /**
     * inserts this element to another element at a certin position
     * @param {DominityElement|HTMLELement} elm-parent element to add to
     * @param {string} placement -positon from beforebegin,afterbegin,beforeend,afterend etc
     * @see `insertHtml()`
     * @returns {this}
     */
      insertTo(elm,placement){ 
             if(elm!=null){ 
            if(elm.dominityElem){ 
                elm.insertChild(placement,this.elem) 
            }else{ 
                elm.insertAdjacentElement(placement,this.elem) 
            } 
        }} 
    /**
     * removes the element from the DOM tree
     * @returns {this}
     */
      remove(){ 
        this.elem.remove() 
        return this 
      } 
    /**
     * creates a child element and addes it
     * @param {string} typ -valid html tagname of element
     * @param {string|object} txt-text inside the child element (if element doesnt have any text u can give an object of attribute here) 
     * @param {object} attrs -objects with attribute value pairs 
     * @returns {DominityElement}
     * @see -`el()`
     * returned element is the created child so now u are working with this child to go back to working with parent chain `.$end()`
     */ 
      _el(typ,txt='',attrs={}){
        
        
          let created=(!typ.dominityElem)?this.create(typ):typ
          if(!typ.dominityElem) this.addChild(created)
  
          if(typeof txt=='object'){
            created.attr(txt)
          }
          else{
            created.text(txt).attr(attrs)
          }
  
  
            return created
            
    
      }
    
    /**
     * creates a child element 
     * @param {*} el 
     * @returns {DominityElement} -returned is an instance of child object to go back to working with parent chain `.$end()`
     */
     create(elem){
       this.addedChild=el(elem)
       this.addChild(this.addedChild)
       return this.addedChild
     }
     /**
      * adds children to the element , multiple child elements can be added seperated by comma 
      * @param {...DominityElement} 
      * @returns {this}
      */
      addChild(){ 
        Array.from(arguments).forEach((child)=>{ 
    
          if(child.dominityElem){ 
            this.elem.appendChild(child.elem) 
          }else{ 
            this.elem.appendChild(child) 
          } 
    
        }) 
    
        return this 
      }
      /**
      * inserts children to the element 
      * @param {string} placement -specifies position to be placed
      * @param {HTMLElement} nod -element to be placed
      * @returns {this} 
      */
      insertChild(placement, nod) { 
        this.elem.insertAdjacentElement(placement, nod) 
        return this 
      }
    

    /**
     * finds a child by query 
     * @param {string} q- query to find child
     * @returns {DominityElement} -returns the child if found
     */
      $_el(q) { 
    
        return new DominityElement(this.elem.querySelector(q)) 
      }
      /**
       * gets all the children that matches the query
       * @param {string} q -query to find child 
       * @returns {array} -returns array of dominityelements
       */
      $$_el(q) { 
        return Array.from(this.elem.querySelectorAll(q)).map(x => new DominityElement(x)) 
      } 
    /**
     * gets child of element by index
     * @param {index} pos 
     * @returns {DominityElement} -returns the child
     */
      child(pos){ 
        return new DominityElement(this.elem.children[pos]) 
      } 
    /**
     * @see `$end()`
     * @returns {DominityElement} - returns the parent element
     */
      parent() { 
      
        return new DominityElement(this.elem.parentNode)     
    
      }
      //indevelopment
      root(element='body'){
        let pn=this
        while(!pn.matches(element+' > *')){ 
          pn=pn.parent()
          
        }
        return pn
      }
      /**
       * returns the parent instance
       *
       * @returns {DominityElement} -returns parent so u can go back to working with parent element
       */
      $end(){
        
        return this.parent()
      }
    
    /**
     * returns the next element in the tree
     * @returns {DominityElement} 
     */
      next(){ 
          return new DominityElement(this.elem.nextElementSibling) 
      } 
    /**
     * returns the previous element in the tree
     * @returns {DominityElement} 
     */
      previous (){ 
          return new DominityElement(this.elem.previousElementSibling) 
      } 
    /**
     * clones an element
     * @param {boolean} deep -if true a deep clone is created
     * @returns {DominityElement} -clone is returned
     */
     clone(deep = true) {
       return new DominityElement(this.elem.cloneNode(deep))
     }
  
     /**
      * creates a component instance from contnet of template tag
      */
     asComponent(){
      return this.cloneContent(new DominityElement(this.elem.content.cloneNode(true)))
     }
  
    
    
     //appearance 
     /**
      * hides an element using CSS
      * @returns {this}
      */
     hide() { 
       this.style("display", "none"); 
       return this 
     } 
     /**
      * shows the element hidden using hide()
      * @param {string} [disp] -display property u want the element to be displayed  
      * @returns {this}
      */
     show(disp = "block") { 
       this.style("display", disp); 
       return this 
     }
     /**
      * toggles hide and show
      * @param {function} [ondisp] -callback to be called when displayed
      * @param {function} [onhide] -callback to be called when hidden
      * @returns {this}
      */
     toggleHide(ondisp, onhide) { 
       if (this.style("display") == "none") { 
         this.show() 
         if (ondisp != undefined) { 
           ondisp(this) 
         } 
       } else if (this.style("display") != "none") { 
         this.hide() 
         if (onhide != undefined) { 
           onhide(this) 
         } 
       } 
    
       return this 
      }
      
    
    
    /**
     * allows to show or hide an element depending on a reactable
     * @param {reactive|boolean} bool - expression or reactable 
     * @returns {this}
     */
    showIf(bool,byprocess){
      let elemS=this
      if(bool instanceof DominityReactive){
  
        bool.subscribe((data)=>{
         let condition=data.value
         if(byprocess){
           condition=byprocess(data.value)
         }
          elemS.showIf(condition)
        })
        bool.update()
  
        return this
      }
  
      if(bool){
        this.show()
      }else{
        this.hide()
      }
      return this
  
    }
    /**
      * renderIf
      */
    renderIf(bool,byprocess,parent=$el('body')){
      let elemS=this
     this.storedParent=parent
     
      if(bool instanceof DominityReactive){
  
        bool.subscribe((data)=>{
         let condition=data.value
         if(byprocess){
           condition=byprocess(data.value)
         }
          elemS.renderIf(condition)
        })  
        bool.update()
  
        return this
      }
  
      if(bool){
        this.storedParent.addChild(this)
      }else{
        this.remove()
      }
      return this
  
    }
  
  
    /**
     * 
     * @param {reactive} list -any iterable reactable
     * @param {function} callback -function to be called on each iteration
     * @returns {this}
     */
     loops(list,callback){
       let elemS=this
       if(list instanceof DominityReactive){
         list.subscribe((data)=>{
           elemS.html('')
           data.value.forEach((item,count)=>{
             callback(item,elemS,count)
           })
         })
         list.update()
         return this
       }
       console.error('DominityError: list item for ._elFor has to be a reactive object made with reactable(')
       return this
     }
    /**
     * for inputs/select allows to 2 way bind value to a reactable
     * @param {reactive|any} target 
     * @returns {this}
     */
     model(target){
    let attr='value'
    if(this.attr('type')=='checkbox'){
      attr='checked'
    }
    
       if(target instanceof DominityReactive){
       
         target.subscribe((d)=>{
          if(!(d.value instanceof Array)){
            this.elem[attr]=d.value
          }else{
            if(d.value.includes(this.elem.name)){
              this.elem[attr]=true
            }else{
              this.elem[attr]=false
            }
          
          }
         })
         target.update()
             this.checkFor('input', () => {
         let val=this.value()
           if(this.attr('type')=='number'){
            if(val==''){
              val='0'
            }
            
             val=parseFloat(val)
    
           }
           if(attr=='checked'){
           if(!(target.value instanceof Array)){
            if(this.elem.checked){
              val=true
            }else{
              val=false
            }
          }else{
            
          if(this.elem.checked){
            val=[...target.value,this.elem.name]
            
  
          }else{
  
            val=target.value.filter((t)=>t!=this.elem.name)
          }
          }
  
  
          }
    
               target.set(val)
  
             })
       }
    
    
    
       return this
     }
  
     /**
      * allows u to attach a function that operates on the element when reactive value updates
      * @param {DominityReactive} target 
      * @param {function} func 
      * @returns {DominityElement}
      */
     binder(target,func,autocall=false){
      if(target instanceof DominityReactive){
        target.subscribe((d)=>{
                    func(this,d.value)
        },autocall)
        
      }
    
    return this
     }
  
    
  
  
     /**
      * animate elements with animate method
      * @param {object} props 
      * @param {number} duration 
      * @param {string} [easing='linear'] 
      * @param {function} callback - function to run aftere the animation
      */
    animate(props,duration,easing='linear',callback){
      let priorkeyframes={}
      Object.keys(props).forEach((prop)=>{
        if(props[prop] instanceof Array){
          priorkeyframes[prop]=props[prop][0]
          props[prop]=props[prop][1]
        }else{
          priorkeyframes[prop]=this.style(prop)
        }
      })
  
      let animation=this.elem.animate([priorkeyframes,props],{
        duration:duration*1000,
        easing:easing,
        fill:"forwards"
      })
      animation.onfinish=()=>{
        this.style(props)
        if (typeof callback === 'function') {
          callback(this);
      }
      }
  
  
  
    return this
  
    }
    
    
    
     //actions
     /**
      * focus or blurs an element depending on val true or not
      * @param {boolean} val -if true focuses else blurs
      * @returns {this}
      */
     focus(val = true) { 
       if (val == true) { 
         this.elem.focus() 
       } else if (val == false) { 
         this.elem.blur() 
       } 
       return this 
     } 
    /**
     * clicks an element
     * @returns {this}
     */
     click(){ 
       this.elem.click() 
    
       return this 
     } 
    /**
     * scrolls to the element
     * @param {boolean|object} [s]- options/scroll 
     * @see[scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
     * @returns {this}
     */
     scrollTo(s = true) { 
       this.elem.scrollIntoView(s) 
       return this 
     } 
    
    } 
    
  
  
    //fuctions-------------------------
    
    
    //el
    /**
     * creates a new element
     * @param {string} typ -valid html tagname of element
     * @param {string|object} txt-text inside the child element (if element doesnt have any text u can give an object of attribute here) 
     * @param {object} attrs -objects with attribute value pairs 
     * @param {HTMLElement} -target to be appended to (defaults to body)
     * @returns {DominityElement}
     * @see -`el()`
     * returned element is the created child so now u are working with this child to go back to working with parent chain `.$end()`
     */
    function el(typ,txt='',attrs={},target=document.body){
      let element=document.createElement(typ) 
      target.appendChild(element) 
      let delement= new DominityElement(element)
    if(typeof txt=='object'){
     delement.attr(txt)
    }else{
       delement.text(txt).attr(attrs)
    }
    return delement
    }
    
    //find 
    /**
     * finds and return the element that matches the query
     * @param {string} qry -query to be matched
     * @returns {DominityElement}
     */
    function $el(qry){
     return new DominityElement(qry)
    }
    /**
     * finds and returns all elements that match the query
     * @param {string} qry -query to be matched
     * @returns {DominityElement[]}
     */
    function $$el(qry){
      let elemArr=[] 
      document.querySelectorAll(qry).forEach((e)=>{ 
          elemArr.push(new DominityElement(e)) 
      }) 
    
      return elemArr 
    }
    
    
    
  
    //reactable 
    /**
     * @class
     * a wrapper to hold reactive variables that can trigger subscribers
     * 
     */
    class DominityReactive{
      /**
       * any variable to be made reactive
       * @param {any} value 
       */
     constructor(value){
       this.value=value
       this.subscribers=[]
       this.name=''
       this.linkLess=[]
     }
     /**
      * this is the name to be used inside `{{}}` when paired with `reactTo()`
      * @param {string} na 
      * @returns {this}
      */
     as(na){
       this.name=na
    
       return this
     }
     /**
      * allows u to add subscriber functions , these functions are triggered whenever the value of reactable is updated
      * @param {function} callback 
      * @param {boolean} autocall - to self update or not
      */
     subscribe(callback,autocall='true',isLinked=false,){
       this.subscribers.push(callback)
      if(!isLinked){
        this.linkLess.push(callback)
      }
      if(autocall){
       callback(this)
      }
     }
     /**
      * allows you to get rid of a subscriber function
      * @param {function} callback -function to be removed
      */
     unsubscribe(callback){
       this.subscribers.pop(subscribers.indexOf(callback))
     }
     /**
      * used to set/update the value of the reactable
      * @param {any} newval 
      */
     set(newval){
       this.value=newval
       this.update()
     }
     /**
      * returns the value of reactable same as `reactable.value`
      * @param {string} [prop] -property of main reactable to be gotten
      * @returns {any}
      */
     get(prop=''){
       if(prop!=''){
       return this.value[prop]
       }else{
         return this.value
       }
     }
     /**
      * sets a property of an object reactable
      * @param {string} prop -property to be set 
      * @param {any} val -value to be set 
      */
     setProp(prop,val){
       this.value[prop]=val
       this.update()
     }
  
    
    
     /**
      * makes the reactable's vlaue dependant on other reactables
      * @param {reactive} reaction -whichever reactable u want it to be dependant on
      * @param {function} callback -this function is used to modify the dependancy ,u can run a process on dependant reactables value and the return of that is treated as the value of this reactable
      * @returns {this}
      */
     deriveFrom(reaction,callback){
       if(reaction instanceof DominityReactive){
         reaction.subscribe(()=>{
           this.set(callback(reaction.value))
         })
         
         return this
       }
       if(reaction instanceof Array){
          reaction.forEach((re)=>{
              re.subscribe(()=>{
                  this.set(callback(re.value))
                })
              
    
          })
          return this
       }
    
     }
     link(parent,parentrelation,selfrelation){
      parent.subscribe(()=>{
        this.linkMsg(selfrelation(parent.value))
      },true)
       let parentLink=(v)=>{
        parent.linkMsg(parentrelation(v.value))
      }
      this.subscribe(parentLink,false,true)
      
      return this
      
     }
     linkMsg(v){
      this.value=v
      this.update('linkLess')
     }
  
  
  
    /**
     * forces all subscribers to be called
     */
     update(updater='subscribers'){
       this[updater].forEach(callback=>{
         callback(this)
       })
     }
     
    
    }
    /**
     * creates and returns a new instance of reactive
     * @param {any} ini -value of the reactable
     * @returns {reactive} -reactive is returned
     */
    function reactable(ini){
     return new DominityReactive(ini)
    }
    
  