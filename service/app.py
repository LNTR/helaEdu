from flask import Flask, jsonify, redirect

from Blueprint.chat import chat
from Blueprint.status_codes import status_codes
from Blueprint.articles import articles
from Blueprint.payment import payment
from Blueprint.chat import chat
from Blueprint.notes import notes
from Blueprint.subject import subjects
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from scheduler_function import update_upcoming_quiz

import fireo

scheduler = BackgroundScheduler()


def create_app():
    global scheduler
    scheduler.add_job(
        update_upcoming_quiz, CronTrigger(day_of_week="mon", hour=0, minute=0)
    )
    scheduler.start()

    app = Flask(__name__)
    CORS(app, resources={"/*": {"origins": "*"}})
    fireo.connection(from_file="config/firebase-service-account.json")
    app.config.from_pyfile("setting.py")

    app.register_blueprint(subjects, url_prefix="/subjects")
    app.register_blueprint(notes, url_prefix="/notes")
    app.register_blueprint(chat, url_prefix="/chat")
    app.register_blueprint(articles, url_prefix="/articles")
    app.register_blueprint(payment, url_prefix="/payment")
    app.register_blueprint(status_codes, url_prefix="")

    return app


if __name__ == "__main__":
    try:
        app = create_app()
        app.run(debug=True, port=8081)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
