from pathlib import Path
import datetime
import os, sys


try:
    from app.configuration.settings_local import *
except Exception as e:
    from app.configuration.settings_prod import *


DB_URL = "".join(["mysql+pymysql://",
    MYSQL_USER,":",
    MYSQL_PASSWORD,"@",
    MYSQL_HOST,":",MYSQL_PORT,"/",
    MYSQL_DATABASE])
print("bd: ",DB_URL)


ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SCRIPT_AUTOMATION_PREFEX = "automation"

SERVER_CONFIG = os.path.join(BASE_DIR, "files","server-config.yml")
SCRIPTS_DIR = os.path.join(BASE_DIR, "files","scripts")
# DEVICETYPES = os.path.join(BASE_DIR, "files","devTypes.yml")
# STYLES_DIR = os.path.join(BASE_DIR, "files","styles")
# PAGES_DIR =  os.path.join(BASE_DIR, "files","pages")
# DEVICES = os.path.join(BASE_DIR, "files","devices.yml")
# GROUPS = os.path.join(BASE_DIR, "files","groups.yml")
# ROOMS = os.path.join(BASE_DIR, "files","rooms.yml")

TIME_UPPDATA = 6
LENGTHPASS = 10

# config
CONFIG_DIR = os.path.join(BASE_DIR, "config")
CONFIG_FILE_NAME = 'service_config'
ROUTE_PREFIX = "/api-device"
CONFIG_TAG = "device-config"

# config keys
FREQUENCY = 'frequency'
SEND_DEVICE_CONF = 'send-device-data'

# loop key
LOOP_DEVICE_POLLING = 'device-polling'
LOOP_SEND_DEVICE = 'send-device-data'

#websocket key
TYPE_SEND_DEVICE = "device-send"

TIMEZONE = datetime.timezone(datetime.timedelta(hours=3))

DEFAULT_SEND_INTERVAL = 6
DEFAULT_SEND_SERVER_DATA_INTERVAL = 30
DEFAULT_SAVE_INTERVAL = 10

MEDIA_URL = '/media/'
MODULES_URL = '/media/modules/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
BACKGROUND_DIR = os.path.join(MEDIA_ROOT, 'backgrounds')
MODULES_DIR = os.path.join(MEDIA_ROOT, 'modules')

