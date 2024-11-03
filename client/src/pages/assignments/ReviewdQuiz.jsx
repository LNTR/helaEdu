import { Footer, Header } from '@components/common';
import React,{useState,useEffect} from 'react';
import AverageScoreChart from '@components/assignments/AverageScoreChart';
import TopScore from '@components/assignments/TopScore';
import Participants from '@components/assignments/Participants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { getAssignment } from '@services/AssignmentService';
export default function ReviewdQuiz() {
    const averageScore=65;
    const data=useParams();
    const assignmentId=data.assignmentId;
    const [assignmentData,setAssignmentData]=useState(null);
    console.log("Id",data.assignmentId);

    useEffect(() => {
      if (assignmentId) {
          getAssignment(assignmentId).then(data => {
              setAssignmentData(data.data);
              console.log(assignmentData);
          }).catch(error => {
              console.error("Failed to fetch assignment data:", error);
          });
      }
  }, [assignmentId]);

  if (!assignmentData) {
      return <div>Loading...</div>;
  }
  return (
    <div>
      <Header />
      <div className="min-h-screen">
        <div className='mx-64 my-14'>
          <div className=" flex justify-start space-x-6 ">
            <div className="">
              <h1 className='text-blue'>{assignmentData.title}</h1>
              <div className='flex justify-start mt-3'>
                <p className='text-black mr-10 '><FontAwesomeIcon icon={faCalendar}  className='mx-5'/> {assignmentData.
publishedTimestamp}</p>
                <p className='text-black mx-10'><FontAwesomeIcon icon={faClock}  className='mx-5'/>{assignmentData.totalTime}</p>
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
           <Participants assignmentId={assignmentId}/>
        </div>

      </div>
      <Footer />
    </div>
  );
}
