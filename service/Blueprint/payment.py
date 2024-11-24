from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore


payment = Blueprint("payment", __name__)


import stripe

stripe.api_key = "sk_test_51PuWsmJGIQLjgkiJQ82OFFFfWaq52JhHUZLIIyt17VZ1sZoE8ygJkbDR5D5TRnocHyblAmzM0hCKOqwCbkxONMft00M96ZIT35"


@payment.route("/create-payment-intent", methods=["POST"])
def create_payment_intent():
    try:
        data = request.json
        price_id = data.get("priceId")  # Expecting Price ID from frontend

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
