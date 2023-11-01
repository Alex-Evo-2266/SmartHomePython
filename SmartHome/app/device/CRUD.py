from app.device.schemas import AddDeviceSchema, EditDeviceSchema, AddDeviceFieldSchema, DeviceSchema
from app.device.models import Device, Device_field
from app.exceptions.exceptions import DeviceNotFound, DuplicateFieldsException
from typing import List, Optional
from app.device.polling import polling
from app.device.edit_field import edit_fields


async def duble_field(fields: List[AddDeviceFieldSchema], system_name: Optional[str] = None):
	field_names = []
	for field in fields:
		if field.name in field_names:
			if not system_name:
				raise DuplicateFieldsException()
			raise DuplicateFieldsException(f"duplicate fields in {system_name}")
		field_names.append(field.name)

async def add_device(data: AddDeviceSchema):
	await duble_field(data.fields, data.system_name)
	new_device = await Device.objects.create(**(data.dict()))
	for field in data.fields:
		await Device_field.objects.create(**(field.dict()), device=new_device)

async def edit_device(system_name: str, data: EditDeviceSchema):
	device: Device | None = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	await duble_field(data.fields, data.system_name)
	await edit_fields(device, data.fields)
	await device.update(**(data.dict()))

async def delete_device(system_name:str):
	device = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	await device.delete()
	
async def get_all_device():
	devices = await Device.objects.all()
	arr:List[DeviceSchema] = []
	for item in devices:
		device = await polling(item)
		if not device:
			raise
		arr.append(device)
	return arr
	
async def get_device(sysyem_name: str):
	device = await Device.objects.get_or_none(sysyem_name=sysyem_name)
	if device:
		return await polling(device)
	raise DeviceNotFound()
	