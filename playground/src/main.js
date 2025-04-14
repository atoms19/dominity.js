import d from "dominity"

console.log("working")

let content=d.state('')
function loadPage(url){

    d.effect(async()=>{
      let resp=await fetch(url,{
        headers:{
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json'
        }
    })
        let data=await resp.json()
        content.value=atob(data.content)
    })
}

function sideBar(){
    let sites=d.state([])
    
    d.effect(async ()=>{
       let resp=await fetch('https://api.github.com/repos/atoms19/dominity.js/contents/docs',{
        headers:{
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json'
        }
    })
        sites.value=await resp.json()
    })

    return d.div(
        d.ul().forEvery(sites,site=>d.li(site.name).on('click',()=>loadPage(site.url)))
    )
}

function App(){
    return d.div(
        sideBar(),
        content
    )
}

App().addTo(document.body)