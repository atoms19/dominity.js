
export default class swipeDetector{
    constructor(elem){
        this.elem=elem
        this.elem.addEventListener('touchstart',this.start.bind(this))
        this.elem.addEventListener('touchmove', (e)=>{
            e.preventDefault() 
        }, false)
        this.elem.addEventListener('touchend',this.end.bind(this))
        this.allowedTime=300
        this.threshold=150
        this.restraint=125
         
    }

    start(e){
  y
    
    }

    end(e){
        this.endX=e.changedTouches[0].clientX
        this.endY=e.changedTouches[0].clientY
        this.endTime=Date.now()
        this.deltaT=this.endTime-this.startTime
        this.deltaX=this.endX-this.startX
        this.deltaY=this.endY-this.startY
        

        

        if( this.deltaT<=this.allowedTime){
            if(Math.abs(this.deltaX)>=this.threshold && Math.abs(this.deltaY)<=this.restraint){ 
                if(this.deltaX>0){
                    this.elem.dispatchEvent(new CustomEvent('swipeleft'))
                }else{
                this.elem.dispatchEvent(new CustomEvent('swiperight'))
                }
            }else if(Math.abs(this.deltaY)>=this.threshold && Math.abs(this.deltaX)<=this.restraint){
                if(this.deltaY>0){
                    this.elem.dispatchEvent(new CustomEvent('swipeup'))
                }else if(this.deltaY<0){
                    this.elem.dispatchEvent(new CustomEvent('swipedown'))
                }
            }  
            }

  
        }
}
let touch={
     enableSwipe({allowedTime, threshold,restraint}={}){
        
        this.elem.addEventListener('touchstart',this._start.bind(this))
        this.elem.addEventListener('touchmove', (e)=>{
            e.preventDefault() 
        }, false)
        this.elem.addEventListener('touchend',this._end.bind(this))
        this.allowedTime=allowedTime || 300
        this.threshold=threshold || 150
        this.restraint=restraint || 125

        return this
     }  ,  
     _start(e){ 
        this.startX=e.touches[0].clientX
        this.startY=e.touches[0].clientY
        this.startTime=Date.now()
     },
     _end(e){
        this.endX=e.changedTouches[0].clientX
        this.endY=e.changedTouches[0].clientY
        this.endTime=Date.now()
        this.deltaT=this.endTime-this.startTime
        this.deltaX=this.endX-this.startX
        this.deltaY=this.endY-this.startY
        if( this.deltaT<=this.allowedTime){
            if(Math.abs(this.deltaX)>=this.threshold && Math.abs(this.deltaY)<=this.restraint){ 
                if(this.deltaX>0){
                    this.elem.dispatchEvent(new CustomEvent('swiperight'))
                }else{
                this.elem.dispatchEvent(new CustomEvent('swipeleft'))
                }
            }else if(Math.abs(this.deltaY)>=this.threshold && Math.abs(this.deltaX)<=this.restraint){
                if(this.deltaY>0){
                    this.elem.dispatchEvent(new CustomEvent('swipeup'))
                }else if(this.deltaY<0){
                    this.elem.dispatchEvent(new CustomEvent('swipedown'))
                }
            }  
            }
        } ,
        _startHold(e){
  
       this.isHolding=true
       this.timeout=setTimeout((e)=>{
  
         if(this.isHolding){
         this.elem.dispatchEvent(new CustomEvent('hold',{details:e}))
         }
       },this.holdtime)
  
     
        },
        _endHold(e){

       this.isHolding=false
       clearTimeout(this.timeout)
        },
    enableHold({holdtime}={}){
     this.isHolding=false
     this.holdtime=holdtime||500
  
     this.elem.addEventListener('mousedown',this._startHold.bind(this))
     this.elem.addEventListener('touchstart',this._startHold.bind(this))
     this.elem.addEventListener('mouseup',this._endHold.bind(this))
     this.elem.addEventListener('touchend',this._endHold.bind(this))
     return this
   }





     }



import d from "dominity"
let app=()=>{

    return d.main(
        d.div("hello baby ").extend(touch)
    
        ,d.h1("hello baby ").enableHold({holdtime:500}).on("hold",(e)=>{
                e.target.innerHTML+="bak"
        })

        ,d.div("box of steel").$css(`
           $this{
            padding:5rem;
            background:dodgerblue;
            color:white;
            border-radius:1rem;
            width:100%;
            height:60vh;
           
           } 
            
            `).enableSwipe().on('swipeleft',(e)=>{

                e.target.innerHTML='swipe detected'

            })
    )
}

app().addTo(document.body)