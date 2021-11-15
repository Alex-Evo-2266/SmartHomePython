import React,{useContext} from 'react'
import {FormContext} from '../Form/formContext'
import {RunText} from '../runText'
import {Menu} from '../Menu/dopmenu/menu'
import {TypeDeviceContext} from '../typeDevices/typeDevicesContext.js'
import {DialogWindowContext} from '../dialogWindow/dialogWindowContext'
import {AuthContext} from '../../context/AuthContext.js'
import {useHttp} from '../../hooks/http.hook'


export const ZigbeeElement = ({data}) =>{
  const auth = useContext(AuthContext)
  const {request} = useHttp();
  const form = useContext(FormContext)
  const types = useContext(TypeDeviceContext)
  const {show, hide} = useContext(DialogWindowContext)

  const rename = (newName) => {
    request('/api/zigbee2mqtt/rename', 'POST',{name:data.name,newName},{Authorization: `Bearer ${auth.token}`})
  }

  const deleteDevice = () => {
    request('/api/zigbee2mqtt/devices', 'DELETE',{name:data.address},{Authorization: `Bearer ${auth.token}`})
  }

  const typeList = ()=>types?.type?.map(item=>{
    return {
      title: item.title,
      data: item.title,
    }
  })

  const valmaxmin=(val, def)=>{
    if(val === 0)
      return 0
    if(val === false)
      return false
    return val||def
  }

  const linc = ()=>{
    let conf = []
    for (var item of data.exposes) {
      let type = item.type
      if(item.type==="numeric")
        type="number"
      let values = ""
      if(item.values){
        values = item.values.join(", ")
      }
      let confel = {
        name:item.name,
        address:item.property,
        low:valmaxmin(item.value_min||item.value_off,0),
        high:valmaxmin(item.value_max||item.value_on,1000000),
        icon:"",
        type:type,
        unit:item.unit,
        values:values,
        control:false
      }
      conf.push(confel)
    }
    show("confirmation",{
      title:"Types",
      items:typeList(),
      active:(d)=>addDev(d,conf)
    })
  }

  function addDev(data1,conf) {
    form.show("LinkDevices",null,{
      DeviceTypeConnect: "zigbee",
      DeviceType: data1,
      DeviceAddress: data.allAddress,
      DeviceValueType: "json",
      DeviceConfig: conf
    })
    hide()
  }

  function buttons() {
    let arr = []
    if(data.exposes){
      arr.push({
        title:"linc",
        onClick:linc
      })
    }
    if(data.type!=="Coordinator"){
      arr.push({
        title:"rename",
        onClick:()=>show("text",{
          title:"Rename",
          text:"input new name",
          placeholder:"new name",
          action:rename
        })
      })
      arr.push({
        title:"delete",
        onClick:()=>show("alert",{
          title:"Delete",
          text:"Delete device",
          buttons:[
            {
              title:"cancel"
            },
            {
              title:"ok",
              action:deleteDevice
            }
          ]
        })
      })
    }
    return arr
  }

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <div className = {`typeConnect zigbee`}>
          <p>zigbee</p>
        </div>
        <div className = {`typeConnect zigbee`}>
          <p>{data.address}</p>
        </div>
        <RunText className="DeviceName" id={data.name} text={data.name||"NuN"}/>
        <Menu buttons={buttons()}/>
      </div>
      {
        (data.exposes)?
        <div className="dividers"></div>
        :null
      }
      <div className = "NewCardBody">
        <ul>
        {(data.exposes)?
          data.exposes.map((item,index)=>{
            return(
              <li className="DeviceControlLi" key={index}>
                <div className="DeviceControlLiName">
                  <p>{item.name}</p>
                </div>
                <div className="DeviceControlLiContent">
                  <div className="DeviceControlLiValue">
                    <p>{item.type}</p>
                  </div>
                </div>
              </li>
            )
          }):null
        }
        </ul>
      </div>
    </div>
  )
}
