"""@package docstring
Initialization for Mapping Service
"""
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)

# a workaround to circular imports
# Reference: https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world
from app import routes, models

db.create_all()
