from flask import Flask, jsonify, redirect

from Blueprint.chat import chat
from Blueprint.status_codes import status_codes
from Blueprint.articles import articles
from Blueprint.payment import payment
from Blueprint.chat import chat
from flask_cors import CORS


import fireo


def create_app():
    app = Flask(__name__)
    CORS(app, resources={"/*": {"origins": "*"}})
    fireo.connection(from_file="config/firebase-service-account.json")
    app.config.from_pyfile("setting.py")

    app.register_blueprint(chat, url_prefix="/chat")
    app.register_blueprint(articles, url_prefix="/articles")
    app.register_blueprint(payment, url_prefix="/payment")
    app.register_blueprint(status_codes, url_prefix="")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8081)
