from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from os import environ
from dotenv import load_dotenv
import stripe


payment = Blueprint("payment", __name__)

load_dotenv(".env")

SECRET_KEY = environ.get("SECRET_KEY")


stripe.api_key = SECRET_KEY


@payment.route("/create-payment-intent", methods=["POST"])
def create_payment_intent():
    try:
        data = request.json
        price_id = data.get("priceId")

        if not price_id:
            return jsonify({"error": "Price ID is required"}), 400

        price = stripe.Price.retrieve(price_id)

        payment_intent = stripe.PaymentIntent.create(
            amount=price.unit_amount,
            currency=price.currency,
            payment_method_types=["card"],
        )

        return jsonify({"clientSecret": payment_intent.client_secret})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@payment.route("/success", methods=["GET"])
def success_payment():
    return jsonify({"success": "Success"})
