# Importing the necessary packages
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts.chat import ChatPromptTemplate
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains import create_history_aware_retriever
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_google_datastore import DatastoreChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from google.cloud import datastore
from google.oauth2 import service_account
from langchain_core.messages import (
    HumanMessage as ImportedHumanMessage,
    AIMessage as ImportedAIMessage,
)
import json
import uuid
from langchain_core.messages import BaseMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from langchain_core.runnables import (
    RunnableLambda,
    ConfigurableFieldSpec,
)
project_id = "helaedu-website"

source = open("./config/firebase-service-account.json")
info = json.load(source)
source.close()
db_credentials = service_account.Credentials.from_service_account_info(info)
db_client = datastore.Client(project=project_id, credentials=db_credentials)

cred = credentials.Certificate(info)
app = firebase_admin.initialize_app(cred)
db = firestore.client()

def generate_chat_id():
    #generates a unique chat id
    chat_id = str(uuid.uuid4())  
    return chat_id

#load the PDF file
def load_pdf_data(file_path):
    loader = PyMuPDFLoader(file_path=file_path)
    docs = loader.load()
    return docs


#splitting the documents into several chunks
def split_docs(documents, chunk_size=1000, chunk_overlap=200):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    chunks = text_splitter.split_documents(documents=documents)
    return chunks


# function for loading the embedding model
def load_embedding_model(model_path, normalize_embedding=True):
    return HuggingFaceEmbeddings(
        model_name=model_path,
        model_kwargs={"device": "cpu"},
        encode_kwargs={
            "normalize_embeddings": normalize_embedding  
        },
    )


# Function for creating embeddings using FAISS
def create_embeddings(chunks, embedding_model, storing_path="Chatbot/vectorstore"):
    vectorstore = FAISS.from_documents(chunks, embedding_model)
    vectorstore.save_local(storing_path)
    return vectorstore


def load_vectorstore(embedding_model, storing_path="Chatbot/vectorstore/10"):

    embeddings = load_embedding_model(embedding_model)
    vectorstore = FAISS.load_local(
        storing_path, embeddings, allow_dangerous_deserialization=True
    )
    return vectorstore


def add_history(llm, retriever):
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    return create_history_aware_retriever(llm, retriever, contextualize_q_prompt)


def create_chain(history_aware_retriever, llm, qa_prompt):
    # Creating the chain for Question Answering
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    return rag_chain


class ChatHistory(BaseChatMessageHistory, BaseModel):
    """In memory implementation of chat message history."""
    user_id: str 
    chat_id: str
    messages: List[BaseMessage] = Field(default_factory=list)

    def add_messages(self, messages: List[BaseMessage]) -> None:
        """Add a list of messages to the store"""
        user_id = self.user_id
        chat_id = self.chat_id  
        self.messages.extend(messages)
        message_contents = [{'content': message.content, 'type': message.type} for message in self.messages]
        
        try:
        # Save to Firestore
            db.collection("ChatHistory").document(chat_id).set({"userId": user_id,"messages": message_contents})
        except Exception as e:
            print(f"Error saving to Firestore: {e}")

    def clear(self) -> None:
        self.messages = []

store = {}

def get_session_history(
    user_id: str, conversation_id: str
) -> BaseChatMessageHistory:

    if (user_id, conversation_id) not in store:
        store[(user_id, conversation_id)] = ChatHistory(user_id=user_id, chat_id=conversation_id)

    
    return store[(user_id, conversation_id)]

def create_conversational_chain(rag_chain, session_id):
    
    return RunnableWithMessageHistory(
        rag_chain,
        get_session_history= get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
        history_factory_config=[
            ConfigurableFieldSpec(
                id="user_id",
                annotation=str,
                name="User ID",
                description="Unique identifier for the user.",
                default="",
                is_shared=True,
            ),
            ConfigurableFieldSpec(
                id="conversation_id",
                annotation=str,
                name="Conversation ID",
                description="Unique identifier for the conversation.",
                default="",
                is_shared=True,
            ),
        ],
    )

def retrieve_history(session_id):
    doc_ref = db.collection("ChatHistory").document(session_id)
    history = doc_ref.get()
    document_data = history.to_dict()
    messages = document_data.get('messages', []) 
    if messages:
        print(f"Document data: {messages}")
        return messages
    else:
        print("No such document!")
        return None
   

class HumanMessage:
    def __init__(self, content):
        self.content = content

    def to_dict(self):
        return {"type": "human", "content": self.content}


class AIMessage:
    def __init__(self, content):
        self.content = content

    def to_dict(self):
        return {"type": "ai", "content": self.content}

def serialize_chat_history(chat_history):
    serialized_chat_history = []
    for message in chat_history:
        if isinstance(message, ImportedHumanMessage):
            serialized_chat_history.append(HumanMessage(message.content).to_dict())
        elif isinstance(message, ImportedAIMessage):
            serialized_chat_history.append(AIMessage(message.content).to_dict())
    return serialized_chat_history

def get_references(context):
    references = []
    for document in context:
        reference = {
            "source": document.metadata["source"],
            "page": document.metadata["page"],
            "citation": document.page_content,
            "all": document.metadata,
        }
        references.append(reference)
    return references


def get_response(query, chain, user_session_id, user_id):
    # Getting response from chain
    response = chain.invoke(
        {"input": query},
        config={"configurable": {"user_id": user_id, "conversation_id": user_session_id}},
    )

    return response
