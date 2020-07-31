'''
This script sets up flask and configures its working with sqlalchemy
'''
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.orm.attributes import instance_state
from sqlalchemy.inspection import inspect
from onesignal_sdk.client import Client

#initialising flask object
APP = Flask(__name__)
CORS(APP)
APP.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://projectar:pjtr@pgUserp@$$@35.225.121.217:5432/projectar'
# consumes lot of memory: set to false
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#initialising database with flask object
DB = SQLAlchemy(APP)

#initialising onesignal client for notifications
ONESIGNAL_CLIENT = Client(app_id="88669c69-3692-49b8-9458-93694b80eeef", rest_api_key="MTBiY2U2YmYtMGJiOS00NTM3LTgzZGMtMDAzMDhjNTQ2NDAx")

class Serializer(object):

    def serialize(self, ignore=[]):
        d = list(instance_state(self).unloaded)
        return {c: None if (c in d or c in ignore) else (getattr(self, c).serialize() if issubclass(type(getattr(self, c)), DB.Model) else getattr(self, c)) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() if m is not None else {} for m in l]
