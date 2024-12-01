from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from Models.Student import Student


notes = Blueprint("notes", __name__)


@notes.route("/view/<subject_id>", methods=["GET"])
@authenticate
def view_subject_note(data, subject_id):
    try:
        email = data["sub"]
        user: Student = Student.find_by_email(email)
        note_content = user.subjectNoteList[subject_id]

        return jsonify({"note_content": note_content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@notes.route("/update/<subject_id>", methods=["POST"])
@authenticate
def update_subject_note(data, subject_id):
    try:
        new_content = request.json()["content"]
        email = data["sub"]
        user: Student = Student.find_by_email(email)
        user.subjectNoteList[subject_id] = new_content
        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
