import React, { useEffect, useState } from 'react';
import Vector from '@assets/icons/Vector.svg';
import WhiteBadge from '@assets/icons/whiteBadge.svg';
import BronzeBadge from '@assets/icons/bronzeBadge.svg';
import score from '@assets/icons/score.svg';
import BadgePopup from '@components/reputation/BadgePopup';
import SilverBadge from '@assets/icons/silverBadge.svg';
import GoldBadge from '@assets/icons/goldBadge.svg';
import { listTeacherDetails } from '@services/TeacherService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import LoadingComponent from '@components/common/LoadingComponent';

export default function Summary() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState(null); 
  const [loadingState,setLoadingState] = useState(false);
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  useEffect(() => {
    const fetchTeacherDetails = async () => {
      setLoadingState(true);
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
  }, []);

  const openBadgeList = () => {
    setIsPopupOpen(true);
  };

  const closeBadgeList = () => {
    setIsPopupOpen(false);
  };
  const [badgeCounts, setBadgeCounts] = useState({
    Gold: 0,
    Silver: 0,
    Bronze: 0,
  });
  useEffect(() => {
    if (teacherDetails?.badges?.length) {
      const counts = teacherDetails.badges.reduce(
        (acc, badge) => {
          if (badge.badgeType === 'Gold') acc.Gold++;
          if (badge.badgeType === 'Silver') acc.Silver++;
          if (badge.badgeType === 'Bronze') acc.Bronze++;
          return acc;
        },
        { Gold: 0, Silver: 0, Bronze: 0 }
      );
      setBadgeCounts(counts);
    } else {
      setBadgeCounts({ Gold: 0, Silver: 0, Bronze: 0 });
    }
  }, [teacherDetails]);

  return (
    <div>
       {loadingState ? <LoadingComponent/> : null}
      <div className="flex justify-start">
        {isPopupOpen && (
          <dialog open className="modal">
            <div className="modal-box max-w-7xl p-10">
              <BadgePopup onClose={closeBadgeList} />
            </div>
          </dialog>
        )}

        <div className="rounded-xl shadow-2xl p-3 w-128 h-96 mx-14">
          <div className="rounded-full p-1 w-16 h-16 bg-blue">
            <img src={score} className="w-20 z-50" alt="score icon" />
          </div>
          <p className="text-center px-10 text-2xl">
            <b>Your Total Reputation Points</b>
          </p>
          <p className="text-center text-blue px-10 py-5 text-6xl">
            {teacherDetails?.points ?? '0'}
          </p>
          <p className="text-2xl mt-2 text-center text-gray-500">
            Reputation is how the community thanks you.
          </p>
          <br />
          <p className="text-xl text-center">
            When users upvote your helpful posts, you'll earn reputation and unlock new privileges.
          </p>
        </div>

        <div className="rounded-xl shadow-2xl p-3 w-128 h-96 mx-14">
          <div className="rounded-full p-1 w-16 h-16 bg-blue">
            <img src={WhiteBadge} className="w-20 z-50" alt="white badge" />
          </div>
          <p className="text-center px-10 text-2xl py-3">
            <b>Badges</b>
          </p>
              {["Gold", "Silver", "Bronze"].map((badgeType) => {
            const count = badgeCounts[badgeType] || 0; // Default to 0 if count doesn't exist
            const badgeImage =
              badgeType === "Gold"
                ? GoldBadge
                : badgeType === "Silver"
                ? SilverBadge
                : BronzeBadge;

            return (
              <div
                key={badgeType}
                className="rounded-xl bg-blue2 h-12 mx-4 my-3 flex items-center relative"
              >
                <div className="w-8 h-8 ml-3">
                  <img src={badgeImage} alt={`${badgeType} badge`} />
                </div>
                <span className="ml-40 text-2xl">{count}</span>
              </div>
            );
          })}

        {/* <div className="flex justify-end">
          <p className="text-2xl">Next Badge</p>

          <div
            className="rounded-xl bg-black px-3 py-2 flex justify-between mx-5 cursor-pointer"
            onClick={openBadgeList}
          >
            <div className="w-8 h-8 ml-1">
              <img src={BronzeBadge} alt="next badge" />
            </div>
            <span className="ml-5 text-xl text-white">Top Contributor</span>
          </div>
        </div> */}
      </div>


        <div className="rounded-xl shadow-2xl p-10 w-96 h-96 mx-8">
          <div className="flex justify-center items-center my-9">
            <img src={Vector} className="w-20 h-20" alt="impact icon" />
          </div>
          <p className="text-xl text-center">
            <b>Measure your impact</b>
          </p>
          <p className="text-xl text-center my-6">
            Your posts and helpful actions here help hundreds or thousands of people searching for
            help.
          </p>
        </div>
      </div>
    </div>
  );
}
