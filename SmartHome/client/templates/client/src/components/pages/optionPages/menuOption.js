import React,{useContext,useEffect,useState,useCallback} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {UserContext} from '../../../context/UserContext'
import {ModalWindow} from '../../modalWindow/modalWindow'
import {Loader} from '../../Loader'
import {MenuComponent} from './menuOptionComponents/component'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const MenuOption = () =>{
  const auth = useContext(AuthContext)
  const config = useContext(UserContext)

  const {message} = useMessage();
  const [visible,setVisible] = useState(false)
  const {loading, request, error, clearError} = useHttp();
  const [useBlock,setUseBlock] = useState([])
  const [noUseBlock,setNoUseBlock] = useState([])
  const [paragraphs] = useState([
    {title:"Scripts",iconClass:"fas fa-code-branch",url:"/scripts"},
    {title:"Nas",iconClass:"fas fa-hdd",url:"/nas"},
    // {title:"Files",iconClass:"fas fa-file",url:"/files/gallery"},
    {title:"Gallery",iconClass:"fas fa-images",url:"/gallery"},
    {title:"Terminal",iconClass:"fas fa-terminal",url:"/terminal"},
    {title:"Сhart",iconClass:"fas fa-chart-area",url:"/chart"},
    {title:"Rooms",iconClass:"fab fa-buromobelexperte",url:"/rooms"},
  ])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const configHandler = async(event)=>{
    await request(`/api/user/menu`, 'PUT', useBlock,{Authorization: `Bearer ${auth.token}`})
    setTimeout(function () {
      config.updateBackground()
    }, 200);
  }

  const updataConf = useCallback(async()=>{
    if(!config||!config.MenuElements)return;
    let newarr = paragraphs
    let newarr2 = config.MenuElements
    for (var item of config.MenuElements) {
      let y = item
      newarr = newarr.filter((item2)=>item2.title!==y.title)
    }
    setNoUseBlock(newarr)
    setUseBlock(newarr2)
  },[config,paragraphs])

  useEffect(()=>{
  },[config,useBlock])

  useEffect(()=>{
    updataConf()
  },[updataConf])

  const addParagraph = (title,icon,url)=>{
    let usearr = useBlock
    let nousearr = noUseBlock
    usearr.push({title,iconClass:icon,url})
    nousearr = nousearr.filter((item)=>item.title!==title)
    setNoUseBlock(nousearr)
    setUseBlock(usearr)
  }

  const deleteParagraph = (title,icon,url)=>{
    let usearr = useBlock
    let nousearr = noUseBlock
    for (var item of paragraphs) {
      if(item.title === title){
        nousearr.push({title,iconClass:icon,url})
        usearr = usearr.filter((item)=>item.title!==title)
        setNoUseBlock(nousearr)
        setUseBlock(usearr)
        return
      }
    }
    usearr = usearr.filter((item)=>item.title!==title)
    setUseBlock(usearr)
  }

  const addlink=()=>{
    let title = document.getElementById('titlelink')
    let icon = document.getElementById('titleicon')
    let url = document.getElementById('titleurl')
    addParagraph(title.value,icon.value,url.value)
    setVisible(false)
  }

  if(loading){
    return <Loader/>
  }

  return(
    <>
    {
      (visible)?
      <ModalWindow hide={()=>setVisible(false)} title="add" zindex={6}>
        <input id="titlelink" type = "text" name = "title"/>
        <input id="titleicon" type = "text" name = "icon"/>
        <input id="titleurl" type = "text" name = "url"/>
        <input type = "button" value="сохранить" onClick={addlink}/>
      </ModalWindow>
      :null
    }
    <div className = "pagecontent">
      <div className="configElement">
        <MenuComponent name="Home" icon="fas fa-home" def={true}/>
        <MenuComponent name="Devices" icon="fas fa-plug" def={true}/>
        <MenuComponent name="Profile" icon="fas fa-user-circle" def={true}/>
        <MenuComponent name="Option" icon="fas fa-cog" def={true}/>
        {
          useBlock.map((item,index)=>{
            return(
              <MenuComponent key={index} name={item.title} url={item.url} icon={item.iconClass} onClick={deleteParagraph} use={true}/>
            )
          })
        }
        <div className="menu-component-paragraph" onClick={()=>setVisible(true)}>
          <p>Создать ссылку</p>
          <div className="menu-component-btn">
            <i className="fas fa-plus-circle" style={{color:"#aaa"}}></i>
          </div>
        </div>
        <br/><hr/><br/>
        {
          noUseBlock.map((item,index)=>{
            return(
              <MenuComponent key={index} name={item.title} url={item.url} onClick={addParagraph} icon={item.iconClass}/>
            )
          })
        }
      </div>
      <button onClick={configHandler}>Save</button>
    </div>
    </>
)
}
