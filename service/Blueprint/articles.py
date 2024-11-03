from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from Models.Articles import Article
from Components.Articles.constructor import (
    recreate_model as _recreate_model,
    _get_related_articles,
)


articles = Blueprint("articles", __name__)


@articles.route("/<article_id>/approve", methods=["GET"])
@articles.route("/<article_id>/approve/", methods=["GET"])
def approve_article(article_id):
    article = Article.collection.get(article_id)
    article.approve()
    article.classify_article()
    article.update()
    return jsonify({"message": "update complete"})


@articles.route("/recreate-model", methods=["GET"])
@articles.route("/recreate-model/", methods=["GET"])
def recreate_model():
    _recreate_model()
    return jsonify({"message": "Model recreated"})


@articles.route("/get-recommendation", methods=["GET"])
@articles.route("/get-recommendation/<cluster>", methods=["GET"])
def get_reccomendation(cluster):
    articles = _get_related_articles(cluster)
    return jsonify(articles)
