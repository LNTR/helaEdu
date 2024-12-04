import datetime
from utils import authenticate
from firebase_admin import firestore
from Models.Student import Student
from Chatbot.main import *
from Models.Quiz import Quiz
from datetime import datetime, timedelta


def update_upcoming_quiz():

    today = datetime.now()
    next_monday = today + timedelta(days=(6 - today.weekday()))
    next_monday_str = next_monday.strftime("%Y-%m-%d")
    print(next_monday_str)
    quizzes_list = list(
        Quiz.collection.filter("identifier", "==", next_monday_str).fetch()
    )

    for quizzes in quizzes_list:
        if quizzes.status == "REVIEWED":
            quizzes.status = "OPENED"
        quizzes.update()
