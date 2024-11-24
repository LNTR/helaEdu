import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@components/payment/CheckOutForm";

function PaymentGateway() {
  const PUBLISHABLE_KEY =
    "pk_test_51PuWsmJGIQLjgkiJVy6MNIgKVp6CPmW56L1EVKCSYmbO2uLkz9mv5ootnv49w3FDVCCQICjV1gsrw439034YyG5Z00GRJSJWjM";

  const stripePromise = loadStripe(PUBLISHABLE_KEY);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
export default PaymentGateway;
