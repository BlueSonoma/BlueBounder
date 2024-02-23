from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.run(port=8000, debug=True)
