import axios from "axios";
const REPORT_GENERATION_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/reports`;

// export const getSubscriptionsByDate = (subscriptions, startDate, endDate) => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   return subscriptions
//     .filter((subscription) => {
//       const subEndDate = new Date(subscription.endTimestamp);
//       const subStartDate = new Date(subscription.startTimestamp);
//       return subEndDate >= start && subStartDate <= end;
//     })
//     .map((subscription) => ({
//       date: subscription.endTimestamp.split("T")[0], 
//       count: 1,
//     }));
// };

export const getSubscriptionsByDate = (startDate, endDate) => {
  const subscriptions = [
    {
      canceled: false,
      endTimestamp: "2024-12-01T00:00:00",
      planType: "Yearly",
      startTimestamp: "2024-11-30",
      subscriptionId: "pi_3QQqPlJGIQLjgkiJ1R5crZMn",
      userId: "st810e88c5-a48a-4ba4-a813-a31db2571bea",
    },
  ];

  if (!subscriptions || !Array.isArray(subscriptions)) {
    throw new Error("Invalid subscription data");
  }

  return subscriptions.filter((sub) => {
    const start = new Date(sub.startTimestamp);
    const end = new Date(sub.endTimestamp);
    return (
      start >= new Date(startDate) &&
      !sub.canceled
    );
  });
};

export const getUserRegistrationsByDate = async (userType, startDate, endDate) => {
  try {
    const response = await axios
      .get(`${REPORT_GENERATION_URL}/`, {
        params: {
          userType,
          startDate,
          endDate,
        },
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    throw error;
  }
};
