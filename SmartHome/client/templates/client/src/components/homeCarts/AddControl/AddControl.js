import React, {useContext,useState} from 'react'
import {AddControlContext} from './AddControlContext'
import {ScriptPage} from './Control/scriptPage'
import {Page2} from './Control/page2'
import {Page3} from './Control/page3'
import {Page4} from './Control/page4'
import {Page5} from './Control/page5'
import {ConfirmationDialog} from '../../dialogWindow/dialogType/confirmationDialog'

const cardBaseElement = [
  {
    title:"button",
    data:"button"
  },
  {
    title:"script",
    data:"script"
  },
  {
    title:"slider",
    data:"slider"
  },
  {
    title:"monitor",
    data:"sensor"
  },
  {
    title:"enum",
    data:"enum"
  },
  {
    title:"weather",
    data:"weather"
  },
  {
    title:"time",
    data:"time"
  },
  {
    title:"calendar",
    data:"date"
  }
]

const cardLineElement = [
  {
    title:"button",
    data:"button"
  },
  {
    title:"script",
    data:"script"
  },
  {
    title:"slider",
    data:"slider"
  },
  {
    title:"monitor",
    data:"sensor"
  },
  {
    title:"enum",
    data:"enum"
  },
  {
    title:"text",
    data:"text"
  },
]

const weather = {
  name:"weather",
  type:"weather",
  order:"0",
  width:1,
  height:1
}

const time = {
  name:"time",
  type:"time",
  order:"0",
  width:2,
  height:1
}

const date = {
  name:"date",
  type:"date",
  order:"0",
  width:2,
  height:2
}

export const AddControl = ()=>{
  const {addControl, hide} = useContext(AddControlContext)
  const [typeChild, setTypeChild] = useState("");
  const [device, setDevice] = useState(null);
  const [action, setAction] = useState(null);
  const [field, setField] = useState(null);
  const [page, setPage] = useState(1);

  const close = ()=>{
    hide()
    setTypeChild("")
    setDevice(null)
    setField(null)
    setPage(1)
  }

  const addElement = (t)=>{
    if(addControl.OK){
      addControl.OK(t)
    }
    close()
  }

  const addScript = (data)=>({
    height: 1,
    name: data.name,
    order: 0,
    type: "script",
    width: 1
  })

  const addDevField = (data)=>({
    height: 1,
    name: device.name,
    deviceName:device.systemName,
    order: 0,
    type: typeChild,
    width: 1,
    typeAction:data.name
  })

  const addDevFieldAction = (data)=>({...addDevField(field), action:data})

  if(!addControl.visible){
    return null;
  }

  if(page === 1){
    return(
      <ConfirmationDialog
      hide={close}
      text="choose the element type."
      title="add element"
      active={(data)=>{
        if(data==="weather")
          addElement(weather)
        else if(data==="time")
          addElement(time)
        else if(data==="date")
          addElement(date)
        else{
          setTypeChild(data)
          setPage(2)
        }
      }}
      activeText="NEXT"
      items={(addControl.type==="AddElement")?cardBaseElement:cardLineElement}
      />
    )
  }
  if(typeChild==="script"){
    return(
      <ScriptPage
      hide={close}
      next={(data)=>{
        addElement(addScript(data))
      }}
      back={()=>setPage(1)}
      />
    )
  }
  if(page === 2){
    return(
      <Page2
      hide={close}
      type={typeChild}
      back={()=>setPage(1)}
      next={(data)=>{
        setDevice(data)
        setPage(3)
      }}
      />
    )
  }

  if(page === 3){
    return(
      <Page3
      hide={close}
      type={typeChild}
      device={device}
      back={()=>setPage(2)}
      next={(data)=>{
        if(typeChild === "sensor")
          {
            setField(data)
            // addDevField(data)
            setPage(5)
          }
        else if(typeChild === "button" && data.type !== "binary"){
          console.log("sd")
          setPage(4)
          setField(data)
        }
        else{
          setField(data)
          // addDevField(data)
          setPage(5)
        }
      }}
      />
    )
  }

  if(page === 4){
    return(
      <Page4
      next={(data)=>{
        // addDevFieldAction(data)
        setAction(data)
        setPage(5)
      }}
      hide={close}
      back={()=>setPage(3)}
      field={field}
      />
    )
  }

  if(page === 5){
    return(
      <Page5
      next={(data)=>{
        let val
        if(action)
          val = addDevFieldAction(action)
        else
          val = addDevField(field)
        val = {...val, title: data}
        addElement(val)
      }}
      hide={close}
      back={()=>setPage(3)}
      field={field}
      />
    )
  }

  return(null)

    // return (
    //   <BackForm onClick = {close} className="addElementBody">
    //     <div className="box">
    //       <h2>type control element</h2>
          // {
          //   (!typeChild)?
          //   <ul>
          //     <li onClick={()=>setTypeChild("button")}><span>1</span>button activate</li>
          //     <li onClick={()=>setTypeChild("script")}><span>2</span>scripts</li>
          //     <li onClick={()=>setTypeChild("slider")}><span>3</span>slider</li>
          //     <li onClick={()=>setTypeChild("sensor")}><span>4</span>sensor monitor</li>
          //     <li onClick={()=>setTypeChild("enum")}><span>5</span>enum</li>
          //     {
          //       (addControl.type === "AddButton")?
          //       <>
          //       <li onClick={()=>addButton(weather)}><span>6</span>weather</li>
          //       <li onClick={()=>addButton(time)}><span>7</span>time</li>
          //       </>:
          //       (addControl.type === "AddLineButton")?
          //       <li onClick={()=>setTypeChild("text")}><span>6</span>text</li>:
          //       null
          //     }
          //   </ul>:
            // (typeChild==="button")?
            // <AddButton add={addButton}/>:
            // (typeChild==="slider")?
            // <AddSlider add={addButton}/>:
            // (typeChild==="script")?
            // <AddScript add={addButton}/>:
            // (typeChild==="sensor")?
            // <AddSensor add={addButton}/>:
            // (typeChild==="enum")?
            // <AddEnum add={addButton}/>:
            // (typeChild==="text")?
            // <AddText add={addButton}/>
            // :null
          // }
    //     </div>
    //   </BackForm>
    // )
}
