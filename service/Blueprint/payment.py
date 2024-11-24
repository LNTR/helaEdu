from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore


payment = Blueprint("payment", __name__)


import stripe

# Stripe Secret Key
stripe.api_key = "sk_test_51PuWsmJGIQLjgkiJQ82OFFFfWaq52JhHUZLIIyt17VZ1sZoE8ygJkbDR5D5TRnocHyblAmzM0hCKOqwCbkxONMft00M96ZIT35"


@payment.route("/create-payment-intent", methods=["POST"])
def create_payment_intent():
    try:
        # Get amount from frontend (ensure it's in cents)
        data = request.json
        amount = data["amount"]

        # Create a PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            automatic_payment_methods={
                "enabled": True,
            },
        )

        return jsonify({"clientSecret": intent["client_secret"]})
    except Exception as e:
        return jsonify(error=str(e)), 400
