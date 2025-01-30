import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List, Union
from app.ingternal.device.schemas.device import DeviceSchema, StatusForm, DeviceSerializeSchema
from app.ingternal.device.schemas.add_device import AddDeviceSchema
from app.ingternal.device.schemas.edit_device import EditDeviceSchema
from app.ingternal.device.schemas.config import DeviceClassConfigSchema

from app.ingternal.device.serialize_model.read import get_serialize_device, get_device
from app.ingternal.device.serialize_model.update import edit_status_device, edit_device
from app.ingternal.device.helpers.get_option_device import get_config_devices
from app.ingternal.device.serialize_model.create import add_device
from app.ingternal.device.serialize_model.delete import delete_device
from app.ingternal.device.set_device_status import set_status

from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry
from app.ingternal.device.exceptions.device import DevicesStructureNotFound
from app.configuration.settings import DEVICE_DATA_POLL

router = APIRouter(
    prefix="/api-devices/devices",
    tags=["device"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

# Добавление устройства
@router.post("")
async def add_device_url(data: AddDeviceSchema):
    try:
        await add_device(data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Редактирование устройства
@router.put("/{system_name}")
async def edit_dev(system_name: str, data: EditDeviceSchema):
    try:
        await edit_device(system_name, data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Удаление устройства
@router.delete("/{system_name}")
async def delete_dev(system_name: str):
    try:
        await delete_device(system_name)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Получение опций устройства
@router.get("/options", response_model=List[DeviceClassConfigSchema])
async def get_options_dev():
    try:
        options = get_config_devices()
        return options
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Получение информации об устройстве по его имени
@router.get("/{system_name}", response_model=DeviceSerializeSchema)
async def get_dev(system_name: str):
    try:
        return await get_device(system_name)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Получение устройства для сериализации
@router.get("/{system_name}/row", response_model=DeviceSerializeSchema)
async def get_dev_serialize(system_name: str):
    try:
        return await get_serialize_device(system_name)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Получение списка всех устройств
@router.get("", response_model=List[DeviceSchema])
async def get_all_dev():
    try:
        devices_list: Optional[DeviceRegistry] = servicesDataPoll.get(DEVICE_DATA_POLL)
        if not devices_list:
            raise DevicesStructureNotFound()
        devices = devices_list.get_all_devices()
        return devices
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Установка состояния устройства (этот метод нужно реализовать)
@router.get("/{system_name}/value/{field_id}/set/{value}")
async def set_device_state(system_name: str, field_id: str, value: Union[str, int]):
    try:
        set_status(system_name, field_id, value)
        return JSONResponse(status_code=200, content={"message": "Device state updated"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

# Обновление статуса устройства (например, подключение/отключение)
@router.patch("/{system_name}/polling")
async def set_connection_status(system_name: str, data: StatusForm):
    try:
        await edit_status_device(system_name, data.status)
        return JSONResponse(status_code=200, content={"message": "Status updated"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})