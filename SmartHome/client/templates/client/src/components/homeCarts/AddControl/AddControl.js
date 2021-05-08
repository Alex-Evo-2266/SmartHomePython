import React, {useContext,useState} from 'react'
import {AddControlContext} from './AddControlContext'
import {BackForm} from '../../moduls/backForm'
import {AddButton} from './Control/addButton'
import {AddSlider} from './Control/addSlider'
import {AddScript} from './Control/addScript'

const weather = {
  id:null,
  name:"weather",
  type:"weather",
  typeAction:"",
  order:"0",
  deviceId:null,
  action:"",
  width:1,
  height:1
}

export const AddControl = ()=>{
  const {addControl, hide} = useContext(AddControlContext)
  const [typeChild, setTypeChild] = useState("");

  const close = ()=>{
    hide()
    setTypeChild("")
  }

  const addButton = (t)=>{
    if(addControl.type === "AddLineButton"){
      t.type = 'line-' + t.type
    }
    if(addControl.OK){
      addControl.OK(t)
    }
    close()
  }

  if(!addControl.visible){
    return null;
  }

  if(addControl.type === "AddButton"||addControl.type === "AddLineButton"){
    return (
      <BackForm onClick = {close} className="addElementBody">
        <div className="box">
          <h2>type control element</h2>
          {
            (!typeChild)?
            <ul>
              <li onClick={()=>setTypeChild("button")}><span>1</span>button activate</li>
              <li onClick={()=>setTypeChild("script")}><span>2</span>scripts</li>
              <li onClick={()=>setTypeChild("slider")}><span>3</span>slider</li>
              <li onClick={()=>setTypeChild("sensor")}><span>4</span>sensor monitor</li>
              <li onClick={()=>addButton(weather)}><span>5</span>weather</li>
            </ul>:
            (typeChild==="button")?
            <AddButton add={addButton}/>:
            (typeChild==="slider")?
            <AddSlider add={addButton}/>:
            (typeChild==="script")?
            <AddScript add={addButton}/>
            :null
          }
        </div>
      </BackForm>
    )
  }
}
