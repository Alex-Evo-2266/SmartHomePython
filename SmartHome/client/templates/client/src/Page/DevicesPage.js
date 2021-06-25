import React, {useContext,useEffect,useState,useRef} from 'react'
import {NavLink,Link} from 'react-router-dom'
import {Header} from '../components/moduls/header'
import {NewDeviceElement} from '../components/moduls/newDeviceElement'
import {DeviceStatusContext} from '../context/DeviceStatusContext'

export const DevicesPage = () => {
  const allDevices = useContext(DeviceStatusContext)

  const [devices, setDevices] = useState([]);
  const read = useRef(0)

  useEffect(()=>{
    if(read.current<3){
      setDevices(allDevices.devices)
      read.current++
    }
  },[allDevices.devices])

  const searchout = (data)=>{
    if(data===""){
      setDevices(allDevices.devices)
      return
    }
    let array = allDevices.devices.filter(item => item&&item.DeviceName.indexOf(data)!==-1)
    setDevices(array)
  }

  return(
      <div className = "conteiner top">
        <Header search={searchout} name="Device All">
        <NavLink to="/devices" exact={true} className="btn">All</NavLink>
        <Link to="/devices/add" className="btn"><i className="fas fa-plus"></i></Link>
        </Header>
        <div className = "Devices">
          {
            (!devices||devices.length === 0)?
            <h2 className="empty">Not elements</h2>:
            <div className = "CardConteiner">
              {
                devices.map((item,index)=>{

                  if(item)
                    return(
                      <NewDeviceElement key = {index} id={item.DeviceId}/>
                    )
                  return null
                })
              }
            </div>
          }
        </div>
      </div>
  )
}
