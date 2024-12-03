from Chatbot.chatbot_student import chat_response
from Chatbot.chatbot_all import chat_response_all
from Chatbot.retrieve_history import chat_history
from Chatbot.quiz_gen import get_quiz
from Chatbot.embeddings import embed
from Chatbot.contents import contents
from Chatbot.topics import getKeywords
from Chatbot.question_gen import get_MCQ

def student_chat_response(query, grade, subject, student_id, chat_session_id):
    response = chat_response(query, grade, subject, student_id, chat_session_id)
    return response

def all_chat_response(query, grade, subject, user_id, chat_session_id):
    response = chat_response_all(query, grade, subject, user_id, chat_session_id)
    return response

def retrieve_history(session_id):
    return chat_history(session_id)

def quiz_gen(subjectId, subject, grade, topic,moderatorEmail, identifier):
    return get_quiz(subjectId, subject, grade,topic,moderatorEmail, identifier)

def mcq_gen(subject, grade, topic):
    return get_MCQ(subject, grade, topic)
 
def embeddings_gen(grade, subject, toc, type):
    return embed(grade, subject, toc, type)

def contents_gen(grade, subject, book_info, type):
    return contents(grade, subject, book_info, type)

def topics_gen(number):
    return getKeywords(number)




 