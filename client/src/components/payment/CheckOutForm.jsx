import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    try {
      // Request the backend to create a PaymentIntent
      const res = await fetch(
        "http://localhost:8081/payment/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 5000 }), // Amount in cents
        }
      );

      const { clientSecret } = await res.json();

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4 shadow-lg rounded-lg bg-base-100">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Complete Your Payment
      </h2>
      <CardElement
        className="p-3 border rounded-md mb-4"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#fa755a" },
          },
        }}
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm mb-4">Payment successful!</p>
      )}

      <button
        className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
        onClick={handlePayment}
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : "Pay $50"}
      </button>
    </div>
  );
};

export default CheckoutForm;
