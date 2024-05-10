
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
   