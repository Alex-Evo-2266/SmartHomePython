from pathlib import Path
import os, sys

DB_URL = "mysql+pymysql://roothome:root@localhost:3306/djangoSmartHome"

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
SECRET_JWT_KEY = "dxkhbg5hth56"

BASE_DIR = Path(__file__).resolve().parent.parent

SERVER_CONFIG = os.path.join(BASE_DIR, "files","server-config.yml")
DEVICETYPES = os.path.join(BASE_DIR, "files","devTypes.yml")
SCRIPTS_DIR = os.path.join(BASE_DIR, "files","scripts")
STYLES_DIR = os.path.join(BASE_DIR, "files","styles")
PAGES_DIR =  os.path.join(BASE_DIR, "files","pages")
DEVICES = os.path.join(BASE_DIR, "files","devices.yml")

TIME_UPPDATA = 6

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
