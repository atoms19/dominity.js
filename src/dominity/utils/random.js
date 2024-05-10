//random 
/**
 * returns a random number within a range or returns a random element from an array if parameter is an array
 * @param {number|array} end ending value of range (if an array then its random element will be selescted)
 * @param {number} start -starting value 
 * @returns {number|any}
 */
export default function random(end,start=0){ 
    if(Array.isArray(end)){ 
        return end[Math.floor(Math.random()*(end.length-start))+start] 
    }else{ 
        return Math.floor(Math.random()*(end-start))+start 

    } 

} 