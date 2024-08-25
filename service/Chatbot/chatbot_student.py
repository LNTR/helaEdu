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

os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OPENAI_API_KEY"] = (
    "sk-XTR_ACEcOmCAwv5kMsjyd3Jz65Xn24FEgx1yQbxk34T3BlbkFJHPQpYdsp__T_qZCQS8t4j51QEDcogVpKeJwIdXw48A"
)

openai_api_key = os.getenv("OPENAI_API_KEY")
llm = ChatOpenAI(model="gpt-4o")
# llm = Ollama(model="llama3.1:8b", temperature=0)

vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2")
# retriever = vectorstore.as_retriever()
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3, "filter": {"source": "/Users/helaEdu/textbooks/10/Geography.pdf"}})


class relevancy(BaseModel):
    relevant: bool = Field(description="The relevancy to the context")

    @validator("relevant")
    def format(cls, field):
        if type(field) != bool:
            raise ValueError("incorrect return format!")
        return field

parser = JsonOutputParser(pydantic_object=relevancy)


relevancy_prompt = (
    """You are an assistant who anwsers whether a {prompt} is relevant  to the {context} or not."
    Given the {context}, you need to decide whether the {prompt} is relevant to the given to it.
    If the propmt is relavant to the given {context} return True else False. 
    Give your answer as either true or false.
    {format_instructions}"""
)
prompt = PromptTemplate(
    template=relevancy_prompt,
    input_variables=["context", "number", "grade"],
    partial_variables={"format_instructions": parser.get_format_instructions()},)



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

quiz_chain_ret = (
    {
        "context":  itemgetter("grade") | retriever,
        "prompt": itemgetter("prompt"),
    }
    | prompt
    | llm
    | parser
)


def chat_response(prompt, grade, subject, student_id, chat_session_id, chain=quiz_chain_ret, retriever=retriever):

    # conversational_rag_chain = create_conversational_chain(rag_chain, chat_session_id)
    # response = get_response(prompt, conversational_rag_chain, chat_session_id)

    # output = {
    #     "prompt": prompt,
    #     "answer": response["answer"],
    #     "references": get_references(response["context"]),
    # }
    docs = retriever.batch([prompt])

    reference = len(docs)
    if len(docs) == 0:
        reference =  "No relevant documents found"

    print(docs)
    response = chain.invoke({"prompt": prompt, "grade": grade})

    output = {
        "prompt": prompt,
        "response": response,
        "doc": reference,
    }
    return output
