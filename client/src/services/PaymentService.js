import axios from "axios";
const PAYMENT_API = `${
  import.meta.env.VITE_SERVICE_API
}/payment/create-payment-intent`;

const MONTHLY_PRICE_ID = `${import.meta.env.VITE_MONTHLY_PRICE_ID}`;
const YEARLY_PRICE_ID = `${import.meta.env.VITE_YEARLY_PRICE_ID}`;

export const subscribeToMonthlyPlan = () =>
  axios.post(PAYMENT_API, {
    priceId: MONTHLY_PRICE_ID,
  });

export const subscribeToYearlyPlan = () =>
  axios.post(PAYMENT_API, {
    priceId: YEARLY_PRICE_ID,
  });
