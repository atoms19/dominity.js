
//make elem 
/**create an element with dominity
 * @function 
 * @param {string} eli-element type to be created html tagname
 * @param {boolean} app -wether the a
 * @param {DominityElement|HTMLElement} target 
 * @returns {DominityElement}
 */
 export function create(eli,app=true,target=document.body) { 
    let element=document.createElement(eli) 
    if(app){ 
    target.appendChild(element) 
    } 
    return new DominityElement(element) 
} 
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
export function el(typ,txt='',attrs={},target=document.body){
 if(typeof txt=='object'){
 return create(typ,true,target).attr(txt)
 }else{
   return create(typ,true,target).text(txt).attr(attrs)
 }
}
