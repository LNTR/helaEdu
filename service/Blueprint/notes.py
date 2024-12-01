from flask import Blueprint, request, jsonify
from utils import authenticate
from Models.Student import Student


notes = Blueprint("notes", __name__)


@notes.route("/view/<subject_id>", methods=["GET"])
@authenticate
def view_subject_note(data, subject_id):
    try:
        email = data["sub"]
        subject_id = subject_id.replace("-", "_").replace("/", "_")
        user: Student = Student.find_by_email(email)
        note_content = ""
        if subject_id in user.subjectNoteList.keys():
            note_content = user.subjectNoteList[subject_id]

        return jsonify({"note_content": note_content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@notes.route("/update/<subject_id>", methods=["POST"])
@authenticate
def update_subject_note(data, subject_id):
    try:
        subject_id = subject_id.replace("-", "_").replace("/", "_")
        request_payload = request.get_json(silent=True)
        new_content = request_payload["content"]
        email = data["sub"]
        user: Student = Student.find_by_email(email)
        user.subjectNoteList = {
            **dict(user.subjectNoteList),
            subject_id: new_content,
        }
        user.update()

        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
