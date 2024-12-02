import React , {useState,useEffect} from 'react'
import ReputationG from '@components/reputation/ReputationG'
import VotesG from '@components/reputation/VotesG'
import BronzeBadge from '@assets/icons/bronzeBadge.svg'
import SilverBadge from '@assets/icons/silverBadge.svg'
import GoldBadge from '@assets/icons/goldBadge.svg'
import { listTeacherDetails } from '@services/TeacherService'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

export default function ActivityList() {
const [teacherDetails, setTeacherDetails] = useState(null); 
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await listTeacherDetails(headers);
        setTeacherDetails(response.data); 
        console.log(response);
      } catch (error) {
        console.error('Error fetching teacher details:', error);
      }
    };

    fetchTeacherDetails();
  }, []);
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
    <div className='mx-10 mt-10'>
        <div className='flex justify-start '>
        {/* <div  className='w-full mx-10'>
            <div className='flex justify-between'>
                <p className='my-5'>Reputations</p>
                <p className='text-right text-blue  px-10 text-xl py-3 my-5 cursor-pointer'>See more</p>
            </div>
            <div className='rounded-xl shadow-xl  h-96 my-5 px-4 '>
                <div className='flex justify-start'>
                    <div className='w-1/2'>
                        <ReputationG/>  
                    </div>
                    <div className='w-1/2 mx-10'>
                       
                        
                        <div className='rounded-xl  shadow-xl h-56 my-20 px-5 py-3 text-xl '>
                            <div className='flex justify-start '>
                                <div className='rounded-lg bg-blue w-12 h-8 p-1 text-white '> +10</div>
                                <div className='mx-4 p-2'>This article is amazing</div>
                            </div>
                            <div className='flex justify-start '>
                                <div className='rounded-lg bg-blue w-12 h-8 p-1 text-white '> +10</div>
                                <div className='mx-4 p-2'>What are the main componennts of this system?describe more</div>
                            </div>
                            <div className='flex justify-start '>
                                <div className='rounded-lg bg-blue w-12 h-8 p-1 text-white '> +10</div>
                                <div className='mx-4 p-2'>I gain more valuable insights from this</div>
                            </div>
                            <div className='flex justify-start '>
                                <div className='rounded-lg bg-blue w-12 h-8 p-1 text-white '> +10</div>
                                <div className='mx-4 p-2'>This content has so many valuable things</div>
                            </div>
                            
                       
                        </div>
                    </div>
                    
                </div>    
            </div>
        </div> */}
        {/* <div  className='w-1/2 mx-10'>
            <div className='flex justify-between'>
                <p className='my-5'>Votes</p>
                <p className='text-right text-blue  px-10 text-xl py-3 my-5 cursor-pointer'>See more</p>
            </div>
           
            <div className='rounded-xl shadow-xl  h-96 my-5 px-4  '>
                <VotesG/>
            </div>
        </div> */}
      </div>

      
      <div className='w-full mx-10'>
        <p className='my-5'>Badges</p>
        <div className='flex justify-start'>
            <div className='rounded-xl w-1/3 h-56 shadow-xl mx-7'>
            <div className='flex justify-center items-center my-9'>
                <img src={GoldBadge} className='w-20 h-20' />
            </div>
            <p className='text-center'>
                {badgeCounts.Gold > 0
                ? `You have ${badgeCounts.Gold} gold badge${badgeCounts.Gold > 1 ? 's' : ''}.`
                : "You don't have a gold badge yet."}
            </p>
            </div>
            <div className='rounded-xl w-1/3 h-56 shadow-xl mx-7'>
            <div className='flex justify-center items-center my-9'>
                <img src={SilverBadge} className='w-20 h-20' />
            </div>
            <p className='text-center'>
                {badgeCounts.Silver > 0
                ? `You have ${badgeCounts.Silver} silver badge${badgeCounts.Silver > 1 ? 's' : ''}.`
                : "You don't have a silver badge yet."}
            </p>
            </div>
            <div className='rounded-xl w-1/3 h-56 shadow-xl mx-7'>
            <div className='flex justify-center items-center my-9'>
                <img src={BronzeBadge} className='w-20 h-20' />
            </div>
            <p className='text-center'>
                {badgeCounts.Bronze > 0
                ? `You have ${badgeCounts.Bronze} bronze badge${badgeCounts.Bronze > 1 ? 's' : ''}.`
                : "You don't have a bronze badge yet."}
            </p>
            </div>
        </div>
        </div>

    </div>
  )
}
