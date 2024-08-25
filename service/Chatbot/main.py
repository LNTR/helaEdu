from Chatbot.chatbot_student import chat_response
from Chatbot.retrieve_history import chat_history
from Chatbot.quiz_gen import get_quiz
from Chatbot.embeddings import embed

def student_chat_response(query, grade, subject, student_id, chat_session_id):
    response = chat_response(query, grade, subject, student_id, chat_session_id)
    return response

def retrieve_history(session_id):
    return chat_history(session_id)

def quiz_gen(grade, number):
    return get_quiz(number, grade)

def embeddings_gen(grade, subject, book_data):
    return embed(grade, subject, book_data)


# def main():
#     output = student_chat_response(
#         "what are the problems of them?", "10", "Maths", "2323", "chat1"
#     )
#     print(output)


# if __name__ == "__main__":
#     main()
