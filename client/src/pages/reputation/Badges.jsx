import React, { useState, useEffect } from 'react';
import { Header, Footer } from '@components/common';
import BronzeBadge from '@assets/icons/bronzeBadge.svg';
import SilverBadge from '@assets/icons/silverBadge.svg';
import GoldBadge from '@assets/icons/goldBadge.svg';
import ActivityBar from '@components/reputation/ActivityBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import BadgePopup from '@components/reputation/BadgePopup';
import { listTeacherDetails } from '@services/TeacherService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import LoadingComponent from '@components/common/LoadingComponent';

export default function Badges() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loadingState,setLoadingState] = useState(false);
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const openBadgeList = () => {
    setIsPopupOpen(true);
  };

  const closeBadgeList = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      
      try {
       
        const response = await listTeacherDetails(headers);
        setTeacherDetails(response.data);
        console.log(response);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
      }finally{
        setLoadingState(false);
      }
    };

    fetchTeacherDetails();
  }, [headers]);

  const renderBadge = (type) => {
    if (teacherDetails && teacherDetails.badges && teacherDetails.badges.length > 0) {
      return teacherDetails.badges
        .filter((badge) => badge.badgeType === type)
        .map((badge, index) => (
          <div key={index} className="rounded-xl border border-blue2 h-12 w-72 my-3 px-2 flex items-center relative">
            <div className="w-8 h-8">
              {badge.badgeType === 'Gold' && <img src={GoldBadge} alt={badge.badgeName} />}
              {badge.badgeType === 'Silver' && <img src={SilverBadge} alt={badge.badgeName} />}
              {badge.badgeType === 'Bronze' && <img src={BronzeBadge} alt={badge.badgeName} />}
            </div>
            <span className="ml-8 text-2xl">{badge.badgeName}</span>
          </div>
        ));
    } else {
      return <p className="text-2xl text-center">No badges</p>;
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        {loadingState ? <LoadingComponent/> : null}
        <div className="dashboard-wrapper mb-9">
          <div className="sidebar-wrapper">
            <ActivityBar />
          </div>
          <div className="content-wrapper mx-36">
            {isPopupOpen && (
              <dialog open className="modal">
                <div className="modal-box max-w-7xl p-10">
                  <BadgePopup onClose={closeBadgeList} />
                </div>
              </dialog>
            )}

            <h1 className="my-10 mx-10">Badges</h1>
            <p className="text-2xl mx-10 pb-10">These are the badges you have earned by engaging in activities</p>

            <div className="flex justify-start mx-10 my-5">
              <div className="w-1/3 border border-blue rounded-xl px-10 py-4 mx-8">
                <p>Gold Badges</p>
                <div className="my-16 h-128">
                  {renderBadge('Gold')}
                </div>
                <div className="flex justify-end">
                  <p className="text-2xl">Next Badge</p>
                  <div className="rounded-xl bg-black px-3 py-2 flex justify-between mx-5 cursor-pointer">
                    <div className="w-8 h-8 ml-1">
                      <img src={BronzeBadge} alt="Bronze Badge" />
                    </div>
                    <span className="ml-3 text-xl text-white">Contributor</span>
                  </div>
                  <div className="tooltip" data-tip="See all badges that you can earn" onClick={openBadgeList}>
                    <FontAwesomeIcon icon={faGear} className="size-7 pt-3" />
                  </div>
                </div>
              </div>

              <div className="w-1/3 border border-blue rounded-xl px-10 py-4 mx-8">
                <p>Silver Badges</p>
                <div className="my-16 h-128">
                  {renderBadge('Silver')}
                </div>
                <div className="flex justify-end">
                  <p className="text-2xl">Next Badge</p>
                  <div className="rounded-xl bg-black px-3 py-2 flex justify-between mx-5 cursor-pointer">
                    <div className="w-8 h-8 ml-1">
                      <img src={BronzeBadge} alt="Bronze Badge" />
                    </div>
                    <span className="ml-3 text-xl text-white">Contributor</span>
                  </div>
                  <div className="tooltip" data-tip="See all badges that you can earn" onClick={openBadgeList}>
                    <FontAwesomeIcon icon={faGear} className="size-7 pt-3" />
                  </div>
                </div>
              </div>

              <div className="w-1/3 border border-blue rounded-xl px-10 py-4 mx-8">
                <p>Bronze Badges</p>
                <div className="my-16 h-128">
                  {renderBadge('Bronze')}
                </div>
                <div className="flex justify-end">
                  <p className="text-2xl">Next Badge</p>
                  <div className="rounded-xl bg-black px-3 py-2 flex justify-between mx-5 cursor-pointer">
                    <div className="w-8 h-8 ml-1">
                      <img src={BronzeBadge} alt="Bronze Badge" />
                    </div>
                    <span className="ml-3 text-xl text-white">Contributor</span>
                  </div>
                  <div className="tooltip" data-tip="See all badges that you can earn" onClick={openBadgeList}>
                    <FontAwesomeIcon icon={faGear} className="size-7 pt-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
