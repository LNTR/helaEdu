import json
# from Chatbot.lang_funcs import *
# from  import *
# from langchain.chat_models import ChatOpenAi
from langchain_core.runnables.base import RunnableSequence
from langchain_core.prompts.prompt import PromptTemplate
from langchain_community.llms import Ollama
from langchain.chains.sequential import SequentialChain
import PyPDF2
import json
import traceback

def parse_file(file_path):
    if file_path.endswith(".pdf"):
        try:
            with open(file_path, "rb") as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
                return text
        except PyPDF2.utils.PdfReadError:
            raise Exception("Error reading the PDF file.")
    
    elif file_path.endswith(".txt"):
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()
    
    else:
        raise Exception(
            "Unsupported file format. Only PDF and TXT files are supported."
        )

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

# retriever = load_vectorstore(embedding_model="all-MiniLM-L6-v2")

template = """
Text: {text}
You are an expert MCQ maker. Given the above text, it is your job to\
create a quiz of {number} multiple choice questions for grade {grade} students in simple and friendly tone.
Make sure that questions are not repeated and check all the questions to be conforming to the text as well.
Make sure to format your response like the RESPONSE_JSON below and use it as a guide.\
Ensure to make the {number} MCQs.
### RESPONSE_JSON
{response_json}
"""

quiz_generation_prompt = PromptTemplate(
    input_variables=["text", "number", "grade", "response_json"],
    template=template,
)

# quiz_chaind = create_chain(retriever, llm, quiz_generation_prompt)

quiz_chain = RunnableSequence(quiz_generation_prompt | llm)

# This is an LLMChain to evaluate the multiple choice questions created by the above chain
template = """You are an expert english grammarian and writer. Given a multiple choice quiz for {grade} grade students.\
You need to evaluate complexity of the questions and give a complete analysis of the quiz if the students 
will be able to understand the questions and answer them.\
If quiz is not at par with the cognitive and analytical abilities of the students,\
update the quiz questions which need to be changed and change the tone such that it perfectly fits the students abilities. 
Quiz MCQs:
{quiz}
### RESPONSE_JSON"""

quiz_evaluation_prompt = PromptTemplate(
    input_variables=["grade", "quiz"], template=template
)
review_chain = RunnableSequence(quiz_evaluation_prompt | llm )



def get_quiz(number, grade, chain=quiz_chain):
    # Getting response from chai
    text = parse_file("/Users/helaEdu/client/src/assets/temp/pdfHistory.pdf")

    response = chain.invoke(
        {"text": text, "number": number, "grade": grade, "response_json": json.dumps(RESPONSE_JSON)}
    )
    print(text)

    return response



if __name__ == "__main__":
    output = get_quiz(text, 10, 10, quiz_chain)


    print(output)