from flask import Blueprint, request, jsonify
from utils import authenticate
from firebase_admin import firestore
from os import environ
from Models.Student import Student
from Models.Subscriptions import Subscriptions
from dotenv import load_dotenv
from datetime import datetime
from dateutil.relativedelta import relativedelta
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
    intent = request.args.get("payment_intent")
    email = request.args.get("student_id")
    plan_type = request.args.get("planType")

    student: Student = Student.collection.filter("email", "==", email).get()

    start_time = datetime.today()
    end_time = datetime(
        start_time.year + int(start_time.month / 12), ((start_time.month % 12) + 1), 1
    )

    new_subscription = Subscriptions(
        canceled=False,
        endTimestamp=end_time.isoformat(),
        startTimestamp=start_time.isoformat(),
        userId=student.userId,
        subscriptionId=intent,
        planType=plan_type,
    )

    student.subscriptionId = intent

    student.update()
    new_subscription.save()

    return jsonify({"success": True})


@payment.route("/subscribers", methods=["GET"])
def get_all_subscribers():
    all_subscriptions = [
        {
            "userId": subscription.userId,
            "subscriptionId": subscription.subscriptionId,
            "canceled": subscription.canceled,
            "startTimestamp": subscription.startTimestamp,
            "endTimestamp": subscription.endTimestamp,
            "planType": subscription.planType,
        }
        for subscription in Subscriptions.collection.fetch()
    ]

    return jsonify({"subscription_list": all_subscriptions})
