import React, { useState, useEffect } from 'react';
import Sidebar from '@components/admin/Sidebar';
import { Header, Footer } from '@components/common';
import Pagination from '@components/admin/Pagination';
import TableRowSubscription from '@components/admin/TableRowSubscription';
import { getSubscribersList } from '@services/AdminService';
import { getStudentById } from '@services/StudentService';

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const response = await getSubscribersList(); 
        const subscriptionList = response.data.subscription_list; 

        const updatedSubscriptions = await Promise.all(
          subscriptionList.map(async (subscription) => {
            const userDetails = await getStudentById(subscription.userId);
            console.log(userDetails);
            return {
              ...subscription,
              userName: `${userDetails.data.firstName} ${userDetails.data.lastName}`,
            };
          })
        );

        setSubscriptions(updatedSubscriptions);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, []);

  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);
  const paginatedSubscriptions = subscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-wrapper">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="content-wrapper">
            <h1 className="mx-32 my-14">Subscriptions</h1>

            <div className="subscription-list">
              {paginatedSubscriptions.length > 0 ? (
                paginatedSubscriptions.map((subscription) => (
                  <TableRowSubscription
                    key={subscription.subscriptionId}
                    subscriptionId={subscription.subscriptionId}
                    name={subscription.userName}
                   
                    status={subscription.planType }
                  />
                ))
              ) : (
                <p>No subscriptions available.</p>
              )}
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
