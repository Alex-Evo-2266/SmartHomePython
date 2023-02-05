
from typing import List
from SmartHome.logic.deviceClass.schema import AdditionDevice, ChangeDevice, ChangeField, OptionalDevice
from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice
from SmartHome.logic.deviceClass.VariableClass import Variable
from SmartHome.logic.deviceClass.schema import FieldTypeDevice
from SmartHome.logic.deviceClass.typeDevice.Types import DeviceTypeClasses

def filter_parametr(dct):
	new_dict = dict()
	for key in dct:
		if key[0] != "_" and key[1] != "_":
			new_dict[key] = dct[key]
	return new_dict

def get_type():
	arr:List[FieldTypeDevice] = []
	devece_types = DeviceTypeClasses.all()
	print(devece_types.__doc__)
	for key in devece_types:
		pass
	return arr
	