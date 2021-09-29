from django.conf import settings
from ..models import Device,ValueDevice,Room,genId
from yeelight import BulbException

from ..classes.devicesArrey import DevicesArrey


from .deviceControl.DeviceClass.Yeelight import Yeelight
from .deviceControl.DeviceClass.MQTTDevice import MQTTDevice

import json
import ast


devicesArrey = DevicesArrey()

def confdecod(data):
    arr2 = []
    for element in data.valuedevice_set.all():
        arr2.append(element.receiveDictConf())
    return arr2

def addDevice(data):
    try:
        devices = Device.objects.all()
        for item in devices:
            if item.DeviceSystemName==data.get("DeviceSystemName"):
                return False
        newDevice = Device.objects.create(id=genId(Device.objects.all()),DeviceName=data.get("DeviceName"), DeviceSystemName=data.get("DeviceSystemName"), DeviceType=data.get("DeviceType"),DeviceTypeConnect=data.get("DeviceTypeConnect"),DeviceAddress=data.get("DeviceAddress"),DeviceValueType=data.get("DeviceValueType"))
        if "DeviceToken" in data:
            newDevice.DeviceToken=data.get("DeviceToken")
        newDevice.save()
        if(data.get("DeviceValueType")=="json"):
            conf = data["config"]
            for item in conf:
                val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=newDevice,name=item["name"])
                val.value="0"
                if "address" in item:
                    val.address=item["address"]
                if "low" in item:
                    val.low=item["low"]
                    val.value=item["low"]
                if "high" in item:
                    val.high=item["high"]
                if "icon" in item:
                    val.icon=item["icon"]
                if "values" in item:
                    val.values=item["values"]
                if "control" in item:
                    val.control=item["control"]
                if "unit" in item:
                    val.unit=item["unit"]
                if "type" in item:
                    val.type=item["type"]
                val.save()
            return True
        else:
            conf = data["config"]
            for item in conf:
                val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=newDevice,name=item["name"], address=item["address"])
                val.value="0"
                if "low" in item:
                    val.low=item["low"]
                    val.value=item["low"]
                if "high" in item:
                    val.high=item["high"]
                if "icon" in item:
                    val.icon=item["icon"]
                if "control" in item:
                    val.control=item["control"]
                if "values" in item:
                    val.values=item["values"]
                if "unit" in item:
                    val.unit=item["unit"]
                if "type" in item:
                    val.type=item["type"]
                val.save()
            return True
    except Exception as e:
        print("error device add",e)
        return False

def device(item):
    id = item.id
    typeConnect = item.DeviceTypeConnect
    dev = None
    status = "offline"
    try:
        if(not item.DeviceStatus):
            control = item.DeviceControl
            return {
            **item.receiveDict(),
            "DeviceConfig":confdecod(item),
            "DeviceValue":None,
            "status":"unlink"
            }
        element = devicesArrey.get(id)
        if(not element):
            if(typeConnect == "yeelight"):
                dev = Yeelight(id=id)
            if(typeConnect == "mqtt"):
                dev = MQTTDevice(id=id)
            if(not dev.get_device()):
                return {
                **dev.get_Base_Info(),
                "status":"offline"
                }
            devicesArrey.addDevice(id,dev)

        else:
            status = "online"
            dev = element["device"]
        return {
        **dev.get_All_Info(),
        "status":status
        }

    except Exception as e:
        print("error device",e)
        el = devicesArrey.get(item.id)
        if(el):
            dev = el['device']
            devicesArrey.delete(item.id)
            return {
                **dev.get_Base_Info(),
                "status":"offline"
            }
        return None

def giveDevice(id):
    dev = Device.objects.get(id=id)
    return device(dev)

def giveDevices():
    Devices = Device.objects.all()
    arr = []
    for item in Devices:
        dev = device(item)
        arr.append(dev)
    return arr

def editDevice(data):
    try:
        print(data)
        devices = Device.objects.all()
        for item in devices:
            if item.DeviceSystemName==data.get("DeviceSystemName") and item.id != data["DeviceId"]:
                return False
        dev = Device.objects.get(id=data["DeviceId"])
        dev.DeviceName = data["DeviceName"]
        dev.DeviceSystemName = data["DeviceSystemName"]
        dev.DeviceInformation = data["DeviceInformation"]
        dev.DeviceType = data["DeviceType"]
        if(data["DeviceType"]!="variable"):
            dev.DeviceAddress = data["DeviceAddress"]
            dev.DeviceValueType = data["DeviceValueType"]
        if "DeviceToken" in data:
            dev.DeviceToken = data["DeviceToken"]
        dev.DeviceTypeConnect = data["DeviceTypeConnect"]
        if(data["DeviceType"] != "miio" or data["DeviceType"] != "yeelight"):
            dev.DeviceControl = ""
        if("RoomId" in data and data["RoomId"]):
            room = Room.objects.get(id=data["RoomId"])
            dev.room = room
        if("DeviceValue" in data):
            deviceSetStatusThread(data["DeviceId"],"value",data["DeviceValue"])
        dev.save()

        print(devicesArrey.all())
        devicesArrey.delete(data["DeviceId"])

        vals = ValueDevice.objects.filter(device__id=data["DeviceId"])
        if("config" in data):
            for item in vals:
                item.delete()
            conf = data["config"]
            for item in conf:
                val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,name=item["name"])
                val.value="0"
                if "address" in item:
                    val.address=item["address"]
                if "low" in item:
                    val.low=item["low"]
                    val.value=item["low"]
                if "high" in item:
                    val.high=item["high"]
                if "icon" in item:
                    val.icon=item["icon"]
                if "values" in item:
                    val.values=item["values"]
                if "unit" in item:
                    val.unit=item["unit"]
                if "control" in item:
                    val.control=item["control"]
                if "type" in item:
                    val.type=item["type"]
                val.save()
            return True
        return True
    except Exception as e:
        print(e)
        return False

def deleteDevice(id):
    try:
        print("q",id)
        dev = Device.objects.get(id=id)
        print("delete",dev)
        devicesArrey.delete(id)
        print("delete in arr")
        dev.delete()
        print("ok")
        return True
    except Exception as e:
        print("delete device error ",e)
        return False
