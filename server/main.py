from flask import Flask, request, jsonify
from flask import send_from_directory
from query_data import query_data
from database import app  # Import the Flask app from database.py

@app.route('/')
def home():
    return jsonify("Flask server is running on port 8080 and i love coding")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("query", "")
    
    # ===== FOR DEMO/PROTOTYPE (saves credits) =====
    # Uncomment below to use the real query_data function:
    # response = query_data(user_input)
    # formatted_response = str(response.content)
    
    # Demo response for testing (comment out when using real query_data):
    formatted_response = '''
    The answer choices should be stored in this format:
    {
        "_id":{
            "$oid": "68facaasdkfl"
        },
        "date": "10/25/2025",
        "subject": "calculus 3",
        "quiz_data":{
            "question_1":{
                "answer1": "~~correct~~answer1",
                "answer2": "~incorrect~~answer2",
                "answer3": "~~incorrect~~answer3",
                "answer4": "~~incorrect~~answer4",
            },
            "question_2":{
                "answer1": "~~correct~~answer1",
                "answer2": "~incorrect~~answer2",
                "answer3": "~~incorrect~~answer3",
                "answer4": "~~incorrect~~answer4",
            }
        }
    }
    '''

    print("user said: "+user_input)
    print("assistant response: "+formatted_response)

    return jsonify({"response": formatted_response})

if __name__ == "__main__":
    app.run(port=8080, debug=False, use_reloader=False, threaded=False)