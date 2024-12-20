from Chatbot.lang_funcs import *
from Chatbot.lang_funcs import HumanMessage, AIMessage
from langchain_community.llms import Ollama
from langchain_core.prompts.chat import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_history_aware_retriever
from langchain_openai import ChatOpenAI
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from operator import itemgetter
import os
from langchain.chains.query_constructor.base import AttributeInfo
from langchain.retrievers.self_query.base import SelfQueryRetriever

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "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"
os.environ["LANGCHAIN_ENDPOINT"]="https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"]="helaEdu"

llm = Ollama(model="llama3.2:1b", temperature=0)

def retrieve_docs(grade, subject):
    vectorstore_path = f"chatbot/vectorstore/{grade}"
    vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2", storing_path=vectorstore_path)
    source = f"{subject} textbook - Grade {grade}"

    # print(source)
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={'k': 3, 'filter': {'subject':subject}})
    return retriever

def check_docs(query, grade, subject):
    vectorstore_path = f"chatbot/vectorstore/{grade}"
    vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2", storing_path=vectorstore_path)
    documents = vectorstore.similarity_search(query)
    print(" of check_docs", len(documents))
    return documents

def run_chain(retriever, chat_session_id, user_id, prompt):
    retriever_with_history = add_history(llm, retriever)

    system_prompt = (
        "You are an assistant for question-answering tasks for school students."
        "Use the retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know."
        "Give your answer clearly and concisely."
        "\n\n"
        "{context}"
    )

    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    rag_chain = create_chain(retriever_with_history, llm, qa_prompt)
    conversational_rag_chain = create_conversational_chain(rag_chain, chat_session_id)
    response = get_response(prompt, conversational_rag_chain, chat_session_id, user_id)
    return response


def chat_response(prompt, grade, subject, student_id, chat_session_id):
    if not chat_session_id:
        chat_session_id = generate_chat_id()

    print("chat_id", chat_session_id)
    documents = check_docs(prompt, grade, subject)
    print(len(documents))
    retrieved_docs = retrieve_docs(grade, subject)
    if (len(documents)<=0):
        output = {"prompt": prompt,
                  "answer": "Sorry your question seems to be irrelevent to your syllabus. I'd be happy to answer any questions related to your syllabus.",
                  "references": False
                  }
    else:

        response= run_chain(retrieved_docs, chat_session_id, student_id, prompt)
        output = {
            "prompt": prompt,
            "answer": response["answer"],
            "references": None if any(phrase in response["answer"].lower() for phrase in ["don't know", "do not know"]) else get_references(response["context"]),
            "chat_id": chat_session_id
        }

    return output
