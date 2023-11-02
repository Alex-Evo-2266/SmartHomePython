import logging
from app.device.models import Device
from app.exceptions.exceptions import DeviceNotFound
from app.device.device_class.BaseDeviceClass import BaseDevice
from app.device.devices_arrey import DevicesArrey
from app.device.device_class.DeviceClasses import DeviceClasses
from app.device.enums import StatusDevice
from app.device.schemas import DeviceSchema, FieldDeviceSchema
from app.device.map import device_db_to_schema
from app.device.edit_field import edit_fields

from typing import List

logger = logging.getLogger(__name__)

async def polling(device_data: Device):
	try:
		logger.debug("get_device function")
		device:BaseDevice
		if not device_data:
			raise DeviceNotFound()
		if device_data.device_polling == False:
			data = await device_db_to_schema(device_data)
			data.value = dict()
			data.device_status = StatusDevice.UNLINK
			return data
		element = DevicesArrey.get(device_data.system_name)
		if not element:
			device:BaseDevice = DeviceClasses.get_device(device_data.class_device, data=device_data.dict())
			if not device:
				data = await device_db_to_schema(device_data)
				data.value = dict()
				data.device_status = StatusDevice.NOT_SUPPORTED
				return data
			if not device.is_conected:
				data = await device_db_to_schema(device_data)
				data.device_status = StatusDevice.OFFLINE
				data.value = dict()
				return data
			class_device = DeviceClasses.get(device_data.class_device)
			if class_device and class_device.Config.init_field:
				print("p0")
				await edit_fields(device_data, [x._get_initial_data() for x in device.values])
			DevicesArrey.addDevice(device_data.system_name,device)
		else:
			device = element.device
		device.updata()
		data = device.get_data()
		data.device_status = StatusDevice.ONLINE
		return data
	except Exception as e:
		logger.warning(f'device not found. {e}')
		element = DevicesArrey.get(device_data.system_name)
		if element:
			DevicesArrey.delete(device_data.system_name)
		data = await device_db_to_schema(device_data)
		data.device_status = StatusDevice.OFFLINE
		data.value = dict()
		return data
		

async def device_polling_edit(system_name: str, poling: bool):
	device: Device | None = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	device.device_polling = poling
	await device.update(_columns=["device_polling"])