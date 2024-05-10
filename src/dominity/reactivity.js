//reactable 
/**
 * @class
 * a wrapper to hold reactive variables that can trigger subscribers
 * 
 */
export default class reactive{
    /**
     * any variable to be made reactive
     * @param {any} value 
     */
   constructor(value){
     this.value=value
     this.subscribers=[]
     this.name=''
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
    */
   subscribe(callback){
     this.subscribers.push(callback)
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
     if(reaction instanceof reactive){
       reaction.subscribe(()=>{
         this.set(callback(reaction.value))
       })
       reaction.update()
       return this
     }
     if(reaction instanceof Array){
        reaction.forEach((re)=>{
            re.subscribe(()=>{
                this.set(callback(re.value))
              })
              re.update()
  
        })
        return this
     }
  
   }
  /**
   * forces all subscribers to be called
   */
   update(){
     this.subscribers.forEach(callback=>{
       callback(this)
     })
   }
   
  
  }
  /**
   * creates and returns a new instance of reactive
   * @param {any} ini -value of the reactable
   * @returns {reactive} -reactive is returned
   */
 export function reactable(ini){
   return new reactive(ini)
  }
  
  