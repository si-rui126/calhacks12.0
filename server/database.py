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


#add user
def insert_user(user):
    try:
        user_collection.insert_one(user)
        print("File inserted successfully!")
    except Exception as e:
        print("File insertion error:", e)

#delete user
def delete_user(email):
    try:
        user_collection.delete_one({"email": email})
        print("File deleted successfully!")
    except Exception as e:
        print("File deletion error:", e)

#get user
def get_user(email):
    try:
        file = user_collection.find_one({"email": email})
        print("File found:", file)
        return file
    except Exception as e:
        print("File not found:", e)
        return None

#edit user
def edit_user(email, subject, new_info):
    try:
        user_collection.update_one({"email": email}, {"$set": {f"{subject}": new_info}})
        print("User edited successfully!")
        print("User edited:", user_collection.find_one({"email": email})[f"{subject}"])
    except Exception as e:
        print("User edit error:", e)

test = {
    "name": "LlamaGamer69",
    "email": "llamagamer69@gmail.com",
    "password": "Iamcrazygoodatcoding"
}

#add quiz
def insert_quiz(quiz):
    try:
        quiz_collection.insert_one(quiz)
        print("Quiz inserted successfully!")
    except Exception as e:
        print("Quiz insertion error:", e)

#delete quiz
def delete_quiz(quiz_id):
    try:
        quiz_collection.delete_one({"quiz_id": quiz_id})
        print("Quiz deleted successfully!")
    except Exception as e:
        print("Quiz deletion error:", e)

#get quiz
def get_quiz(quiz_id):
    try:
        quiz = quiz_collection.find_one({"quiz_id": quiz_id})
        print("Quiz found:", quiz)
        return quiz
    except Exception as e:
        print("Quiz not found:", e)

#edit quiz. subject is what part you want to edit, ei date, subject, quiz_data. new_info is the new information you want to add.
def edit_quiz(quiz_id, subject, new_info):
    try:
        quiz_collection.update_one({"quiz_id": quiz_id}, {"$set": {f"{subject}": new_info}})
        print("Quiz edited successfully!")
        print("Quiz edited:", quiz_collection.find_one({"quiz_id": quiz_id})[f"{subject}"])
    except Exception as e:
        print("Quiz edit error:", e)



#insert_user(test)
#delete_user(test["email"])
#get_user(test["email"])