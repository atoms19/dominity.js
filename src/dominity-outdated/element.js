

/**
 * a wrapper for normal DOM elements with additional methods to make it reactive 
 * @class
 */

export default class DominityElement{ 
    /**
     * creates a new instance of  DOminityElement
     * @constructor
     * @param {string|HTMLElement} qry -query or HTMLELement to be converted to DominityInstance
     */
      constructor(qry){ 
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
    
    /**
     * used to set or get outterHTML (tag's own HTML+ whatever inside)
     * @param {string} [val]- outterHTML to be set
     * @returns {string|this}
     */
      code(val=null){ 
        if(val==null){ 
          return this.elem.outerHTML 
        }else{ 
          this.elem.outerHTML=val 
          return this 
        } 
      } 
    
      /**
     * used to attach textContent
     * @param {string} [val]- text to be added to the element
     * @returns {string|this}
     */
      addText(val=''){ 
        this.elem.textContent+=val 
        return this 
      } 
    
      /**
       * used to add to innerHTML of an element
       * @param {string} [val]- the html to be added
       * @returns {string|this}
       */
      addHtml(val=''){ 
        this.elem.innerHTML+=val 
        return this 
      } 
      
      /**
     * used to attach  outterHTML (tag's own HTML+ whatever inside)
     * @param {string} [val]- outterHTML to be added
     * @returns {string|this}
     */
      addCode(val=''){ 
        this.elem.outerHTML+=val 
        return this 
      } 
    
    
      //content placement 
    /**
     * allows to place HTML string at precise positions marked by numbers 1tag2 .... 3/tag4 
     * @param {string} placement -can be any of the four 'beforebegin|afterbegin|beforeend|afterend'
     * @param {string} code  -HTML to be inserted
     * @returns {this}
     */
      insertHtml(placement,code){ 
        this.elem.insertAdjacentHTML(placement,code) 
        return this 
        }
        /**
     * allows to place text at precise positions marked by numbers 1tag2 .... 3/tag4 
     * @param {string} placement -can be any of the four 'beforebegin|afterbegin|beforeend|afterend'
     * @param {string} txt  -text to be inserted
     * @returns {this}
     */
      insertTxt(placement,txt){ 
        this.elem.insertAdjacentText(placement,txt) 
        return this 
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
          let props=Object.keys(prp) 
          let values=Object.values(prp) 
          props.forEach((p,i)=>{ 
            this.style(p,values[i]+'') 
          }) 
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
       * used to check if an element has certain class
       * @param {...string} className- classes to be checked
       * @returns {boolean}
       */ 
      hasClass(cls) { 
        return this.elem.classList.contains(cls) 
      }
      /**
       * gets  classes from the classlist by its index
       * @param {number} index- index of className
       * @returns {string}
       */
      getClass(index = 0) { 
        return this.elem.classList.item(index) 
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
    //clickoutside event in development--------
     onClickOut(cb){
       document.addEventListener('click',(e)=>{
         if(e.target!==this.elem){
    
         }
       })
     }
     /**
      * enables the ability to listen for 'hold' events on the element
      * @param {number} [holdtime] -time delay for click and hold to be triggered
      * @returns {this}
      */
     enableHold(holdtime=0.5){
       this.isHolding=false
       const element=this
       function handleDOWN(e){
    
         this.isHolding=true
         this.timeout=setTimeout((e)=>{
    
           if(this.isHolding){
    
           element.causeEvent(new CustomEvent('hold',{details:e}))
           }
         },holdtime*1000)
    
       }
       function handleUP(e){
         this.isHolding=false
         clearTimeout(this.timeout)
       }
       this.checkFor('mousedown',handleDOWN)
       this.checkFor('touchstart',handleDOWN)
       this.checkFor('mouseup',handleUP)
       this.checkFor('touchend',handleUP)
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
        
        if(typeof txt=='object'){
        return this.create(typ).attr(txt)
        }else{
          return this.create(typ).text(txt).attr(attrs)
        }
      
    
      }
    
    /**
     * creates a child element 
     * @param {*} el 
     * @returns {DominityElement} -returned is an instance of child object to go back to working with parent chain `.$end()`
     */
     create(el){
       this.addedChild=create(el)
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
      * removes children to the element , multiple child elements can be removed seperated by comma 
      * @returns {this} 
      */   
      removeChild(){ 
        Array.from(arguments).forEach((nod)=>{ 
          this.elem.removeChild(this.elem.childNodes[nod]) 
        }) 
          return this 
      } 
    /**
     * 
     * @param {HTMLELement} child - child to be replaced
     * @param {HTMLElement} nod - new child
     * @returns {this}
     */
      replaceChild(child, nod) { 
        this.elem.replaceChild(nod, child) 
    
        return this 
      } 
    /**
     * finds a child by query 
     * @param {string} q- query to find child
     * @returns {DominityElement} -returns the child if found
     */
      getChild(q) { 
    
        return new DominityElement(this.elem.querySelector(q)) 
      }
      /**
       * gets all the children that matches the query
       * @param {string} q -query to find child 
       * @returns {array} -returns array of dominityelements
       */
      getChildren(q) { 
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
      firstParent(element='body'){
        let pn=''
        while(pn!=$el(element)){ 
          pn=this.elem.parentNode
    
        }
        return new DominityElement(pn)
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
     * clones the content of an element
     * @param {boolean} deep - if its deep or not
     * @returns {DominityElement} -returns the cloned content
     */
     cloneContent(deep=true){
       return new DominityElement(this.elem.content.cloneNode(deep))
     }
    
    /**
     * gives the closest element to this
     * @param {string} q-query to be matched 
     * @returns {DominityElement} -element discovered is returned
     */
     closest(q){ 
        return new DominityElement(this.elem.closest(q))    
     } 
    /**
     * checks if the element is contained as a child in this element
     * @param {HTMLELement|DominityElement} nod -child to be checked for
     * @returns {boolean} -truth or false
     */
     contains(nod){ 
       if(nod.dominityElem){ 
       return this.elem.contains(nod.elem) 
       }else{ 
            return this.elem.contains(nod) 
    
       } 
     } 
    /**
     * checks if the element matches a specific query or an element
     * @param {string} q- query to be matched 
     * @returns {boolean}
     */
     matches(q){ 
       if(typeof q=='string'){ 
         return this.elem.matches(q) 
       }else if(typeof q=='object'){ 
         if(q.dominityElem){ 
           return q===this 
         }else{ 
           return q===this.elem 
         } 
       } 
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
     showIf(bool){
       let elemS=this
       if(bool instanceof reactive){
    
         bool.subscribe((data)=>{
           elemS.showIf(data.value)
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
     * 
     * @param {reactive} list -any iterable reactable
     * @param {function} callback -function to be called on each iteration
     * @returns {this}
     */
     loops(list,callback){
       let elemS=this
       if(list instanceof reactive){
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
    
       if(target instanceof reactive){
       
         target.subscribe((d)=>{
            this.elem[attr]=d.value
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
            if(this.elem.checked){
              val=true
            }else{
              val=false
            }
          }
    
               target.set(val)
    
    
             })
       }else{
         this.attr(attr,target)
       this.checkFor('input',()=>{
    let val=attr=='checked'?this.elem.checked:this.value()
    
         target=(val)
       })
       }
    
    
    
       return this
     }
     //binder---indevelopment
     binder(attr,target){
      if(target instanceof reactive){
        target.subscribe((d)=>{
          this.attr(attr,d.value)
        })
        target.update()
      }
    
    
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
    /**
     * gets the scroll position and size of the element
     * @returns {object} 
     */
     getScrollInfo(){ 
       return { 
         height:this.elem.scrollHeight, 
         width:this.elem.scrollWidth, 
         x:this.elem.scrollLeft, 
         y:this.elem.scrollTop 
       } 
     } 
    
    /**
     * returns elements size
     * @returns {getBoundingClientRect}
     */
     getSizeInfo(){ 
       return this.elem.getBoundingClientRect() 
     } 
    /**
     * requests/cancels the element to be made fullscreen(cross browser compatible)
     * @param {boolean} val - if true to set an element to fullscreen ,false to make it normal 
     * @returns {this}
     */
     fullScreen(val = true) { 
       if (val == true) { 
         if (this.elem.requestFullScreen) { this.elem.requestFullScreen() } 
         else if (this.elem.webkitRequestFullscreen) { 
           this.elem.webkitRequestFullscreen() 
         } else if (this.elem.msRequestFullScreen) { 
           this.elem.msRequestFullscreen() 
         } 
    
       } else { 
         if (this.elem.exitFullScreen) { this.elem.exitFullScreen() } 
         else if (this.elem.webkitExitFullscreen) { 
           this.elem.webkitExitFullscreen() 
         } else if (this.elem.msExitFullScreen) { 
           this.elem.msExitFullscreen() 
         } 
       } 
    
       return this 
     } 
    
    
    } 
    
    
    class finderAll{ 
        constructor(qry){ 
           this.elemArr=[] 
            document.querySelectorAll(qry).forEach((e)=>{ 
                this.elemArr.push(new DominityElement(e)) 
            }) 
    
            return this.elemArr 
        } 
    }
    
    
    
    
    
    
