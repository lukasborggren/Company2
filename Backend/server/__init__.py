from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from server.config import Config
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db = SQLAlchemy(app)

from server import routes
