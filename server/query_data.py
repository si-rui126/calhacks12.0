## for prompting
import argparse
try:
    from langchain_chroma import Chroma
except ImportError:
    from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.prompts.chat import ChatPromptTemplate
import openai 
from dotenv import load_dotenv
import os
import json

## for keyword extraction
import nltk
nltk.download('stopwords')
nltk.download('punkt')
from rake_nltk import Rake
import re

################### query data function ###################
def query_data(query_text, class_name=None, subject=None):
    load_dotenv()
    openai.api_key = os.environ['OPENAI_API_KEY'] # Fetch API key

    CHROMA_PATH = "chroma"

    PROMPT_TEMPLATE = """
    You MUST generate EXACTLY 20 questions. You are required to create 20 collegiate level practice questions using the provided reference materials. Do NOT stop early - generate all 20 questions.

    IMPORTANT: You must create question_1, question_2, question_3 ... through question_20. Create EXACTLY 20 questions, no fewer.

    RETURN ONLY VALID JSON. Your entire reply must be a single JSON object with NO additional text before or after it. The questions should be varied, broad, specific enough to convey nuanced conceptual ideas without being unfairly specific. The questions should be based only on the following context. Using this context, generate questions that test deep understanding of the material. 

    Context:
    {context}

    The generated questions must strictly follow the JSON template format given below. Note that answerA-D should be replaced with actual possible answer choices instead of literally "answerA", the same should be done for "question_1","question_2","question_3". In each question, you must always indicate the correct answer by prefixing it with "correct~~", incorrect answers with "incorrect~~". 
    
    You MUST generate exactly 20 questions labeled as "question_1", "question_2", "question_3", ... "question_20". Each question must have 4 answer choices following JSON format. 
    
    Start your response with {{ (opening brace) and end with }} (closing brace). Return ONLY the JSON, nothing else.
   {{
  "quiz_data": {{
    "question_1": {{
      "question": "Actual question text here",
      "answers": {{
        "answer1": "correct~~Answer A",
        "answer2": "incorrect~~Answer B",
        "answer3": "incorrect~~Answer C",
        "answer4": "incorrect~~Answer D"
      }}
    }},
    "question_2": {{
      "question": "…",
      "answers": {{
        "answer1": "incorrect~~…",
        "answer2": "correct~~…",
        "answer3": "incorrect~~…",
        "answer4": "incorrect~~…"
      }}
    }},
    ...
    "question_20": {{
      "question": "…",
      "answers": {{
        "answer1": "incorrect~~…",
        "answer2": "correct~~…",
        "answer3": "incorrect~~…",
        "answer4": "incorrect~~…"
      }}
    }}
  }}
}}

    """
    #################### Preparing and searching vector database ####################
    # Prepare the database.
    try:
        embedding_function = OpenAIEmbeddings()
        db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    except Exception as e:
        response_text = f"Error initializing database: {str(e)}"
        print(response_text)
        return response_text

    # Search the database.
    try:
        results = db.similarity_search_with_relevance_scores(query_text, k=5)  # Increased k for better context
        if len(results) == 0:
            response_text = "Unable to find matching results in the vector database. Please upload reference materials first."
            print(response_text)
            return {"error": response_text}
        
        # Filter results by relevance score
        relevant_results = [result for result in results if result[1] >= 0.3]  # Lower threshold for more results
        if len(relevant_results) == 0:
            response_text = "No relevant content found for the query. Please try a different topic or upload more reference materials."
            print(response_text)
            return {"error": response_text}
            
        print(f"Found {len(relevant_results)} relevant results for query: {query_text}")
    except Exception as e:
        response_text = f"Error searching database: {str(e)}"
        print(response_text)
        return {"error": response_text}

    #################### Retrieving and formatting output items ####################
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in relevant_results]) # extracting most relevant context chunk from document database
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE) # formatting prompt template
    prompt = prompt_template.format(context=context_text, question=query_text)

    # retrieving response from OpenAI
    print("\n🤖 Calling OpenAI API to generate quiz...")
    # max_tokens needs to be high enough for 20 questions with full answers
    # Each question with 4 answers can be ~300-400 tokens, so 20 questions needs ~8000 tokens
    # Using GPT-4 for better JSON generation and adherence to requirements
    model = ChatOpenAI(
        model="gpt-4o-mini",  # Use gpt-4o-mini which is cheaper and better for structured outputs
        max_tokens=8000, 
        temperature=0.7
    )
    response_text = model.invoke(prompt) # querying response from model using formatted prompt
    formatted_response = response_text.content
    print(f"📥 Raw response received ({len(formatted_response)} chars)")
    print(f"   First 200 chars: {formatted_response[:200]}...")
    print(f"   Last 200 chars: ...{formatted_response[-200:]}")
   
    # Clean the response to extract just the JSON
    # Sometimes LLMs add markdown code blocks or extra text
    import re
    
    # Try to find JSON within markdown code blocks
    json_in_markdown = re.search(r'```(?:json)?\s*(\{.*\})\s*```', formatted_response, re.DOTALL)
    if json_in_markdown:
        formatted_response = json_in_markdown.group(1)
    
    # Try to find JSON object in the response
    json_match = re.search(r'\{.*\}', formatted_response, re.DOTALL)
    if json_match:
        formatted_response = json_match.group()
    
    # Parse the JSON
    try:
        quiz_data_json = json.loads(formatted_response)
        print("✅ JSON parsed successfully")
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {str(e)}")
        print(f"Response content (first 500 chars): {formatted_response[:500]}")
        return {"error": f"Invalid JSON response from OpenAI: {str(e)}"}
    
    # Add header information with date, class, and subject
    from datetime import datetime
    
    header_json = {
        "date": datetime.now().strftime("%Y-%m-%d"),  # Current date in YYYY-MM-DD format
        "class": class_name if class_name else "",  # Class from user input
        "subject": subject if subject else ""  # Subject from user input
    }
    
    # The LLM should return JSON with nested quiz_data structure
    # Extract the quiz_data from the response
    if "quiz_data" in quiz_data_json:
        quiz_data = quiz_data_json["quiz_data"]
    else:
        # If the LLM returned the data directly without nesting, use it
        quiz_data = quiz_data_json
    
    # Merge header with quiz data to create complete response
    complete_response = {
        "date": header_json["date"],
        "class": header_json["class"],
        "subject": header_json["subject"],
        "quiz_data": quiz_data
    }

    # Validate that quiz_data has the expected structure
    if not isinstance(quiz_data, dict):
        print(f"Warning: quiz_data is not a dict, got {type(quiz_data)}")
        return {"error": "Quiz data format is invalid"}
    
    # Check that we have questions
    question_count = len([k for k in quiz_data.keys() if k.startswith("question_")])
    print(f"\n{'='*80}")
    print(f"📊 Checking generated quiz...")
    print(f"   Found: {question_count} questions")
    print(f"{'='*80}")
    
    # Warning if we don't have 20 questions
    if question_count < 20:
        print(f"⚠️  WARNING: Only {question_count} questions generated, expected 20!")
        print(f"   This might be due to max_tokens being too low or the model stopping early.")
        print(f"   Available questions will be used.")
    elif question_count > 20:
        print(f"⚠️  WARNING: {question_count} questions generated, more than expected 20!")
    
    print(f"\n{'='*80}")
    print(f"✅ QUIZ GENERATED!")
    print(f"{'='*80}")
    print(f"📊 Total questions: {question_count}")
    print(f"📅 Date: {header_json['date']}")
    print(f"🏫 Class: {header_json['class'] or '(None)'}")
    print(f"📚 Subject: {header_json['subject'] or '(None)'}")
    print(f"{'='*80}\n")
    
    # Print all questions and answers
    print("📝 GENERATED QUESTIONS:\n")
    for i, (key, question_data) in enumerate(sorted(quiz_data.items()), 1):
        if key.startswith("question_"):
            print(f"\nQuestion {i}:")
            print(f"  Q: {question_data.get('question', 'No question text')}")
            print(f"  Answers:")
            for ans_key, ans_value in question_data.get('answers', {}).items():
                # Show prefix status
                if ans_value.startswith('correct~~'):
                    print(f"    ✓ {ans_key}: {ans_value.replace('correct~~', '')}")
                elif ans_value.startswith('incorrect~~'):
                    print(f"    ✗ {ans_key}: {ans_value.replace('incorrect~~', '')}")
                else:
                    print(f"    ? {ans_key}: {ans_value}")
    
    print(f"\n{'='*80}\n")
    
    return complete_response

# if __name__ == "__main__":
query_data("ch02-questions.md",)
