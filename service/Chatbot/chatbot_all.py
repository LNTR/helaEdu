from Chatbot.lang_funcs import *
from langchain.chains.query_constructor.base import AttributeInfo
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain_community.llms import Ollama


llm = Ollama(model="orca-mini", temperature=0)

def retrieve_docs():
    vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2")
    print("Vectorstore loaded")
    metadata_field_info = [
    AttributeInfo(
        name="source",
        description="A general description of the book",
        type="string",
    ),
    AttributeInfo(
        name="type",
        description="Whether the document is a textbook, a teacher's guide, or an article",
        type="string",
    ),
    AttributeInfo(
        name="grade",
        description="The grade level of the book",
        type="integer",
    ),
    AttributeInfo(
        name="subject", 
        description="The subject the document belongs to",
        type="string"
    ),
    AttributeInfo(
        name="part", 
        description="Whether the book is part 1, part 2, etc.",
        type="interger"
    ),
    AttributeInfo(
        name="chapter", 
        description="The chapter the document belongs to",
        type="string"
    ),
    ]
    document_content_description = "The school textbooks, teacher's guides, and articles of school students of all subjects and grades"
    # retriever = SelfQueryRetriever.from_llm(
    #     llm,
    #     vectorstore,
    #     document_content_description,
    #     metadata_field_info,
    # )
    # output = retriever.invoke("Contents of geography textbook for grade 10 in page 23")
    # return output
    return True

def chat_response_all(prompt, grade, subject, user_id, chat_session_id):
    if not chat_session_id:
        chat_session_id = generate_chat_id()
    print("Chat session ID: ", chat_session_id)
    retriever = retrieve_docs()
    return retriever