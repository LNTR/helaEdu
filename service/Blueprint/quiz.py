from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from Models.Student import Student
from Chatbot.main import *
from Models.Quiz import Quiz

quiz = Blueprint("quiz", __name__)
# Look in version history for comments

