import os
from langchain_community.llms import Ollama
from typing_extensions import List, TypedDict
from langchain_core.documents import Document
from langchain_core.prompts.prompt import PromptTemplate
from operator import itemgetter
# from langgraph.graph import StateGraph
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from Chatbot.lang_funcs import * 
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.messages import SystemMessage, HumanMessage



system_prompt="""You are an expert at understanding and analyzing text contents. Based on the given context, identify 10 distinct keywords that encapsulate the key concepts in the context.
    Each keyword should be related to the given subject.

    Use the provided context exclusively to determine the keywords.

    **Additional Instructions:**
    1. Validate that context contains meaningful content before proceeding.
    2. Ensure keywords are directly derived from {context} and not speculative.
    3. If  than 10 keywords are identified, prioritize the most relevant ones based on their frequency, prominence, or significance in the context.

    Provide the keywords in the given format
    format: {format_instructions}
    subject: {subject}
    context: {context}
    
    """

# prompt = PromptTemplate.from_template(template)

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "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"
os.environ["LANGCHAIN_ENDPOINT"]="https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"]="helaEdu"

llm = Ollama(model="llama3.2:1b", temperature=0)

class Keyword(BaseModel):
    Keyword: str = Field(description="A keywords in the text")

class KeywordList(BaseModel):
    KeywordList: list[Keyword] = Field(description="The list of keywords in the text")

    @validator("KeywordList")
    def validate_keyword_list(cls, value):
        # Check for duplicate keywords
        keywords = [keyword.Keyword for keyword in value]
        if len(keywords) != len(set(keywords)):
            raise ValueError("KeywordList contains duplicate keywords.")
        return value
parser = JsonOutputParser(pydantic_object=KeywordList)


def retrieve(grade, subject):  
    vectorstore_path = f"chatbot/vectorstore/{grade}"
    vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2", storing_path=vectorstore_path)
    retrieved_docs = vectorstore.similarity_search('', filter= {'subject' : subject})

    return {"context": retrieved_docs}

prompt = PromptTemplate(
    template=system_prompt,
    input_variables=["context", "subject"],
    partial_variables={"format_instructions": parser.get_format_instructions()},)

topics_chain_ret = (
    {
        "context": itemgetter("context"),
        "subject": itemgetter("subject"),
    }
    | prompt
    | llm
    | parser
)


def getKeywords(subject, grade, start, end, chain=topics_chain_ret):
    retriever = retrieve(grade, subject)

    documents = retriever.get('context', [])
    docs_text = ""
    for index, doc in enumerate(documents, start=1):
        print(f"Document {index}:")
        print("Metadata:", doc.metadata)
        print("Page Content:", doc.page_content)
        print("\n" + "-" * 50 + "\n")
        docs_text += doc.page_content

    response = chain.invoke({"context": retriever,"subject": subject})
    return response
