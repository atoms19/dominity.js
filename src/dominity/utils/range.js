
//range 
/**
 * returns a list of numbers or characters within a certain range
 * @param {number|string} s -starting of range
 * @param {number|string} e -ending of range 
 * @param {number} ingrement - skip of range
 * @returns {Array}
 */
function range(s,e,ingrement=1){ 
    let nums=[] 


    if(typeof s=="string" && typeof e=="string"){ 

    for(i=s.charCodeAt(0)-96;i<e.charCodeAt(0)-96+1;i+=ingrement){ 
        nums.push(i) 
    } 
        return nums.map((c)=>{ 
            return  String.fromCharCode(96+c) 
        }) 


    }else if(typeof s=="number" && typeof e=="number"){ 
    for(i=s;i<e+1;i+=ingrement){ 
        nums.push(i) 
    } 

    return nums 
    } 
} 

