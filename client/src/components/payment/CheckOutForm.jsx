import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import {
  subscribeToMonthlyPlan,
  subscribeToYearlyPlan,
} from "@services/PaymentService";
import { useReactAuthKit } from "react-auth-kit/AuthContext";
import { jwtDecode } from "jwt-decode";
const PAYMENT_ACK_API = `${import.meta.env.VITE_SERVICE_API}/payment/success`;

const CheckoutForm = ({ setIsModalOpen, planType = "Monthly" }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authValue } = useReactAuthKit();
  const jwtToken = authValue.auth.token;
  const loggedInUserId = jwtDecode(jwtToken).sub;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${PAYMENT_ACK_API}?student_id=${loggedInUserId}&planType=${planType}`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4 shadow-lg rounded-lg bg-base-100">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Complete Your Payment
      </h2>
      <form onSubmit={handlePayment}>
        <PaymentElement
          className="mb-4"
          options={{
            layout: "tabs", // Layout options: 'tabs' or 'accordion'
          }}
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mb-4">Payment successful!</p>
        )}

        <button
          type="submit"
          className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
          disabled={!stripe || isLoading}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
