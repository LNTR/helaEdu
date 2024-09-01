from Chatbot.lang_funcs import *
from langchain_core.prompts.prompt import PromptTemplate
from langchain_community.llms import Ollama
from operator import itemgetter
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field, validator
import PyPDF2
import os
from typing import List, Dict
from langchain_openai import ChatOpenAI

os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OPENAI_API_KEY"] = (
    "sk-XTR_ACEcOmCAwv5kMsjyd3Jz65Xn24FEgx1yQbxk34T3BlbkFJHPQpYdsp__T_qZCQS8t4j51QEDcogVpKeJwIdXw48A"
)

openai_api_key = os.getenv("OPENAI_API_KEY")
# llm = ChatOpenAI(model="gpt-4o", temperature=0)
llm = Ollama(model="llama3.1:8b", temperature=0)

def extract_text_from_page(pdf_file, page_number):
    # Open the PDF file in binary read mode
    with open(pdf_file, 'rb') as file:
        # Create a PDF reader object
        pdf_reader = PyPDF2.PdfReader(file)
        
        # Check if the page number is valid
        if page_number < 1 or page_number > len(pdf_reader.pages):
            raise ValueError("Invalid page number")
        
        # Extract text from the specified page (note that page numbers are zero-indexed)
        page = pdf_reader.pages[page_number - 1]
        text = page.extract_text()
        
        return text

class Content(BaseModel):
    id: int = Field(description="The chapter number")
    chapter: str = Field(description="The chapter title")
    start: int = Field(description="The chapter starting page")

class TableOfContents(BaseModel):
    TableOfContents: Dict[str, List[Content]] = Field(description="The list of chapters in the table of contents with their starting pages of a pdf")

class TOCofAll(BaseModel):
    response: Dict[str, List[Content]] = Field(description="The list of chapters in the table of contents with their starting of all the PDFs")


parser = JsonOutputParser(pydantic_object=TOCofAll)


template = """You are an expert in analyzing the structure of documents. You are provided with {text}, which is a dictionary obtained from the table of contents page of one or more PDFs. Consider the {text} and create one list of all the chapters present in the {text}. For each chapter, identify the title, starting page number and chapter number. Return the data in a JSON format where each chapter is nested under its corresponding PDF number.

Exclude chapters such as "Glossary","Index", "Appendix", "Preface", "Foreword", "Acknowledgments", "Bibliography", "Dedication", "Prologue", "Epilogue", "References", "Table of Contents (TOC)", and "Introduction" as these might not contain core educational content.. 
The JSON structure should be like this:
{format_instructions}
"""

prompt = PromptTemplate(
    template=template,
    input_variables=["text"],
    partial_variables={"format_instructions": parser.get_format_instructions()},)

toc_chain = (
    {
        "text": itemgetter("toC") 
    }
    | prompt
    | llm
    | parser
)


def get_contents(book, toc_page):
    toc_text = extract_text_from_page(book, toc_page)
    response = toc_chain.invoke({"toC": toc_text})
    # return toc_text
    return response
