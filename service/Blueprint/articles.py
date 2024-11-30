from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from Models.Articles import Article
from Components.Articles.setup import (
    recreate_model as _recreate_model,
    _get_related_articles,
)


articles = Blueprint("articles", __name__)


@articles.route("/<article_id>/approve", methods=["GET"])
@articles.route("/<article_id>/approve/", methods=["GET"])
def approve_article(article_id):
    article: Article = Article.collection.get(article_id)
    article.approve()
    article.classify_article()
    article.update()
    return jsonify({"message": "update complete"})


@articles.route("/recreate-model", methods=["GET"])
@articles.route("/recreate-model/", methods=["GET"])
def recreate_model():
    _recreate_model()
    return jsonify({"message": "Model recreated"})


@articles.route("/get-recommendation/<article_id>", methods=["GET"])
@articles.route("/get-recommendation/<article_id>/", methods=["GET"])
def get_reccomendation(article_id):
    articles = _get_related_articles(article_id)
    return jsonify(articles)
