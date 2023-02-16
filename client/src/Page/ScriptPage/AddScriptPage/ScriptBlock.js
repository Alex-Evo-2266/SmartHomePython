import React,{useEffect, useRef, useState} from 'react'
import { ActiveBlock } from './ActiveBlock'
import { IfBlock } from './IfBlock'

export const ScriptBlock = ({data = null, update}) => {

  const block = useRef(null)

  useEffect(()=>{                                         // move block
    if (!block.current) return;
    block.current.onmousedown = function(e) {
      if(e.target.closest(".script-block-no-move")) return
      e.preventDefault()
      block.current.style.position = 'absolute';
      moveAt(e);
      block.current.style.zIndex = 70;
      function moveAt(e) {
        let containerPoz = block.current.parentNode.getBoundingClientRect()
        if (e.pageX - containerPoz.x - block.current.offsetWidth / 2 >= 0)
          block.current.style.left = e.pageX - containerPoz.x - block.current.offsetWidth / 2 + 'px';
        if (e.pageY - containerPoz.y - block.current.offsetHeight / 2 >= 0)
          block.current.style.top = e.pageY - containerPoz.y - block.current.offsetHeight / 2 + 'px';
        update({
          ...data, 
          x:e.pageX - containerPoz.x - block.current.offsetWidth / 2,
          y:e.pageY - containerPoz.y - block.current.offsetHeight / 2
        })
      }
      document.onmousemove = function(e) {
        moveAt(e);
      }
      block.current.onmouseup = function(e) {
        let containerPoz = block.current.parentNode.getBoundingClientRect()
        document.onmousemove = null;
        block.current.onmouseup = null;
        update({
          ...data, 
          x:e.pageX - containerPoz.x - block.current.offsetWidth / 2,
          y:e.pageY - containerPoz.y - block.current.offsetHeight / 2
        })
      }
    }
  },[block.current, update])

  const updateCard = (data2)=>{
    update({...data, ...data2})
  }


  return(
    <div ref={block} data-id={data.id} className='script-block-container card-container script-block' style={{top:data.y, left:data.x}}>
      {
        (data.type === "action")?
        <ActiveBlock data={data} update={updateCard}/>:
        (data.type === "condition")?
        <IfBlock data={data} update={updateCard}/>:
        null
      }
    </div>
  )
}
