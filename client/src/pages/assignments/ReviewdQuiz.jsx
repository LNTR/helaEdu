import { Footer, Header } from '@components/common';
import React from 'react';
import Banner from '@assets/img/articles/bannerP.jpg';
import AverageScoreChart from '@components/assignments/AverageScoreChart';
import TopScore from '@components/assignments/TopScore';
import Participants from '@components/assignments/Participants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
export default function ReviewdQuiz() {
    const averageScore=65;
   
  return (
    <div>
      <Header />
      <div className="min-h-screen">
      
        <div className='mx-64 my-14'>
          {/* <img src={Banner} className="w-full h-128 object-cover" alt="Banner" /> */}
          <div className=" flex justify-start space-x-6 ">
            <div className="">
              <h1 className='text-blue'>Geography - weekly remind II</h1>
              <div className='flex justify-start mt-3'>
                <p className='text-black mr-10 '><FontAwesomeIcon icon={faCalendar}  className='mx-5'/> 23/06/2024</p>
                <p className='text-black mx-10'><FontAwesomeIcon icon={faClock}  className='mx-5'/>1 hour</p>
              </div>
            </div>
          </div>
          <div className=" flex justify-center space-x-6 left-60 mt-10">
           
            <div className="bg-white rounded-xl shadow-lg p-8 w-2/5 text-center">
              <h3 className="text-4xl  mb-4">Summary</h3>
              <div className='flex justify-center'>
               <AverageScoreChart averageScore={averageScore} />
              </div>
              <div className="text-center mt-5">
                <p className='text-2xl '>Average Score: 65%</p>
                <p className='text-2xl '>No of Participants: 24</p>
               
               
              </div>
            </div>

            
            <div className="bg-white rounded-xl shadow-lg p-8 w-3/5 text-center">
              <TopScore/>
            </div>
          </div>
        </div>
        <div className='px-60 mt-10'>
           <Participants/>
        </div>

      </div>
      <Footer />
    </div>
  );
}
