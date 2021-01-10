from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workout.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Stuff
app.config['AUTH_SECRET_KEY'] = 'secretkey'

# Import below initialisation to
# prevent circular referencing
from workouttracker import api
