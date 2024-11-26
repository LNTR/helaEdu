export const getSubscriptionsByDate = (startDate, endDate) => {
    const subscriptions = [
      { date: "2024-11-20", userType: "Student", count: 10, revenue: 100 },
      { date: "2024-11-21", userType: "Student", count: 15, revenue: 150 },
      { date: "2024-11-22", userType: "Student", count: 7, revenue: 70 },
      { date: "2024-11-23", userType: "Student", count: 20, revenue: 200 },
    ];
  
    const filteredSubscriptions = subscriptions.filter(
      (sub) =>
        new Date(sub.date) >= new Date(startDate) &&
        new Date(sub.date) <= new Date(endDate)
    );
  
    const totalSubscriptions = filteredSubscriptions.reduce(
      (total, sub) => total + sub.count,
      0
    );
  
    const totalRevenue = filteredSubscriptions.reduce(
      (total, sub) => total + sub.revenue,
      0
    );
  
    return {
      filteredSubscriptions,
      totalSubscriptions,
      totalRevenue,
    };
  };
  
  export const getUserRegistrationsByDate = (startDate, endDate, userType) => {
    const registrations = [
      { date: "2024-11-20", userType: "Student", count: 12 },
      { date: "2024-11-20", userType: "Teacher", count: 5 },
      { date: "2024-11-21", userType: "Student", count: 18 },
      { date: "2024-11-22", userType: "Moderator", count: 3 },
    ];
  
    return registrations.filter(
      (reg) =>
        new Date(reg.date) >= new Date(startDate) &&
        new Date(reg.date) <= new Date(endDate) &&
        (!userType || reg.userType === userType)
    );
  };
  