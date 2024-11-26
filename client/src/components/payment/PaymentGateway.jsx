import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@components/payment/CheckOutForm";
import {
  subscribeToMonthlyPlan,
  subscribeToYearlyPlan,
} from "@services/PaymentService";

const stripePromise = loadStripe(
  "pk_test_51PuWsmJGIQLjgkiJVy6MNIgKVp6CPmW56L1EVKCSYmbO2uLkz9mv5ootnv49w3FDVCCQICjV1gsrw439034YyG5Z00GRJSJWjM"
);

function PaymentGateway({ setIsModalOpen, planType }) {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        let res;
        if (planType === "Monthly") {
          res = await subscribeToMonthlyPlan();
        } else {
          res = await subscribeToYearlyPlan();
        }

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Error fetching clientSecret:", err);
      }
    };

    fetchClientSecret();
  }, [planType]);

  const appearance = {
    theme: "stripe", // You can customize this theme
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!clientSecret) {
    return <div>Loading payment options...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm setIsModalOpen={setIsModalOpen} planType={planType} />
    </Elements>
  );
}

export default PaymentGateway;
