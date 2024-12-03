import os
from langchain_community.llms import Ollama
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from Chatbot.lang_funcs import *
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from operator import itemgetter

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "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"
os.environ["LANGCHAIN_ENDPOINT"]="https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"]="helaEdu"

llm = Ollama(model="llama3.2:1b", temperature=0)

# class MCQ(BaseModel):
#     question: str = Field(description="The multiple choice question")
#     options: list[str] = Field(description="The list of 4 options for the question")
#     answer: str = Field(description="The answer from the options list")

#     @validator("options")
#     def question_with_4_options(cls, field):
#         if len(field) != 4:
#             raise ValueError("4 options required!")
#         return field


class MCQ(BaseModel):
    question: str = Field(description="The multiple-choice question")
    options: list[str] = Field(description="A list of exactly 4 options for the question")
    answer: str = Field(description="The correct answer, which must be one of the options")

    # Validator for options: Ensure there are exactly 4 strings in the list
    @validator("options")
    def validate_options(cls, field):
        if len(field) != 4:
            raise ValueError("The options list must contain exactly 4 strings!")
        if not all(isinstance(option, str) for option in field):
            raise ValueError("Each option must be a string!")
        return field

    # Validator for answer: Ensure the answer is in the options list
    @validator("answer")
    def validate_answer(cls, field, values):
        options = values.get("options", [])
        if field not in options:
            raise ValueError("The answer must be one of the options!")
        return field
parser = JsonOutputParser(pydantic_object=MCQ)


template = """You are an expert educator specializing in creating multiple-choice questions (MCQs). Your goal is to create a high-quality multiple-choice question based on the provided {context}. 

### Instructions:
1. Create a MULTIPLE-CHOICE question that is:
   - Directly relevant to the provided context.
   - Test understanding or application-level knowledge.
   - Suitable for school students.

2. Each multiple-choice question should:
   - Have exactly 4 options, with only one correct answer.
   - Be clear and unambiguous, avoiding overly complex phrasing.

3. Correct Answer:
   - Specify the correct option explicitly.
   - Ensure the options are plausible, so they challenge but do not confuse students.

4. Review:
   - Verify that the question adheres to the provided context and topic.
   - Avoid bias, culturally insensitive language, or misleading information.

### Output:
Return the MCQ in JSON format  {format_instructions}


Context: {context}
Topic: {topic}

"""




def retrieve(grade, subject, topic):  
    vectorstore_path = f"chatbot/vectorstore/{grade}"
    # query = 
    vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2", storing_path=vectorstore_path)
    retrieved_docs = vectorstore.similarity_search(topic, filter= {'subject' : subject})

    return {"context": retrieved_docs}


prompt = PromptTemplate(
    template=template,
    input_variables=["context", "topic"],
    partial_variables={"format_instructions": parser.get_format_instructions()},)



question_chain_ret = (
    {
        "context": itemgetter("context"),
        "topic": itemgetter("topic"),
    }
    | prompt
    | llm 
    | parser
)


def get_MCQ(subject, grade, topic, chain=question_chain_ret):
    retriever = retrieve(grade, subject, topic)

    documents = retriever.get('context', [])
    docs_text = ""
    for index, doc in enumerate(documents, start=1):
        print(f"Document {index}:")
        print("Metadata:", doc.metadata)
        print("Page Content:", doc.page_content)
        print("\n" + "-" * 50 + "\n")
        docs_text += doc.page_content

    response = chain.invoke({"context": docs_text,"topic": topic})
    print(response)
    return response
