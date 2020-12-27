// pls dont copy this source code it is licensed and violating the terms and copying the code might get you sued 

class finder{
    constructor(el){
        this.elem=document.querySelector(el);
    }
    style(prp,val=""){
        if(val==""){
            return window.getComputedStyle(this.elem,null).getPropertyValue(prp);
        }else{
            this.elem.style[prp]=val
        }
    }
    attr(atr,val=null){
        if(val==null){
            return this.elem.getAttribute(atr);
        }else{
            this.elem.setAttribute(atr,val);
        }
    }
    removeAttr(atr){
        this.elem.removeAttribute(atr)
    }
    val(v=null){
        if(v==null){
            return this.elem.value
        }else{
            this.elem.value=v
        }
    }
    add(nod){
        this.elem.appendChild(nod)
    }
    remove(ind){
        this.elem.removeChild(this.elem.childNodes[ind])
    }
    child(){
        return this.elem
    }
    checkFor(ev,func){
        this.elem.addEventListener(ev,()=>{
            eval(func)
        })
    }
    html(code){
        this.elem.innerHTML=code;
    }
    txt(text){
        this.elem.textContent=text;
    }
    addClass(cls){
        this.elem.classList.add(cls)
    }
    removeClass(cls){
        this.elem.classList.remove(cls)
    }
    hide(){
        this.style("display","none");
    }
    show(){
        this.style("display","block");
    }
    box(w,h,c="transparent"){
        this.style("width",w)
        this.style("height",h)
        this.style("backgroundColor",c)
    }
    scrollTo(s=true){
        this.elem.scrollIntoView(s)
    }
    
}
//fuctions 

//timer
const timer=(cd,ti=1)=>{
    this.code=`()=>{${cd}}`
    setTimeout(eval(this.code),ti*1000)
};
//classmaker
const makeClass=(name,stuff)=>{
    this.class=document.createElement("style")
    this.stuff=`.${name}{${stuff}}`
    this.class.innerHTML=this.stuff
    document.body.appendChild(this.class)
}
//make elem
const create=(eli,id)=>{
    this.element=document.createElement(eli)
    this.element.setAttribute("id",id)
    document.body.appendChild(this.element)
    return new finder(`#${id}`)
}
//repeat
const repeat=(cd,limit,jump=1,ti=0.07)=>{
    this.cnt=1
    this.cntrl="this.cnt+="+jump
    this.code="()=>{"+cd+";if(this.cnt>="+limit+"){clearInterval(this.inter)}else{"+this.cntrl+"}}"
    this.inter=setInterval(eval(this.code),ti*1000);
}
//random
const random=(max,min=0)=>{
    if(Array.isArray(max)==true){
        return max[Math.round(Math.random()*(max.length-min))]
    }else{
        return Math.round(Math.random()*(max-min))
    }
    
}
