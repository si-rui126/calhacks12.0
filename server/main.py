from nt import device_encoding
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import send_from_directory
import os
from query_data import query_data
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

try:
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client["kaboot"]
    user_collection = db["users"]
    quiz_collection = db["quiz-collection"]
    client.admin.command('ping')
    print("MongoDB connected successfully!")
except Exception as e:
    print("MongoDB connection error:", e)

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/')
def home():
    return jsonify("Flask server is running on port 8080 and i love coding")
    

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("query", "")
    
    response = query_data(user_input)
    formatted_response = str(response.content)

    print("user said: "+user_input)
    print("assitant response: "+formatted_response)

    return jsonify({"response": formatted_response})

if __name__ == "__main__":
    app.run(port=8080, debug=False, use_reloader=False, threaded=False)