
//copy function
/**
 * to copy text to users clipboard
 * @param {string} txt-string to be copied to clipboard
 * @param {function} thencb -function to be called after copy 
 */ 
export default function copy(txt,thencb){ 
              
    if(navigator.clipboard){
     navigator.clipboard.writeText(txt).then(thencb)
    }else{
      let input=create("input"); 
  
  
      input.value(txt) 
      input.elem.select(); 
      input.elem.setSelectionRange(0, 99999);  
      document.execCommand("copy"); 
      input.remove()
      thencb()
    }           
  } 
  