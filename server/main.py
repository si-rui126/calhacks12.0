from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from query_data import query_data
from processing import pdf_to_md

app = Flask(__name__)
cors = CORS(app, origins='*')

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
        except Exception as e:
            result = {"error": f"Processing error: {str(e)}"}
        
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
        
        try:
            # Convert PDF to markdown
            pdf_to_md(filename)  # pdf_to_md expects just the filename, not full path
            
            # Query the data
            result = query_data("Generate practice questions from the uploaded content")
            
            response_data = {
                "message": f"Converted {filename} to markdown and queried data successfully.",
                "query_result": str(result.content) if hasattr(result, 'content') else str(result)
            }
            
        except Exception as e:
            response_data = {"error": f"Processing error: {str(e)}"}
        
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
    
    response = query_data(user_input)
    formatted_response = str(response.content)

    print("user said: "+user_input)
    print("assitant response: "+formatted_response)

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
        result = query_data()
    except Exception as e:
        return jsonify({"error": f"Query error: {str(e)}"}), 500

    return jsonify({
        "message": f"Converted {pdf} to markdown and queried data successfully.",
        "query_result": str(result)
    })
app.run(port=8080, debug=False, use_reloader=False, threaded=False)
