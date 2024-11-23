from Chatbot.lang_funcs import *
from langchain_core.prompts.prompt import PromptTemplate
from langchain_community.llms import Ollama
from operator import itemgetter
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field, validator
import os
from langchain_openai import ChatOpenAI

os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OPENAI_API_KEY"] = (
    "sk-XTR_ACEcOmCAwv5kMsjyd3Jz65Xn24FEgx1yQbxk34T3BlbkFJHPQpYdsp__T_qZCQS8t4j51QEDcogVpKeJwIdXw48A"
)

openai_api_key = os.getenv("OPENAI_API_KEY")
# llm = ChatOpenAI(model="gpt-4o", temperature=0)
llm = Ollama(model="llama3.2:1b", temperature=0)

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

vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2")
retriever = vectorstore.as_retriever()
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
        "context": itemgetter("number") | retriever,
        "number": itemgetter("number"),
        "grade": itemgetter("grade"),
    }
    | prompt
    | llm
    | parser
)

def get_question(chapter, grade, chain):
    
    response = chain.invoke({"number": number, "grade": grade})

    return response

if __name__ == "__main__":
    output = get_quiz(10, 10, quiz_chain_ret)