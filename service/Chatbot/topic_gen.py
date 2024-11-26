from Chatbot.lang_funcs import *
from langchain_core.prompts.prompt import PromptTemplate
from langchain_community.llms import Ollama
from operator import itemgetter
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field, validator
 
llm = Ollama(model="llama3.2:1b", temperature=0)

class SubArea(BaseModel):
    subArea: str = Field(description="A subarea in the text")

class SubAreaList(BaseModel):
    topics: list[SubArea] = Field(description="The list of sub-areas in the text")

parser = JsonOutputParser(pydantic_object=SubAreaList)

vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2")

def retrieve_content(grade, subject, start_page, end_page):
    vectorstore = load_vectorstore(embedding_model="all-MiniLM-L6-v2")

    page_filter = {
        "source": "/Users/helaEdu/textbooks/10/Geography.pdf",
        "page": {"$gte": start_page, "$lte": end_page}  # Filter for the page range
    }
    
    # retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3, "filter": {f"{subject} textbook - Grade {grade}"}})
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3, "filter": page_filter})
     
    return retriever

def topic_gen_chain(grade, subject, number, start_page, end_page):
    retriever = retrieve_content(grade, subject, start_page, end_page)
    print(retriever)

    template = """You are an expert at understanding and analyzing text contents. Based on the following {text}, identify {number} distinct sub-areas that encapsulate the key concepts in the context.

    Use the provided `{text}` exclusively to determine the sub-areas. Do not reference or infer from examples unless explicitly instructed.

    For example, if the text is about export crops and mentions major and minor export crops, the sub-areas might be "major export crops" and "minor export crops." 
    This example is illustrative only and should not influence your analysis of `{text}`.

    **The identified sub-areas should:**
    1. Represent a significant aspect of the content.
    2. Be concise and clear.
    3. Focus on different areas to ensure broad coverage of the material.

    **Additional Instructions:**
    1. Validate that `{text}` contains meaningful content before proceeding.
    2. Ensure sub-areas are directly derived from `{text}` and not speculative.
    3. If  than {number} sub-areas are identified, prioritize the most relevant ones based on their frequency, prominence, or significance in `{text}`.

    Provide the sub-areas in the {format_instructions} format.

    """
    prompt = PromptTemplate(
        template=template,
        input_variables=["text", "number"],
        partial_variables={"format_instructions": parser.get_format_instructions()})

    topic_chain = (
        {
            "text": retriever,
            "number": itemgetter("number"),
        }
        | prompt
        | llm
        | parser
    )
    # print(topic_chain)
    return topic_chain.invoke({"number": number})
    # return True


def get_topics(number):
    
    response = topic_gen_chain(10, "Geography", number, start_page=1, end_page=13)
    return response

# if __name__ == "__main__":
#     output = get_topics(topic_chain, 10)