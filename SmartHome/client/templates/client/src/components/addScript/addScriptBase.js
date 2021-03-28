import React, {useContext,useState} from 'react'
import {AddScriptContext} from './addScriptContext'
import {AddScriptDevices} from './addScript/addScriptDevices'
import {CenterWindow} from '../modalWindow/centerWindow'
import {BackForm} from '../moduls/backForm'
import {IfBlock} from '../moduls/programmBlock/ifBlock'
import {GroupBlock} from '../moduls/programmBlock/groupBlock'
import {ShowScript} from './addScript/showScript'

export const AddScriptBase = ()=>{
  const {addScript, hide} = useContext(AddScriptContext)
  const [deviceBlock, setDeviceBlock]=useState(false)

  const close = ()=>{
    hide()
    setDeviceBlock(false)
  }

  const shoseDevice=(item)=>{
    if(typeof(addScript.OK)==="function")
      addScript.OK("deviceBlock",item)
    close()
  }

  const shoseBlock = async(t)=>{
    if(t==="deviceBlock"||t==="DeviceValue"){
      setDeviceBlock(true)
      return
    }
    // await setBlock(t)
    if(typeof(addScript.OK)==="function")
      addScript.OK(t)
    close()
  }

  if(!addScript.visible){
    return null;
  }

  if(addScript.type==="showScript"){
    return (
      <CenterWindow hide={close}>
        <ShowScript data={addScript.data}/>
      </CenterWindow>
    )
  }

  if(addScript.type==="triggerBlock"){
    return (
      <BackForm onClick={close} className="addElementBody">
        <AddScriptDevices result={shoseDevice} type={"if"}/>
      </BackForm>
    )
  }

  if(addScript.type==="deviceBlock"){
    return (
      <BackForm onClick={close} className="addElementBody">
        <AddScriptDevices result={shoseDevice} type={"act"}/>
      </BackForm>
    )
  }

  if(addScript.type==="addValue"||addScript.type==="addValueMath"){
    return(
      <BackForm onClick={close} className="addElementBody">
      {
        (!deviceBlock)?
        <div className="box">
          <h2>type value</h2>
          <ul>
          {
            (addScript.type==="addValue")?
            <li onClick={()=>shoseBlock("Text")}><span>1</span>input text</li>
            :null
          }
            <li onClick={()=>shoseBlock("Number")}><span>2</span>input number</li>
            <li onClick={()=>shoseBlock("Math")}><span>3</span>Mathematical expression</li>
            <li onClick={()=>shoseBlock("DeviceValue")}><span>4</span>Device value</li>
          </ul>
        </div>:
        <AddScriptDevices result={shoseDevice} type={"if"}/>
      }
      </BackForm>
    )
  }

  // <ul className="shoseBlock">
  //   <li onClick={()=>shoseBlock("groupBlockAnd")}>
  //     <GroupBlock type={"and"}>
  //     </GroupBlock>
  //   </li>
  //   <li onClick={()=>shoseBlock("groupBlockOr")}>
  //     <GroupBlock type={"or"}>
  //     </GroupBlock>
  //   </li>
  //   <li onClick={()=>shoseBlock("deviceBlock")} style={{gridColumnStart:"1", gridColumnEnd:"3"}}>
  //     <IfBlock/>
  //   </li>
  // </ul>

  if(addScript.type==="typeBlock"){
    return (
      <BackForm onClick={close} className="addElementBody">
      {
        (!deviceBlock)?
        <div className="box">
          <h2>type control element</h2>
            <ul>
              <li onClick={()=>shoseBlock("groupBlockAnd")}><span>1</span>group Block And</li>
              <li onClick={()=>shoseBlock("groupBlockOr")}><span>2</span>group Block Or</li>
              <li onClick={()=>shoseBlock("deviceBlock")}><span>3</span>device</li>
            </ul>
          </div>
        :
        <AddScriptDevices result={shoseDevice} type={"if"}/>
      }
      </BackForm>
    )
  }
  return null;
}
