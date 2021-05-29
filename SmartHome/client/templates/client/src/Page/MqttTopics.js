import React,{useEffect,useState,useCallback,useContext} from 'react'
import {NavLink,Link} from 'react-router-dom'
import {Header} from '../components/moduls/header'
import {Loader} from '../components/Loader'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {MQTTElement} from '../components/moduls/mqttCards/mqttCard'

export const MqttPage = ()=>{
  const auth = useContext(AuthContext)
  const [deviceMqtt,setDeviceMqtt] = useState([])
  const {loading, request, error, clearError} = useHttp();
  const {message} = useMessage();

  const getDev = useCallback(async () => {
    try {
      const data = await request('/api/devices/mqtt', 'GET',null,{Authorization: `Bearer ${auth.token}`})
      if(data){
        setDeviceMqtt(data)
        console.log(data);
      }
    } catch (e) {

    }
  },[request,auth.token])

  useEffect(()=>{
    message(error, 'error');
    clearError();
  },[error, message, clearError])

  useEffect(()=>{
    getDev()
  },[getDev])

  return (
    <div className="conteiner">
      <Header name="Device Mqtt">
        <NavLink to="/devices" exact className="btn">All</NavLink>
        <NavLink to="/devices/mqtt" exact className="btn">Mqtt</NavLink>
        <button onClick={getDev} className="btn"><i className="fas fa-undo"></i></button>
        <Link to="/devices/add" className="btn"><i className="fas fa-plus"></i></Link>
      </Header>
      {
        (loading||!deviceMqtt)?
        <Loader/>:
        <div className="top">
          <table className="mqttTable">
            <tr><th>Адресс</th><th>Сообщения</th><th>связанные устройства</th><th>Управление</th></tr>
            {
              deviceMqtt.map((item,index)=>{
                return <MQTTElement key={index} data = {item}/>
              })
            }
          </table>
        </div>
      }
    </div>
  )
}
