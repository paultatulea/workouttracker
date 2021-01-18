from flask import Flask
from flask_cors import CORS
import decimal
import flask.json

class MyJSONEncoder(flask.json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(MyJSONEncoder, self).default(obj)

app = Flask(__name__)
app.json_encoder = MyJSONEncoder
CORS(app)
# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workout.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Stuff
app.config['AUTH_SECRET_KEY'] = 'secretkey'

# Import below initialisation to
# prevent circular referencing
from workouttracker import api