import React,{useState,useEffect,useContext,useCallback,useRef} from 'react'
import {HomebaseCart} from '../components/homeCarts/homeBaseCart'
import {HomeLineCart} from '../components/homeCarts/homeLineCart'
import {EditModeContext} from '../context/EditMode'
import {DialogWindowContext} from '../components/dialogWindow/dialogWindowContext'
import {CartEditState} from '../components/homeCarts/EditCarts/CartEditState'
import {AddControlState} from '../components/homeCarts/AddControl/AddControlState'
import {AddControl} from '../components/homeCarts/AddControl/AddControl'
import {CartEdit} from '../components/homeCarts/EditCarts/CartEdit'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext.js'
import {ScriptContext} from '../context/ScriptContext.js'
import {Loader} from '../components/Loader'
import {MenuContext} from '../components/Menu/menuContext'

const cardsList = [
  {
    title:"base card",
    data:"base"
  },
  {
    title:"list card",
    data:"line"
  },
]

export const HomePage = () => {

const [editMode, setEditMode] = useState(false);
const [carts, setCarts] = useState([])
const [sortedCarts, setSortedCarts] = useState([])
const auth = useContext(AuthContext)
const {setData} = useContext(MenuContext)
const {show, hide} = useContext(DialogWindowContext)
const {message} = useMessage();
const {request, error, clearError} = useHttp();
const conteiner = useRef(null)
const [scripts, setScripts] = useState({})

function sort(array) {
  let arr = array.slice()
  for (var i = 0; i < arr.length; i++) {
    arr[i].index = i
  }
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if(arr[j].order>arr[j+1].order){
        [arr[j],arr[j+1]] = [arr[j+1],arr[j]]
      }
    }
  }
  return arr
}

const addCart = useCallback((type="base")=>{
  hide()
  setEditMode(true)
  let newCart = {
    mainId:null,
    id:carts.length+1,
    name:"",
    order:"0",
    type:type,
    children:[],
    width:2
  }
  setCarts((prev)=>{
    let mas = prev.slice();
    mas.push(newCart)
    return mas;
  })
},[hide, carts.length])

const removeCart = useCallback((index)=>{
  message("Удалить?", "dialog", ()=>{
    setCarts(prev=>prev.filter((item, index2)=>index2!==index))
  },"no")
},[message])

const updataCart = useCallback((index,cart)=>{
  setCarts(prev=>prev.map((item,index2)=>{
    if(index2 === index)
      return cart
    return item
  }))
},[])

const saveCarts = useCallback(()=>{
  try {
    console.log("save",carts);
    request('/api/homeCart/set', 'POST', {id:1,name:"page1",carts},{Authorization: `Bearer ${auth.token}`})
  } catch (e) {
    console.error(e);
  }
},[carts, auth.token,request])

const importCarts = useCallback(async()=>{
  try {
    const data = await request(`/api/homeCart/get/${"page1"}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data);
    setCarts(data.carts)
    const data2 = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setInterval(data2.updateFrequency)
    const data3 = await request(`/api/script/all`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    await setScripts(data3);
  } catch (e) {
    console.error(e);
  }
},[request,auth.token])

useEffect(()=>{
  message(error,"error")
  return ()=>{
    clearError();
  }
},[error,message, clearError])

useEffect(()=>{
  importCarts()
},[importCarts])

useEffect(()=>{
  console.log(carts);
  // request('/api/homeCart/set', 'POST', {id:1,name:"page1",carts},{Authorization: `Bearer ${auth.token}`})
},[carts])

useEffect(()=>{
  setData("Home",{
    dopmenu:[
      {
        title: (editMode)?"save":"config",
        active:()=>{
          if(editMode){
            saveCarts()
            setEditMode(false)
          }else{
            setEditMode(true)
          }
        }
      },{
        title: "add card",
        active: ()=>show("confirmation",{
          title:"Add card",
          items:cardsList,
          active: addCart
        })
      }
    ]
  })
},[setData,editMode, addCart, saveCarts,show])

const sortCard = useCallback((data,width)=>{
  let column = 3
  let i = 0
  if(width < 1300)
    column = 2
  if(width < 900){
    i=0
    column = 1
  }
  let arr = []
  for (var p = 0; p < column; p++) {
    arr.push([])
  }
  let sortdata = sort(data)
  for (var j = 0; j < sortdata.length; j++) {
    let item = sortdata[j]
    if(arr[i]){
      arr[i].push(item)
      i++
      if(i>=column)
        i=0
    }
  }
  setSortedCarts(arr)
},[])

useEffect(()=>{
  sortCard(carts,conteiner.current.clientWidth)
},[sortCard,carts])

useEffect(()=>{
  window.addEventListener("resize",resizeThrottler)
  var resizeTimeout;
  function resizeThrottler(event) {
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        sortCard(carts,event.target.innerWidth)
       }, 66);
    }
  }
  return ()=>{
    window.removeEventListener("resize", resizeThrottler);
  }
},[sortCard,carts])

if(carts===[]){
  return(
    <Loader/>
  )
}

  return(
    <EditModeContext.Provider value={{setMode:setEditMode, mode:editMode,add:addCart}}>
    <ScriptContext.Provider value={{scripts:scripts}}>
    <CartEditState>
    <AddControlState>
      <CartEdit/>
      <AddControl/>
      <div className = {`conteiner top bottom home`}>
        <div ref={conteiner} className = "conteinerHome flexHome">
        {
          sortedCarts.map((item,index)=>{
            return(
              <div key={index} className="home-column">
              {
                item.map((item2,index2)=>{
                  return(
                    <div className = "flexElement" key={index2} style={{order:item2.order}}>
                    {
                      (item2.type==="base")?
                      <HomebaseCart
                      edit={editMode}
                      hide={(i)=>removeCart(i)}
                      updata={updataCart}
                      index={item2.index}
                      data = {item2}
                      name={item2.name}
                      />:
                      (item2.type==="line")?
                      <HomeLineCart
                      edit={editMode}
                      hide={(i)=>removeCart(i)}
                      updata={updataCart}
                      index={item2.index}
                      data = {item2}
                      name={item2.name}
                      />
                      :null
                    }
                    </div>
                  )
                })
              }
              </div>
            )
          })
        }
        </div>
      </div>
    </AddControlState>
    </CartEditState>
    </ScriptContext.Provider>
    </EditModeContext.Provider>
  )
}
