from pymongo import MongoClient
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
cors = CORS(app, origins='*')

try:
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client["kaboot"]
    user_collection = db["users"]
    quiz_collection = db["quiz-collection"]
    client.admin.command('ping')
    print("MongoDB connected successfully!")
except Exception as e:
    print("MongoDB connection error:", e)


#add user
def insert_user(user):
    try:
        result = user_collection.insert_one(user)
        print("File inserted successfully!")
        return {"success": True, "id": str(result.inserted_id)}
    except Exception as e:
        print("File insertion error:", e)
        return {"success": False, "error": str(e)}

#delete user
def delete_user(email):
    try:
        result = user_collection.delete_one({"email": email})
        print("File deleted successfully!")
        return {"success": True, "deleted_count": result.deleted_count}
    except Exception as e:
        print("File deletion error:", e)
        return {"success": False, "error": str(e)}

#get user
def get_user(email):
    try:
        file = user_collection.find_one({"email": email})
        if file:
            print("File found:", file)
            file["_id"] = str(file["_id"])  # Convert ObjectId to string
            return {"success": True, "data": file}
        else:
            return {"success": False, "error": "User not found"}
    except Exception as e:
        print("File retrieval error:", e)
        return {"success": False, "error": str(e)}

#edit user
def edit_user(email, subject, new_info):
    try:
        result = user_collection.update_one({"email": email}, {"$set": {f"{subject}": new_info}})
        print("User edited successfully!")
        if result.modified_count > 0:
            updated_user = user_collection.find_one({"email": email})
            return {"success": True, "data": updated_user[f"{subject}"]}
        else:
            return {"success": False, "error": "No changes made"}
    except Exception as e:
        print("User edit error:", e)
        return {"success": False, "error": str(e)}

# Test functions are commented out since we now have Flask routes
# test = {
#     "name": "LlamaGamer69",
#     "email": "llamagamer69@gmail.com",
#     "password": "Iamcrazygoodatcoding"
# }
#insert_user(test)
#delete_user(test["email"])
#get_user(test["email"])

#add quiz
def insert_quiz(quiz):
    try:
        result = quiz_collection.insert_one(quiz)
        print("Quiz inserted successfully!")
        return {"success": True, "id": str(result.inserted_id)}
    except Exception as e:
        print("Quiz insertion error:", e)
        return {"success": False, "error": str(e)}

#delete quiz
def delete_quiz(quiz_id):
    try:
        result = quiz_collection.delete_one({"quiz_id": quiz_id})
        print("Quiz deleted successfully!")
        return {"success": True, "deleted_count": result.deleted_count}
    except Exception as e:
        print("Quiz deletion error:", e)
        return {"success": False, "error": str(e)}

#get quiz
def get_quiz(quiz_id):
    try:
        quiz = quiz_collection.find_one({"quiz_id": quiz_id})
        if quiz:
            print("Quiz found:", quiz)
            quiz["_id"] = str(quiz["_id"])  # Convert ObjectId to string
            return {"success": True, "data": quiz}
        else:
            return {"success": False, "error": "Quiz not found"}
    except Exception as e:
        print("Quiz retrieval error:", e)
        return {"success": False, "error": str(e)}

#edit quiz. subject is what part you want to edit, ei date, subject, quiz_data. new_info is the new information you want to add.
def edit_quiz(quiz_id, subject, new_info):
    try:
        result = quiz_collection.update_one({"quiz_id": quiz_id}, {"$set": {f"{subject}": new_info}})
        print("Quiz edited successfully!")
        if result.modified_count > 0:
            updated_quiz = quiz_collection.find_one({"quiz_id": quiz_id})
            return {"success": True, "data": updated_quiz[f"{subject}"]}
        else:
            return {"success": False, "error": "No changes made"}
    except Exception as e:
        print("Quiz edit error:", e)
        return {"success": False, "error": str(e)}


# ============= FLASK ROUTES =============

# ============= USER ROUTES =============

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        result = insert_user(data)
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<email>', methods=['GET'])
def get_user_route(email):
    """Get user by email"""
    try:
        result = get_user(email)
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<email>', methods=['PUT'])
def update_user(email):
    """Update user field"""
    try:
        data = request.get_json()
        subject = data.get('subject')
        new_info = data.get('new_info')
        
        if not subject or 'new_info' not in data:
            return jsonify({"success": False, "error": "Missing 'subject' or 'new_info' in request"}), 400
        
        result = edit_user(email, subject, new_info)
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<email>', methods=['DELETE'])
def delete_user_route(email):
    """Delete user by email"""
    try:
        result = delete_user(email)
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============= QUIZ ROUTES =============

@app.route('/api/quizzes', methods=['POST'])
def create_quiz():
    """Create a new quiz"""
    try:
        data = request.get_json()
        result = insert_quiz(data)
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/quizzes/<quiz_id>', methods=['GET'])
def get_quiz_route(quiz_id):
    """Get quiz by ID"""
    try:
        result = get_quiz(quiz_id)
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/quizzes/<quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    """Update quiz field"""
    try:
        data = request.get_json()
        subject = data.get('subject')
        new_info = data.get('new_info')
        
        if not subject or 'new_info' not in data:
            return jsonify({"success": False, "error": "Missing 'subject' or 'new_info' in request"}), 400
        
        result = edit_quiz(quiz_id, subject, new_info)
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/quizzes/<quiz_id>', methods=['DELETE'])
def delete_quiz_route(quiz_id):
    """Delete quiz by ID"""
    try:
        result = delete_quiz(quiz_id)
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500