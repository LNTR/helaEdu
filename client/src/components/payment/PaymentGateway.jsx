import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckOutForm";

function PaymentGateway() {
  const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY;

  const stripePromise = loadStripe(PUBLISHABLE_KEY);
  const options = {
    clientSecret:
      "pi_3PuZltJGIQLjgkiJ0M1fJFLY_secret_oeJx8HDHEozOSGGiS3PbSD5Ft",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
export default PaymentGateway;
