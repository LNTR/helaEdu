from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from Models.Student import Student
from Chatbot.main import *
from Models.Quiz import Quiz

chat = Blueprint("chat", __name__)
# Look in version history for comments


@chat.route("/", methods=["POST"])
@chat.route("", methods=["POST"])
# @authenticate
def index():

    request_payload = request.get_json(silent=True)
    prompt = request_payload["prompt"]
    grade = request_payload["grade"]
    subject = request_payload["subject"]
    student_id = request_payload["student_id"]
    chat_session_id = request_payload["chat_session_id"]
    chatbot_response = student_chat_response(
        prompt, grade, subject, student_id, chat_session_id
    )
    response_payload = {
        "response": chatbot_response,
    }

    return jsonify(response_payload)

@chat.route("/all", methods=["POST"])
@chat.route("/all/", methods=["POST"])
# @authenticate
def chat_all():
    request_payload = request.get_json(silent=True)
    prompt = request_payload["prompt"]
    grade = request_payload["grade"]
    subject = request_payload["subject"]
    user_id = request_payload["user_id"]
    chat_session_id = request_payload["chat_session_id"]
    chatbot_response = all_chat_response(
        prompt, grade, subject, user_id, chat_session_id
    )
    response_payload = {
        "response": chatbot_response,
    }

    return jsonify(response_payload)

@chat.route("/history", methods=["POST"])
@chat.route("/history/", methods=["POST"])
# @authenticate
def get_history():
    request_payload = request.get_json(silent=True)
    chat_session_id = request_payload["chat_session_id"]
    chatbot_history = retrieve_history(chat_session_id)
    response_payload = {
        "response": chatbot_history,
    }

    return jsonify(response_payload)

@chat.route("/quizgen", methods=["POST"])
@chat.route("/quizgen/", methods=["POST"])
# @authenticate
def get_quiz():
    request_payload = request.get_json(silent=True)
    subjectId = request_payload["subjectId"]
    subject = request_payload["subject"]
    grade = request_payload["grade"]
    start = request_payload["start"]
    end = request_payload["end"]
    quiz_response = quiz_gen(subjectId, subject, grade, start, end)
    q = Quiz()
    q.quiz = quiz_response["quiz"]
    q.subjectId = subjectId
    q.subject = subject
    q.grade = grade
    q.status = "PENDING"
    q.save()
    print(q.id)
    print(q.key)
    response_payload = {
        "response": quiz_response,
    }


    

    return jsonify(response_payload)

@chat.route("/regen", methods=["POST"])
@chat.route("/regen/", methods=["POST"])
# @authenticate
def get_MCQ():
    request_payload = request.get_json(silent=True)
    subject = request_payload["subject"] 
    grade = request_payload["grade"]
    topic = request_payload["topic"]
    mcq = mcq_gen(subject, grade, topic)
    response_payload = {
        "response": mcq,
    }
    return jsonify(response_payload)


   

@chat.route("/embed", methods=["POST"])
@chat.route("/embed/", methods=["POST"])
# @authenticate
def get_textbook():
    request_payload = request.get_json(silent=True)
    grade = request_payload["grade"]
    subject = request_payload["subject"] 
    toc = request_payload["toc"] 
    type = request_payload["type"]
    embeddings = embeddings_gen(grade, subject, toc, type)
    response_payload = {
        "response": "True",
    }

    return jsonify(response_payload)



@chat.route("/contents", methods=["POST"])
@chat.route("/contents/", methods=["POST"])
# @authenticate
def get_contents():
    request_payload = request.get_json(silent=True)
    grade = request_payload["grade"]
    book_info = request_payload["info"]
    subject = request_payload["subject"] 
    type = request_payload["type"]
    contents = contents_gen(grade, subject, book_info, type)
    response_payload = {
        "response": contents,
    }

    return jsonify(response_payload)

@chat.route("/topics", methods=["POST"])
@chat.route("/topics/", methods=["POST"])
# @authenticate
def get_topics():
    request_payload = request.get_json(silent=True)
    number = request_payload["number"]
    # book_info = request_payload["info"]
    # subject = request_payload["subject"] 
    # type = request_payload["type"]
    topics = topics_gen(number)
    response_payload = {
        "response": topics,
    }

    return jsonify(response_payload)

