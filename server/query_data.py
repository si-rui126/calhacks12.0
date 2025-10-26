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
    Your job is to generate practice questions using the provided files. The question should be based only on the following context:

    {context}

    The generated question should strictly follow this JSON format. In each question, indicate the correct answer by prefixing it with "~~correct~~", incorrect answers with "~~incorrect~~", and short answer responses with "~~shortanswer~~". Make each question unique. and the date should be in MM/DD/YYYY format of the current date.:
    {{   
        "_id": {{
            "$oid": "68fca83b0d8f68b41edfa9b1"
        }},
        "date": "10/25/2025",
        "subject": "Calculus 3 Unit 2",
        "quiz_data" : {{
            "question_1": {{
                "answer1": "~~correct~~answer1",
                "answer2": "~~incorrect~~answer2",
                "answer3": "~~incorrect~~answer2",
                "answer4": "~~incorrect~~answer2"
            }},
            "question_2": {{
                "answer1": "~~incorrect~~answer1",
                "answer2": "~~correct~~answer2",
                "answer3": "~~incorrect~~answer2",
                "answer4": "~~incorrect~~answer2"
            }},
            "question_3": {{
                "answer1": "~~shortanswer~~answer1"
            }}
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
#     query_data('Can you tell me about elastic load balancing?')
