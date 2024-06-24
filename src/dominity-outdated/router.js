/**
 * @class
 * used for client side routing
 * 
 */
export default class DominityRouter{
    constructor(){
      this.path=this.getPath()
      this.defaultPath=''
      this.defaultFile='/index.html'
      this.routes=[]
     this.firstLoad=0
     this.backHandler=async () => {
       if (this.firstLoad && this.getPath()!=this.defaultFile) {
  
         await this.handleRoute()
  
       } else {
         this.replaceRoute(this.defaultPath)
         this.firstLoad = 1
  
       }
  
  
     }
  
  addEventListener('popstate',this.backHandler)
  
  addEventListener('load',
  this.backHandler)
    }
    /**
     * assigns an element to a specific route in the dominity router
     * @param {string} route- route path name 
     * @param {DominityElement} pageElement -component to be routed to 
     * @param {*} [callback] - a function callback after routing optional
     * @returns {this}
     */
    register(route,pageElement,callback=()=>{}){
      let config={
        route: route,
        elem: pageElement,
        callback: callback,
        routeKey: reactable(false)
      }
     this.routes.push(config)
      pageElement.showIf(config.routeKey)
      return this
    }
    getPath(){
      return window.location.pathname
    }
  
     async handleRoute(){
  
  let routeFound=0
      this.routes.forEach(routeObj=>{
  
        if(this.getPath()==routeObj.route){
         routeObj.routeKey.set(true)
         routeFound=1
        }else{
          routeObj.routeKey.set(false)
        }
        if(!routeFound){
  
        }
      })
      
  
    }
    /**
     * routes to a specific route
     * @param {string} route -routename to be routed to 
     */
    routeTo(route){
      history.pushState(null,'',route)
    
      this.handleRoute()
  
    }
    /**
     * replaces the current path with another 
     * @param {string} route -new path 
     */
    replaceRoute(route){
      history.replaceState(null,'',route)
      this.handleRoute()
    }
  
  }