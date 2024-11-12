from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.schemas.device import DeviceSerializeSchema, DeviceSchema, DeviceSerializeFieldSchema
from app.ingternal.device.classes.baseField import FieldBase
from app.ingternal.device.classes.metaDevice import DeviceMeta
from app.ingternal.device.interface.field_class import IField

class BaseDevice(IDevice, metaclass=DeviceMeta, use=False):
	
	def __init__(self, device: DeviceSerializeSchema):
		self.data = device
		self.fields: list[FieldBase] = []
		if device.fields:
			for item in device.fields:
				self.fields.append(FieldBase(item, device.system_name))
		self.device = None	
	
	def get_value(self, field_id: str)->str | None:
		field = self.get_field(field_id)
		if not field:
			return
		return field.get()

	def get_values(self)->dict[str, str]:
		values:dict[str, str] = {}
		for field in self.fields:
			value = field.get()
			values[field.get_id()] = value
		return values

	def get_field(self, field_id: str)->IField | None:
		for field in self.fields:
			if field.get_data().id == field_id:
				return field
		return None

	def get_fields(self)->list[IField]:
		return self.fields

	def get_address(self)->str | None:
		return self.data.address

	def get_type_command(self)->any:
		return self.data.type_command

	def get_device(self)->any:
		return self.device

	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return True

	def set_value(self, field_id: str, value: str):
		field = self.get_field(field_id)
		if not field:
			return
		field.set(value)

	def save(self):
		pass

	def load(self):
		pass

	def dict(self):
		data = self.get_schema()
		dict_data = dict(data)
		print(dict_data)
		return dict_data


	def get_data(self)->DeviceSerializeSchema:
		fields:list[DeviceSerializeFieldSchema] = []
		for item in self.fields:
			fields.append(item.get_data())
		self.data.fields = fields
		return self.data

	def get_schema(self)->DeviceSchema:
		res = DeviceSchema(**(self.data.dict()))
		values:list[DeviceSerializeFieldSchema] = []
		vals: dict[str, str] = dict()
		for item in self.fields:
			values.append(item.get_data())
			vals[item.get_name()] = item.get()
		res.fields = values
		res.value = vals
		return res