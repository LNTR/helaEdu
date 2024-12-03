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

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "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"
os.environ["LANGCHAIN_ENDPOINT"]="https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"]="helaEdu"

llm = Ollama(model="llama3.2:1b", temperature=0)

def extract_text_from_page(pdf_file, page_number_list):
    # Open the PDF file in binary read mode
    with open(pdf_file, 'rb') as file:
        # Create a PDF reader object
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page_number in page_number_list:
            # Check if the page number is valid
            if page_number < 1 or page_number > len(pdf_reader.pages):
                raise ValueError("Invalid page number")
            
            # Extract text from the specified page (note that page numbers are zero-indexed)
            page = pdf_reader.pages[page_number - 1]
            text = text + page.extract_text()
    
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
Ensure all the chapters are included in the list, and the chapters in each pdf is in the ascending.

Exclude chapters such as "Glossary","Index", "Appendix", "Preface", "Foreword", "Acknowledgments", "Bibliography", "Dedication", "Prologue", "Epilogue", "References", "Table of Contents (TOC)", and "Introduction" as these might not contain core educational content. Exclude sub-chapters as well, sub-chapters will be represented in floating numbers most of the time, for example: 1.1, 1.2, 2.1, 2.2.
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


def get_contents(book, toc_page_list):
    toc_text = extract_text_from_page(book, toc_page_list)
    response = toc_chain.invoke({"toC": toc_text})
    # return toc_text
    return response


def contents(grade, subject, book_data, type):
    contents = {}
    for index, book in enumerate(book_data, start=1):
        part_no = book['book_part']
        toc_page = book['toc']
        file_path = f"/Users/helaEdu/resources/{type}/{grade}/{subject}_{part_no}.pdf"
        contents_of_book = get_contents(file_path, toc_page)
        contents[index] = contents_of_book
    return contents
