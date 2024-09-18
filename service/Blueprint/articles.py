from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from Models.Articles import Article
from Components.Articles import recreate_model as _recreate_model


articles = Blueprint("articles", __name__)


@articles.route("/<article_id>/approve", methods=["GET"])
@articles.route("/<article_id>/approve/", methods=["GET"])
def approve_article(article_id):
    article = Article.collection.get(article_id)
    article.approve()
    article.update()
    return {}


@articles.route("/recreate-model", methods=["GET"])
@articles.route("/recreate-model/", methods=["GET"])
def recreate_model():
    _recreate_model()
    return {"articles": ""}
