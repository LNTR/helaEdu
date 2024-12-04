from flask import Blueprint, request, jsonify
from utils import authenticate
from Models.Student import Student
from Models.Subjects import Subjects

subjects = Blueprint("subject", __name__)


@subjects.route("/has-enrolled/<subject_id>", methods=["GET"])
@authenticate
def check_enrollments(data, subject_id):

    try:
        email = data["sub"]
        user: Student = Student.find_by_email(email)

        if subject_id in user.enrolledSubjects:
            return jsonify({"success": True, "hasEnrolled": True}), 200
        else:
            return jsonify({"success": True, "hasEnrolled": False}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@subjects.route("/enroll/<subject_id>", methods=["POST"])
@authenticate
def enroll_to_subject(data, subject_id):

    try:
        subject_id = subject_id.replace("-", "_").replace("/", "_")
        email = data["sub"]
        user: Student = Student.find_by_email(email)

        if subject_id in user.enrolledSubjects:
            return jsonify({"success": False, "message": "Already enrolled"}), 400

        user.enrolledSubjects = [*(user.enrolledSubjects or []), subject_id]
        user.update()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Successfully enrolled",
                    "hasEnrolled": True,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@subjects.route("/unenroll/<subject_id>", methods=["POST"])
@authenticate
def unenroll_from_subject(data, subject_id):

    try:
        subject_id = subject_id.replace("-", "_").replace("/", "_")
        email = data["sub"]
        user: Student = Student.find_by_email(email)

        if subject_id not in user.enrolledSubjects:
            return (
                jsonify({"success": False, "message": "Not enrolled in this subject"}),
                400,
            )

        user.enrolledSubjects = [
            sub for sub in user.enrolledSubjects if sub != subject_id
        ]
        user.update()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Successfully unenrolled",
                    "hasEnrolled": False,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@subjects.route("/subjects", methods=["GET"])
@authenticate
def get_subjects(data):
    try:
        email = data["sub"]
        user: Student = Student.find_by_email(email)
        subjects = Subjects.getSubjects(user.enrolledSubjects)
        if (subjects):
            return subjects, 200
        else:
            return jsonify({"success": True, "hasEnrolled": False}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
