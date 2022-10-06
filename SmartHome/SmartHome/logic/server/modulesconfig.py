from typing import Dict, Optional, List
import yaml, logging
from typing import Callable

logger = logging.getLogger(__name__)

class ModuleConfig(object):
    def __init__(self, file: str):
        self.callbacks = {}
        self.file = file

    def readConfig(self):
        try:
            templates = None
            with open(self.file) as f:
                templates = yaml.safe_load(f)
            if not templates:
                return dict()
            return templates
        except FileNotFoundError as e:
            logger.error(f"file not found. file:{self.file}")
            raise

    async def restartall(self):
        for key in self.callbacks:
            f = self.callbacks[key]
            await f()

    def writeConfig(self, templates: dict):
        with open(self.file, 'w') as f:
            yaml.dump(templates, f, default_flow_style=False)

    def addConfig(self, name:str, data: Dict[str, str], callback: Callable = None):
        templates = self.readConfig()
        if(templates == None):
            return
        block = templates[name]
        if not block:
            block = dict()
        for key in data:
            if key not in block:
                block[key] = data[key]
        templates[name] = block
        self.writeConfig(templates)
        if callback:
            self.callbacks[name] = callback

    def removeConfig(self, name: str):
        self.callbacks.pop(name, None)
        templates = self.readConfig()
        templates.pop(name, None)
        self.writeConfig(templates)

    def getConfig(self, name: str)->Dict[str, str]:
        templates = self.readConfig()
        if name in templates:
            return templates[name]
        return None

    async def set(self, name:str, data: Dict[str, str]):
        templates = self.readConfig()
        block = templates[name]
        if not block:
            block = dict()
        for key in block:
            if key not in data:
                data[key] = block[key]
        templates[name] = data
        self.writeConfig(templates)
        if name in self.callbacks:
            f = self.callbacks[name]
            await f()

    def allConfig(self)->Dict[str, Dict[str, str]]:
        templates = self.readConfig()
        return templates
