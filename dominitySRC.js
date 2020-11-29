class finder{
    constructor(el){
          this.elem=document.querySelector(el)     
    }
hide(){
    this.elem.style.display="none"
}
show(){
    this.elem.style.display="block"
}
txt(text){
    this.elem.textContent=text
}
html(code){
    this.elem.innerHTML=code
}
style(prp,val){
 this.elem.style[prp]=val
}
addClass(cls){
    this.elem.classList.add(cls)
}
removeClass(cls){
this.elem.classList.remove(cls)
}
val(t=""){
    
    
    if(t==""){
    return this.elem.value
    }else{
        this.elem.value=t
    }}
add(nod){
   this.elem.appendChild(nod) 
}        
child(){
    return this.elem
} 

    
}


//----------functions-----------

//timer
function timer(cd,ti=1000){
    this.code="()=>{"+cd+"}"
    setTimeout(eval(this.code),ti)
}
//making a class
function makeClass(name,stuf){
    this.classic=document.createElement("style")
   this.stuf="."+name+"{"+stuf+"}"
    this.classic.innerHTML=this.stuf
    
    document.body.appendChild(this.classic)
}
//making and appending
function create(eli,id){
    this.element=document.createElement(eli)
 
this.element.setAttribute("id",id)   
    document.body.appendChild(this.element)
    return new finder("#"+id)
}
