import datetime
from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from Models.Student import Student
from Chatbot.main import *
from Models.Quiz import Quiz
from datetime import datetime

chat = Blueprint("chat", __name__)


@chat.route("/", methods=["POST"])
@chat.route("", methods=["POST"])
@authenticate
def index(data):
    email = data["sub"]
    user: Student = Student.find_by_email(email)
    request_payload = request.get_json(silent=True)
    prompt = request_payload["prompt"]
    grade = request_payload["grade"]
    subject = request_payload["subject"]
    student_id = user.userId
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
@authenticate
def chat_all(data):
    email = data["sub"]
    user: Student = Student.find_by_email(email)

    request_payload = request.get_json(silent=True)
    prompt = request_payload["prompt"]
    grade = request_payload["grade"]
    subject = request_payload["subject"]
    user_id = user.userId
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
@authenticate
def get_history(data):
    request_payload = request.get_json(silent=True)
    chat_session_id = request_payload["chat_session_id"]
    chatbot_history = retrieve_history(chat_session_id)
    response_payload = {
        "response": chatbot_history,
    }

    return jsonify(response_payload)

@chat.route("/quizgen", methods=["POST"])
@chat.route("/quizgen/", methods=["POST"])
@authenticate
def get_quiz(data):
    request_payload = request.get_json(silent=True)
    subjectId = request_payload["subjectId"]
    subject = request_payload["subject"]
    grade = request_payload["grade"]
    topic  = request_payload["topic"]
    moderatorEmail = data["sub"]
    identifier = request_payload["identifier"]

    quiz_response = quiz_gen(subjectId, subject, grade, topic , moderatorEmail, identifier)
    q = Quiz()
    q.quiz = quiz_response["quiz"]
    q.subjectId = subjectId
    q.subject = subject
    q.grade = grade
    q.status = "PENDING"
    q.moderatorEmail = moderatorEmail
    q.identifier = identifier
    q.save()


    quiz_response["quizId"] = q.id
    response_payload = {"response": quiz_response}

#     print(q.id)
#     print(q.key)
#     quiz_response["quizId"] = q.id
#     response_payload = {
#         "response": quiz_response,
#     }


    return jsonify(response_payload)


@chat.route("/regen", methods=["POST"])
@chat.route("/regen/", methods=["POST"])
# @authenticate
def get_MCQ():
    request_payload = request.get_json(silent=True)
    subject = request_payload.get("subject") 
    grade = request_payload.get("grade")
    quizId = request_payload.get("quizId")
    questionId = request_payload.get("questionId")
    # mcq = mcq_gen(subject, grade, topic)
    # Generate dummy MCQ for testing purposes
    mcq = [
        {
            "answer": "Vegetables",
            "id": questionId,
            "options": ["Tea", "Rubber", "Vegetables", "Paddy"],
            "question": "What is not a major export crop in Sri Lanka?",
            "topic": "Agriculture",  
        },
    ]
 
    if mcq:  # Check if the list is not empty
        quiz = Quiz()
        question_data = mcq[0]
        # Use .get() to avoid KeyError
        topic = question_data.get("topic")  

        if quiz.update_question(
            quizId,
            question_data["id"],
            question_data["question"],
            question_data["answer"],
            question_data["options"],
            topic,
        ):
            response_payload = {"response": question_data}
            return jsonify(response_payload)
        else:
            return jsonify({"success": False, "message": "Failed to update question."}),400

@chat.route("/<quiz_id>/review", methods=["GET"])
@chat.route("/<quiz_id>/review/", methods=["GET"])
def approve_quiz(quiz_id):
    quiz: Quiz = Quiz.collection.get(quiz_id)
    quiz.reviewed()
    quiz.update()
    return jsonify({"message": "update complete"})

@chat.route("/get-quiz/<quiz_id>", methods=["GET"])
@chat.route("/get-quiz/<quiz_id>/", methods=["GET"])
def get_quiz_by_Id(quiz_id):
    try:
        quiz: Quiz = Quiz.collection.get(quiz_id)
        if not quiz:
            return jsonify({"success": False, "message": "Quiz not found"}), 404
        quiz_data = {
            "quizId": quiz.id,
            "quiz": quiz.quiz,
            "subjectId": quiz.subjectId,
            "subject": quiz.subject,
            "grade": quiz.grade,
            "status": quiz.status,
            
        }
        
        return jsonify({"success": True, "quiz": quiz_data})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@chat.route("/get-quizzes", methods=["GET"])
@chat.route("/get-quizzes/", methods=["GET"])
@authenticate
def get_quizzes_by_moderator(data):
    try:
        email=data["sub"]
        quizzes = Quiz.collection.filter("moderatorEmail", "==", email).fetch()
        if not quizzes:
            return jsonify({"success": False, "message": "No quizzes found for this moderator"}), 404
        
        quizzes_data = []
        for quiz in quizzes:
            quizzes_data.append({
                "quizId": quiz.id,
                "quiz": quiz.quiz,
                "subjectId": quiz.subjectId,
                "subject": quiz.subject,
                "grade": quiz.grade,
                "status": quiz.status,
                "identifier":quiz.identifier,
                "moderatorEmail":quiz.moderatorEmail
            })
        
        return jsonify({"success": True, "quizzes": quizzes_data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@chat.route("/get-quizzes-by-date/<subject_id>", methods=["GET"])
@chat.route("/get-quizzes-by-date/<subject_id>", methods=["GET"])
@authenticate
def get_quizzes_by_date(data,subject_id):
    try:
        email = data["sub"]
        quizzes = Quiz.collection.filter("moderatorEmail", "==", email).filter("subjectId","==",subject_id).fetch()

        if not quizzes:
            return jsonify({"success": False, "message": "No quizzes found for this moderator"}), 404

        current_date = datetime.now()  
        quizzes_data = []

        for quiz in quizzes:
            identifier_date = datetime.strptime(quiz.identifier, "%Y-%m-%d") 
            if identifier_date > current_date:
                if quiz.status == "PENDING":
                    status_label = "Pending"
                elif quiz.status == "REVIEWED":
                    status_label = "Already Reviewed"
                elif quiz.status =="OPENED":
                    status_label ="Opened"
                else:
                    status_label = "Unknown Status"
            else:
                status_label = "Generate Quiz"

            quizzes_data.append({
                "quizId": quiz.id,
                "quiz": quiz.quiz,
                "subjectId": quiz.subjectId,
                "subject": quiz.subject,
                "grade": quiz.grade,
                "status_label": status_label,
                "identifier": quiz.identifier,
                "moderatorEmail": quiz.moderatorEmail
            })

        return jsonify({"success": True, "quizzes": quizzes_data}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


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


@chat.route("/quiz/<subject_id>", methods=["GET"])
@chat.route("/quiz/<subject_id>/", methods=["GET"])
def getOpenQuiz(subject_id):
    try:
        quiz = Quiz.get_open_quiz(subject_id)
        if quiz:
            return jsonify(quiz), 200
        else:
            return jsonify({"message": "No quiz found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

   
