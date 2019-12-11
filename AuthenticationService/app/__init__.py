# from flask import Blueprint, Flask
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config.from_object(Config)

jwt = JWTManager(app)
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

from app import routes, models

db.create_all()
