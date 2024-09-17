# from lang_funcs import *
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.vectorstores import FAISS
from PyPDF2 import PdfReader, PdfWriter
import os

def load_embedding_model(model_path, normalize_embedding=True):
    return HuggingFaceEmbeddings(
        model_name=model_path,
        model_kwargs={"device": "cpu"},  # here we will run the model with CPU only
        encode_kwargs={
            "normalize_embeddings": normalize_embedding  # keep True to compute cosine similarity
        },
    )

def load_pdf_data(file_path):
    # Creating a PyMuPDFLoader object with file_path
    loader = PyMuPDFLoader(file_path=file_path)

    # loading the PDF file
    docs = loader.load()

    # returning the loaded document
    return docs

def split_docs(documents, chunk_size=1000, chunk_overlap=200):

    # Initializing the RecursiveCharacterTextSplitter with
    # chunk_size and chunk_overlap
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )

    # Splitting the documents into chunks
    chunks = text_splitter.split_documents(documents=documents)

    # returning the document chunks
    return chunks

def create_embeddings(chunks, type, grade, subject):
    storing_path=f"service/Chatbot/vectorstore"
    embedding_model = load_embedding_model(model_path="all-MiniLM-L6-v2")

    os.makedirs(os.path.dirname(storing_path), exist_ok=True) #ensure dir exists
    # Creating the embeddings using FAISS
    if os.path.exists(storing_path):
        # Load the existing vectorstore
        vectorstore = FAISS.load_local(storing_path, embedding_model, allow_dangerous_deserialization=True)
        # Add new embeddings to the existing vectorstore
        # vectorstore.add_documents(chunks)
        vectorstore.add_documents(chunks)
        # Save the updated vectorstore
        print("Updated vectorstore")

    else:
        # Create a new vectorstore
        vectorstore = FAISS.from_documents(chunks, embedding_model)

    # Save the updated vectorstore
    vectorstore.save_local(storing_path)

    return True


# Function for creating embeddings using FAISS
def main():

    embed = load_embedding_model(model_path="all-MiniLM-L6-v2")

    docs = load_pdf_data(
        file_path="/Users/helaEdu/textbooks/10/Maths_II.pdf"
    )

    documents = split_docs(documents=docs)

    vectorstore = create_embeddings(documents, embed)

    return True


if __name__ == "__main__":
    main()


def remove_pages(input_pdf, output_pdf, pages_to_remove):

    reader = PdfReader(input_pdf)
    writer = PdfWriter()

    pages_to_remove = [x-1 for x in pages_to_remove]

    # Add pages to the writer except the ones to remove
    for i in range(len(reader.pages)):
        if i not in pages_to_remove:
            writer.add_page(reader.pages[i])

    # Write the output PDF
    with open(output_pdf, "wb") as out_pdf:
        writer.write(out_pdf)

    return True

def embed(grade, subject, toc, type):
    for part, content in toc.items():
        pdf_path = f"/Users/helaEdu/resources/{type}/{grade}/{subject}_{part}.pdf"
        
         #remove pages
        remove_pages(pdf_path, pdf_path, content['remove_pages'])

        docs = load_pdf_data(file_path=pdf_path) #load doc

        #nameing the source
        if len(toc) > 1:
            source = f"{subject} {type} Part {part} - Grade {grade}"
        elif len(toc) == 1:
            source = f"{subject} {type} - Grade {grade}"

        final_page = len(docs)

        toc = add_chapter_end_page(content['response'], final_page)
        #split chunks
        documents = split_docs(documents=docs) 

        #add new metadata to the chunks
        doc_with_metadata = add_metadata(documents, toc, type, grade, subject, part, source)

        vectorstore = create_embeddings(documents, type, grade, subject)

    return toc

def add_metadata(chunks, toc, type, grade, subject, part, source):
    
    page_with_chapter = chapter_of_the_page(toc)

    for chunk in chunks:
        chunk.metadata['source'] = source
        chunk.metadata['type'] = type
        chunk.metadata['grade'] = grade
        chunk.metadata['subject'] = subject
        chunk.metadata['part'] = part

        page = chunk.metadata['page']
        if page in page_with_chapter:
            chunk.metadata['chapter'] = page_with_chapter[page]      
    return chunks

    

def chapter_of_the_page(toc):
    chapter_of_page = {}
    for chapter in toc:
        for page in range(chapter['start'], chapter['end']+1):
            chapter_of_page[page] = chapter['chapter']
    return chapter_of_page
        
     
def add_chapter_end_page(toc, final_page):
    for index, chapter in enumerate(toc):
        if index < len(toc) - 1:
            chapter['end'] = toc[index + 1]['start'] - 1
        else:
            chapter['end'] = final_page

    return toc

