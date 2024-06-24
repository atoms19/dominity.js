
//repeat 
/**
 * 
 * @param {function} cb - callback ie code to be repeated 
 * @param {number} limit -number of times to be repeated 
 * @param {number} jump -number of times to be skipped each time
 * @param {number} time -interval between each repeatation (in seconds)
 */
export default function repeat(cb,limit,jump=1,time=0.07) { 
    let count=0
    let interval=setInterval(()=>{
    if(count<=limit){
    cb()
    count+=jump
    }else{
      clearInterval(interval)
    }
    },time*1000)
  
  
  } 