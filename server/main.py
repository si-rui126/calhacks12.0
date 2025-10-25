from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import send_from_directory
import os

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/')
def home():
    return jsonify("Flask server is running on port 8080")

if __name__ == "__main__":
    app.run(port=8080, debug=False, use_reloader=False, threaded=False)