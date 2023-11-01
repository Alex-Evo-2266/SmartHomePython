
from app.loop.call_functions import RunFunctions
from app.device.CRUD import get_all_device
from app.websocket import WebSocketMenager
from app.settings import configManager

async def send_device():
	print("send")
	devices = await get_all_device()
	devicesdict = list()
	for item in devices:
		if item:
			devicesdict.append(item.dict())
		else:
			devicesdict.append(None)
	await WebSocketMenager.send_information("devices", devicesdict)


async def send_restart():
	base = configManager.getConfig("send_message")
	if base and "frequency" in base:
		RunFunctions.subscribe("devices", send_device, int(base['frequency']))
	else:
		RunFunctions.subscribe("devices", send_device, 6)