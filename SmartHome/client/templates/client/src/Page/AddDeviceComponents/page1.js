import React,{useContext,useState,useEffect,useCallback} from 'react'
import {TypeDeviceContext} from '../../components/typeDevices/typeDevicesContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useChecked} from '../../hooks/checked.hook'
import {useMessage} from '../../hooks/message.hook'
import socketImg from '../../img/socket.png'
import lampImg from '../../img/lamp.png'
import switchImg from '../../img/switch.png'
import relayImg from '../../img/relay.jpg'

const images = {
  lamp: lampImg,
  light: lampImg,
  switch: switchImg,
  relay: relayImg,
  socket: socketImg
}

function getImage(name) {
  for (var key in images) {
    if(name.indexOf(key) !== -1)
      return images[key]
  }
}

export const AddDevicesPage1 = ({form, setForm, next}) => {
  const {type} = useContext(TypeDeviceContext)

  const choisetype = (typedev, typeconnect)=>{
    setForm({...form, DeviceType:typedev, DeviceTypeConnect:typeconnect})
    next()
  }

  return(
    <>
      <ul className="leftlist"></ul>
      <div className="devicesTypeListConteiner">
        {
          type?.map((item,index)=>{
            return(
              <div key={index} className="typeDevice">
                <div className="configTitle">
                  <p>{item.title}</p>
                </div>
                <div className="typeDeviceConteiner">
                {
                  item.devices?.map((item2, index2)=>{
                    return(
                      <div className="card" key={index2} onClick = {()=>choisetype(item.title, item2)}>
                        <div className="imgConteiner">
                          <img src={item.img||getImage(item.title)} alt={item.title}/>
                        </div>
                        <p>{`${item.title} (${item2})`}</p>
                      </div>
                    )
                  })
                }
                </div>
                <div className="dividers"></div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}
