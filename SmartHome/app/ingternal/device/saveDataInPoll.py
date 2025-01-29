from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.schemas.device import DeviceSchema, DeviceSerializeSchema
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry
from app.configuration.settings import DEVICE_DATA_POLL
import logging

logger = logging.getLogger(__name__)

def update_device_in_poll(device:DeviceSchema):
	device_list: DeviceRegistry | None = servicesDataPoll.get(DEVICE_DATA_POLL)
	if(not device_list):
		logger.warning(f"invalid key")
		return
	device_list.set(device.system_name, device)
