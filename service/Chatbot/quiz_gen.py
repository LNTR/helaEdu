from Chatbot.lang_funcs import *
from Chatbot.topics import getKeywords
from Chatbot.question_gen import get_MCQ
from langchain_core.prompts.prompt import PromptTemplate
from langchain_community.llms import Ollama
from operator import itemgetter
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field, validator
import os
from langchain_openai import ChatOpenAI

os.environ["TOKENIZERS_PARALLELISM"] = "false"
# os.environ["OPENAI_API_KEY"] = (
#     "sk-XTR_ACEcOmCAwv5kMsjyd3Jz65Xn24FEgx1yQbxk34T3BlbkFJHPQpYdsp__T_qZCQS8t4j51QEDcogVpKeJwIdXw48A"
# )

# openai_api_key = os.getenv("OPENAI_API_KEY")
llm = Ollama(model="llama3.2:1b", temperature=0)
# llm = ChatOpenAI(model="gpt-4o", temperature=0)

class MCQ(BaseModel):
    id: int = Field(description="The question number")
    question: str = Field(description="The multiple choice question")
    options: list[str] = Field(description="The list of 4 options for the question")
    answer: str = Field(description="The answer from the options list")

    @validator("options")
    def question_with_4_options(cls, field):
        if len(field) != 4:
            raise ValueError("4 options required!")
        return field

class Quiz(BaseModel):
    questions: list[MCQ] = Field(description="The list of multiple choice questions")

parser = JsonOutputParser(pydantic_object=Quiz)

# llm = Ollama(model="llama3.1:8b", temperature=0)

# vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2")

# retriever = vectorstore.as_retriever()
# retriever = vectorstore.as_retriever(search_kwargs={"k": 1, "filter": {"source": "/Users/helaEdu/textbooks/10/Science_I.pdf"}})

template = """You are an expert multiple choice question maker. Given the {context}, it is your job to\
create a quiz of {number} multiple choice questions for students from the given {context}.
Each question must have exactly 4 options and only one option should be the correct answer to the question.
State the correct answer.
Make sure that questions are not repeated and check all the questions to be conforming to the {context} as well.
{format_instructions}
Ensure to make {number} MCQs.
"""
prompt = PromptTemplate(
    template=template,
    input_variables=["context", "number", "grade"],
    partial_variables={"format_instructions": parser.get_format_instructions()},)

quiz_chain_ret = (
    {
        "context": itemgetter("number") ,
        "number": itemgetter("number"),
        "grade": itemgetter("grade"),
    }
    | prompt
    | llm
    | parser
)

def get_quiz(subjectId, subject, grade, start, end, chain=quiz_chain_ret):
    # keywords = getKeywords(subject, grade, start, end)
    keywordList = ["kings in Kandyan Kingdom"]
    quiz = []

    # for keyword in keywordList:
    #     mcq = get_MCQ(subject, grade, "kings in Kandyan Kingdom")
    #     quiz.append(mcq)

    quiz = [
        {
        "question": "What is not a major export crop in Sri Lanka?",
        "options": ["Tea", "Rubber", "Vegetables", "Paddy"],
        "answer": "Vegetables",
        "id": 1,
        },
        {
        "question": "When was a rubber first planted in Sri Lanka?",
        "options": ["1890", "1790", "1892", "1895"],
        "answer": "1890",
        "id": 2,
        },
        {
        "question": "What is not a main area where graphite is found in Sri Lanka?",
        "options": ["Southern", "Sabaragamuwa", "North Western", "Western"],
        "answer": "Western",
        "id": 3,
        },
        {
        "question": "What is not a significant feature of paddy cultivation?",
        "options": [
            "It is a staple food of Sri Lankans",
            "It provides raw materials for many industries",
            "It is a Production of organic fertilizer",
            "It is popular among many countries",
        ],
        "answer": "It is popular among many countries",
        "id": 4,
        },
        {
        "question": "What is a vegetable grown in dry zone?",
        "options": ["Potatoes", "Drumsticks", "Long beans", "Carrot"],
        "answer": "Drumsticks",
        "id": 5,
        },
    ]

    output = {
        "quiz": quiz
    }
    return output