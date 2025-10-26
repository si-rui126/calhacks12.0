from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from query_data import query_data
from processing.pdf_to_md import pdf_to_md
from create_database import generate_data_store
from database import app  # Import the Flask app from database.py

@app.route('/')
def home():
    return jsonify({"status": "Flask server is running on port 8080 and i love coding"})

@app.route('/', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        user_id = request.form.get('user_id', 'demo')
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Save the file to docs directory (where pdf_to_md expects it)
        filename = file.filename
        docs_dir = 'processing/docs'
        os.makedirs(docs_dir, exist_ok=True)
        file_path = os.path.join(docs_dir, filename)
        file.save(file_path)
        
        # Process the file (convert PDF to markdown)
        try:
            pdf_to_md(filename)  # pdf_to_md expects just the filename, not full path
            result = {"message": f"File {filename} uploaded and processed successfully", "user_id": user_id}
            print(f"✅ SUCCESS: {filename} processed successfully for user: {user_id}")
        except Exception as e:
            result = {"error": f"Processing error: {str(e)}"}
            print(f"❌ ERROR: Failed to process {filename} - {str(e)}")
        
        # Clean up temp file
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": f"Upload error: {str(e)}"}), 500

@app.route('/convert_pdf_to_md_to_response', methods=['POST'])
def convert_pdf_to_md_to_response():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Save the file to docs directory (where pdf_to_md expects it)
        filename = file.filename
        docs_dir = 'processing/docs'
        os.makedirs(docs_dir, exist_ok=True)
        file_path = os.path.join(docs_dir, filename)
        file.save(file_path)
        
        print(f"📁 File uploaded: {filename} (saved to {file_path})")
        
        try:
            # Convert PDF to markdown
            print(f"📄 Converting {filename} to markdown...")
            pdf_to_md(filename)  # pdf_to_md expects just the filename, not full path
            
            # Update the database with new content
            print(f"🔄 Updating database with new content...")
            import time
            time.sleep(1)  # Small delay to avoid file locking issues
            generate_data_store()
            
            # Query the data
            print(f"🤖 Querying data for {filename}...")
            result = query_data("Generate practice questions from the uploaded content", class_name="", subject="")
            
            response_data = {
                "message": f"Converted {filename} to markdown and queried data successfully.",
                "query_result": str(result.content) if hasattr(result, 'content') else str(result)
            }
            
            print(f"✅ SUCCESS: {filename} converted and processed successfully")
            print(f"📊 Generated quiz data: {str(result.content)[:100]}..." if hasattr(result, 'content') else f"📊 Generated quiz data: {str(result)[:100]}...")
            
        except Exception as e:
            response_data = {"error": f"Processing error: {str(e)}"}
            print(f"❌ ERROR: Failed to process {filename} - {str(e)}")
        
        # Clean up temp file
        if os.path.exists(file_path):
            os.remove(file_path)
            
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({"error": f"Conversion error: {str(e)}"}), 500

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("query", "")
    class_name = data.get("class_name", "")
    subject = data.get("subject", "")
    
    # ===== FOR DEMO/PROTOTYPE (saves credits) =====
    # Uncomment below to use the real query_data function:
    # response = query_data(user_input, class_name, subject)
    # return jsonify(response)
    
    # Demo response for testing (comment out when using real query_data):
    from datetime import datetime
    formatted_response = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "class": class_name,
        "subject": subject,
        "quiz_data": {
            "question_1": {
                "question": f"What is a key concept in {subject}?",
                "answers": {
                    "answer1": "correct~~Option A",
                    "answer2": "incorrect~~Option B",
                    "answer3": "incorrect~~Option C",
                    "answer4": "incorrect~~Option D"
                }
            },
            "question_2": {
                "question": f"Which of the following relates to {subject}?",
                "answers": {
                    "answer1": "incorrect~~Wrong Answer 1",
                    "answer2": "correct~~Correct Answer",
                    "answer3": "incorrect~~Wrong Answer 2",
                    "answer4": "incorrect~~Wrong Answer 3"
                }
            },
            "question_3": {
                "question": f"In {subject}, what is most important?",
                "answers": {
                    "answer1": "incorrect~~Not Important",
                    "answer2": "incorrect~~Somewhat Important",
                    "answer3": "correct~~Very Important",
                    "answer4": "incorrect~~Not Relevant"
                }
            },
            "question_4": {
                "question": f"What does {subject} teach us?",
                "answers": {
                    "answer1": "correct~~Fundamental Concepts",
                    "answer2": "incorrect~~Nothing Useful",
                    "answer3": "incorrect~~Only Theory",
                    "answer4": "incorrect~~Basic Facts"
                }
            },
            "question_5": {
                "question": f"How is {subject} applied in practice?",
                "answers": {
                    "answer1": "incorrect~~It's Not Applied",
                    "answer2": "incorrect~~Only in Theory",
                    "answer3": "incorrect~~Rarely Used",
                    "answer4": "correct~~In Real-World Scenarios"
                }
            }
        }
    }

    print("user said: "+user_input)
    print("class:", class_name, "subject:", subject)
    print("assistant response:", formatted_response)

    return jsonify({"response": formatted_response})

@app.route('/api/pdf_to_md_to_response/<pdf>', methods=['GET'])
def convert_pdf_to_md_to_response_get(pdf):
    try:
        # call the pdf_to_md function imported from processing
        pdf_to_md(pdf)
    except Exception as e:
        return jsonify({"error": f"Conversion error: {str(e)}"}), 500

    try:
        # call the query_data function imported from query_data
        result = query_data("Generate practice questions", class_name="", subject="")
    except Exception as e:
        return jsonify({"error": f"Query error: {str(e)}"}), 500

    return jsonify({
        "message": f"Converted {pdf} to markdown and queried data successfully.",
        "query_result": str(result)
    })
app.run(port=8080, debug=False, use_reloader=False, threaded=False)
