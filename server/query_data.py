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
def query_data(query_text):
    load_dotenv()
    openai.api_key = os.environ['OPENAI_API_KEY'] # Fetch API key

    CHROMA_PATH = "chroma"

    PROMPT_TEMPLATE = """
    Your job is to generate a set of 20 collegiate level practice questions using the provided reference materials. The questions should be varied, broad, specific enough to convey nuanced conceptual ideas without being unfairly specific. The question should be based only on the following context. Using this context, generate questions that test deep understanding of the material. :

    {context}

    The generated question should strictly follow the JSON template format given below. Note that answerA-D should be replaced with actual possible answer choices instead of literally "answerA", the same should be done for "question_1-20". In each question, you must always indicate the correct answer by prefixing it with "correct~~", incorrect answers with "incorrect~~", short answer responses with "shortanswer~~". 
    
    With the set of 20 questions, label each question as "question_1", "question_2", etc. Store the questions and their corresponding answer choices in the following JSON format. Remeber to replace the placeholder text with actual questions and answers you generate based on the context:
    {{  
        "quiz_data" : {{
            "question_1": {{
        "question": "Actual_question_text_here",
        "answers": {{
            "answer1": "correct~~answerA",
            "answer2": "incorrect~~answerB",
            "answer3": "incorrect~~answerC",
            "answer4": "incorrect~~answerD"
        }}
    }},
    ...    "question_20": {{
        "question": "Actual_question_text_here",
        "answers": {{
            "answer1": "incorrect~~answerA",
            "answer2": "correct~~answerB",
            "answer3": "incorrect~~answerC",
            "answer4": "incorrect~~answerD"
        }}
    }}
    ---

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
        results = db.similarity_search_with_relevance_scores(query_text, k=3)
        if len(results) == 0 or results[0][1] < 0.5:
            response_text = "Unable to find matching results."
            print(response_text)
            return response_text
    except Exception as e:
        response_text = f"Error searching database: {str(e)}"
        print(response_text)
        return response_text

    #################### Retrieving and formatting output items ####################
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results]) # extracting most relevant context chunk from document database
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE) # formatting prompt template
    prompt = prompt_template.format(context=context_text, question=query_text)

    # retrieving response from OpenAI
    model = ChatOpenAI(max_tokens=2000) # initializing OpenAI model
    response_text = model.invoke(prompt) # querying response from model using formatted prompt
    formatted_response = response_text.content

    print(formatted_response)

    return response_text

# if __name__ == "__main__":
query_data("ch02-questions.md")
