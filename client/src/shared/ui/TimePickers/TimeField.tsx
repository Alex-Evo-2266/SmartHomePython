import { Clock3 } from "lucide-react"
import { useCallback, useState } from "react"
import "./TimeField.scss"
import { useAppDispatch } from "../../lib/hooks/redux"
import { DialogType, hideDialog, showDialog } from "../../lib/reducers/baseDialogReducer"
import { TimePicker } from "./TimePickers"

interface ITimeFieldProps{
    onChange?:(value: string)=>void
    name?: string
    value?: string
    validEmptyValue?: boolean
    className?: string
    error?: boolean
}

export const TimeField = ({onChange, name, value, className, validEmptyValue, error}:ITimeFieldProps) => {

    const [timeValue, setTimeValue] = useState<string>(value ?? "")

    const dispatch = useAppDispatch()

    const emptyValueClass = useCallback((validEmptyValue?:boolean, value?: string | number) => {
        if(error)
            return "error"
        if(validEmptyValue && (!timeValue || timeValue === ""))
            return "error"
        return ""	
    },[timeValue])

    const change = (hours: number, minutes: number) => {
        let hoursStr = String(hours)
        let minutesStr = String(minutes)
        if(hoursStr.length < 2)
            hoursStr = "0" + hoursStr
        if(minutesStr.length < 2)
        minutesStr = "0" + minutesStr
        setTimeValue(`${hoursStr}:${minutesStr}`)
        onChange && onChange(`${hoursStr}:${minutesStr}`)
    }

    const click = () => {
        dispatch(showDialog({
            type: DialogType.BASE_DIALOG,
            dialog: <TimePicker 
                    onHide={()=>dispatch(hideDialog(DialogType.BASE_DIALOG))}
                    onChange={change}
                    hours={0}
                    minutes={0}
                    />
        }))
    }


    return(
        <div className={`time-field`}>
            <div className="icon-container" onClick={click}><Clock3/></div>
            <div className="input-container" onClick={click}>
                <input
                required 
                type="time" 
                className={`${className} ${emptyValueClass(validEmptyValue, value)}`} 
                name={name} 
                value={timeValue}
                readOnly
                />
                <span className="text-field-line"></span>
            </div>
		</div>  
    )
}