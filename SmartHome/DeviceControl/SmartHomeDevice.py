from DeviceControl.mqttDevice.classDevices.dimmer import MqttDimmer
from DeviceControl.mqttDevice.classDevices.device import MqttDevice
from DeviceControl.mqttDevice.classDevices.light import MqttLight
from DeviceControl.mqttDevice.classDevices.relay import MqttRelay
from DeviceControl.mqttDevice.classDevices.sensor import MqttSensor
from yeelight import Bulb
from miio import Device,Yeelight,DeviceError,DeviceException

def is_device(ip, token):
    try:
        device = Device(ip,token)
        return device
    except:
        return None

def model_device(ip, token):
    ret = is_device(ip, token)
    if(not ret):
        return None
    model = ret.info().model
    type = model.split(".")[0]
    return type

# def config(**kwargs):
#     for item in kwargs["configs"]:
#         if(item["type"]==kwargs["type"]):
#             return item
#     return None

# def deviceObject(item,configs):


class ControlDevices():

    __control_power = None
    __control_dimmer = None
    __control_dimmer_min = None
    __control_dimmer_max = None
    __control_temp = None
    __control_temp_min = None
    __control_temp_max = None
    __control_mode = None
    __control_color = None

    def __init__(self, item,configs):
        self.__item = item
        self.__configs = configs
        try:
            if(item["DeviceTypeConnect"]=="miio"):
                ret = self.config(configs = configs, type="base")
                if(item["DeviceType"]=="light"):
                    self.device = Bulb(ret["address"])
                    self.device.get_properties()
                    # print(self.device.model())
                    self.__control_power = True
                    self.__control_dimmer = True
                    self.__control_dimmer_min = 0
                    self.__control_dimmer_max = 100
                    conf = self.device.get_model_specs()
                    if conf["color_temp"]:
                        self.__control_temp = True
                        temp = conf["color_temp"]
                        self.__control_temp_min = temp["min"]
                        self.__control_temp_max = temp["max"]
                    else:
                        self.__control_temp = False
                    if conf["night_light"]:
                        self.__control_mode = 2;
                    else:
                        self.__control_mode = 1;
                    print(self.__control_mode)
                    if conf["background_light"]:
                        self.__control_color = True;
                    else:
                        self.__control_color = False;
                else:
                    self.device = is_device(ret["address"],ret["token"])
            elif(item["DeviceTypeConnect"]=="mqtt"):
                if(item["DeviceType"]=="light"):
                    self.device = MqttLight(**item, DeviceConfig=configs)
                elif(item["DeviceType"]=="switch"):
                    self.device = MqttRelay(**item, DeviceConfig=configs)
                elif(item["DeviceType"]=="dimmer"):
                    self.device = MqttDimmer(**item, DeviceConfig=configs)
                elif(item["DeviceType"]=="sensor"):
                    self.device = MqttSensor(**item, DeviceConfig=configs)
                else:
                    self.device = MqttDevice(**item, DeviceConfig=configs)
                for item2 in configs:
                    if(item2["type"]=="power"):
                        self.__control_power = True
                    if(item2["type"]=="dimmer"):
                        self.__control_dimmer = True
                        self.__control_dimmer_min = item2["low"]
                        self.__control_dimmer_max = item2["high"]
                    if(item2["type"]=="temp"):
                        self.__control_temp = True
                        self.__control_temp_min = item2["low"]
                        self.__control_temp_max = item2["high"]
                    if(item2["type"]=="mode"):
                        self.__control_mode = int(item2["high"])
                    if item2["type"]=="color":
                        self.__control_color = True;
        except:
            self.device = None

    def get_device(self):
        # забрать само устройство
        return self.device

    def get_control(self):
        control = {
        "status": True
        }
        control["power"] = self.__control_power
        if self.__control_dimmer :
            control["dimmer"]={"min": self.__control_dimmer_min, "max": self.__control_dimmer_max}
        else:
            control["dimmer"]=False
        if self.__control_temp :
            control["temp"]={"min": self.__control_temp_min, "max": self.__control_temp_max}
        else:
            control["temp"]=False
        control["color"] = self.__control_color
        if type(self.__control_mode)==int and self.__control_mode > 1:
            control["mode"] = self.__control_mode
        else:
            control["mode"] = None
        return control

    def get_list_control(self):
        c = self.get_control()
        arr = list()
        for key in c:
            if(c[key]):
                arr.append(key)
        return arr

    def config(self ,**kwargs):
        for item in kwargs["configs"]:
            if(item["type"]==kwargs["type"]):
                return item
        return None


    # def __str__(self)
