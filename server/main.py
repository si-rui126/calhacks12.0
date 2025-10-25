from flask import request, jsonify
from query_data import query_data
from database import app  # Import the Flask app from database.py

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