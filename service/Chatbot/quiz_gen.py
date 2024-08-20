import json
from Chatbot.lang_funcs import *
# from langchain.chat_models import ChatOpenAi
from langchain_core.runnables.base import RunnableSequence
from langchain_core.prompts.prompt import PromptTemplate
from langchain_community.llms import Ollama
from langchain.chains.sequential import SequentialChain
from langchain_core.runnables import RunnablePassthrough
from operator import itemgetter
from langchain_core.output_parsers import StrOutputParser
 

RESPONSE_JSON = {
    "1": {
        "no": "1",
        "mcq": "multiple choice question",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here",
        },
        "correct": "correct answer",
    },
    "2": {
        "no": "2",
        "mcq": "multiple choice question",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here",
        },
        "correct": "correct answer",
    },
    "3": {
        "no": "3",
        "mcq": "multiple choice question",
        "options": {
            "a": "choice here",
            "b": "choice here",
            "c": "choice here",
            "d": "choice here",
        },
        "correct": "correct answer",
    },
}

llm = Ollama(model="orca-mini", temperature=0)

retriever = load_vectorstore(embedding_model="all-MiniLM-L6-v2")

 
 
template = """You are an expert MCQ maker. Given the {context}, it is your job to\
create a quiz of {number} multiple choice questions for grade {grade} students.
Make sure that questions are not repeated and check all the questions to be conforming to the {context} as well.
Make sure to format your response like the JSON .\
Ensure to make the {number} MCQs.
"""
prompt = ChatPromptTemplate.from_template(template)

quiz_chain_ret = (
    {
        "context": itemgetter("number") | retriever,
        "number": itemgetter("number"),
        "grade": itemgetter("grade"),
    }
    | prompt
    | llm
    | StrOutputParser()
)

def get_quiz(number, grade, chain=quiz_chain_ret):
    
    response = chain.invoke({"number": number, "grade": grade})
    print (number, grade)
    # response = quiz_chain_ret.invoke({"number": "3", "grade": "10"}) 
    # # response =quiz_chain_ret.invoke({"question": "where did harrison work", "language": "italian"})


    return response








if __name__ == "__main__":
    output = get_quiz(10, 10, quiz_chain_ret)
    

    print(output)