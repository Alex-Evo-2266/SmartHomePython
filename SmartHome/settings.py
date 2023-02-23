from pathlib import Path
import datetime
import os, sys
from config.modules_config import ModuleConfig



try:
    from settings_local import *
except Exception as e:
    from settings_prod import *


DB_URL = "".join(["mysql+pymysql://",
    MYSQL_USER,":",
    MYSQL_PASSWORD,"@",
    MYSQL_HOST,":",MYSQL_PORT,"/",
    MYSQL_DATABASE])
print("bd: ",DB_URL)


ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']


AUTH_SERVICE_URL="http://localhost:1337/token"
AUTH_SERVICE_GET_TOKENS_PATH="/api/auth/token"


ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 2
SECRET_JWT_KEY = "dxkhbg5hth56"
SECRET_REFRESH_JWT_KEY = "dxkhbgefrthjyuvligukytrtyug5hth56"

BASE_DIR = Path(__file__).resolve().parent

SERVER_CONFIG = os.path.join(BASE_DIR, "files","server-config.yml")
# DEVICETYPES = os.path.join(BASE_DIR, "files","devTypes.yml")
SCRIPTS_DIR = os.path.join(BASE_DIR, "files","scripts")
# STYLES_DIR = os.path.join(BASE_DIR, "files","styles")
PAGES_DIR =  os.path.join(BASE_DIR, "files","pages")
DEVICES = os.path.join(BASE_DIR, "files","devices.yml")
GROUPS = os.path.join(BASE_DIR, "files","groups.yml")
ROOMS = os.path.join(BASE_DIR, "files","rooms.yml")

MENU_LIST = os.path.join(BASE_DIR, "files", "menu.yml")

TIME_UPPDATA = 6
LENGTHPASS = 10

TIMEZONE = datetime.timezone(datetime.timedelta(hours=3))

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
BACKGROUND_DIR = os.path.join(MEDIA_ROOT, 'backgrounds')

configManager = ModuleConfig(SERVER_CONFIG)
