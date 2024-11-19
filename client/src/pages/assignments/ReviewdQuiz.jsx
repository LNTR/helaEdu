import React, { useState, useEffect } from 'react';
import { Footer, Header } from '@components/common';
import AverageScoreChart from '@components/assignments/AverageScoreChart';
import TopScore from '@components/assignments/TopScore';
import Participants from '@components/assignments/Participants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { getAssignment } from '@services/AssignmentService';

export default function ReviewdQuiz() {
  const { assignmentId } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const [topScores, setTopScores] = useState([]);
  const [averageScoreCalc, setAverageScoreCalc] = useState(0);

  useEffect(() => {
    if (assignmentId) {
      getAssignment(assignmentId)
        .then((data) => {
          setAssignmentData(data.data);
        })
        .catch((error) => {
          console.error('Failed to fetch assignment data:', error);
        });
    }
  }, [assignmentId]);

  useEffect(() => {
    const scores = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('score_') && key.includes(assignmentId)) {
        const scoreData = JSON.parse(localStorage.getItem(key));
        if (scoreData.assignmentId === assignmentId) {
          scores.push(scoreData);
        }
      }
    }
    scores.sort((a, b) => b.score - a.score); 
    setTopScores(scores.slice(0, 3)); 

    if (scores.length > 0) {
      const total = scores.reduce((acc, curr) => acc + curr.score, 0);
      setAverageScoreCalc((total / scores.length).toFixed(2));
    }
  }, [assignmentId]);

  if (!assignmentData) {
    return <div>Loading...</div>;
  }
  const convertMillisToISO = (millis) => {
    const date = new Date(millis);
    return date.toISOString();
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen">
        <div className="mx-64 my-14">
          <div className="flex justify-start space-x-6">
            <div>
              <p className="text-black text-4xl">{assignmentData.quizzes.questionId}</p>
              <h1 className="text-blue">{assignmentData.title}</h1>
              <div className="flex justify-start mt-3">
                <p className="text-black mr-10">
                  <FontAwesomeIcon icon={faCalendar} className="mx-5" />
                  {convertMillisToISO(assignmentData.publishedTimestamp)}
                </p>
                <p className="text-black mx-10">
                  <FontAwesomeIcon icon={faClock} className="mx-5" />
                  {assignmentData.totalTime}s
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-6 left-60 mt-10">
            <div className="bg-white rounded-xl shadow-lg p-8 w-2/5 text-center">
              <h3 className="text-4xl mb-4">Summary</h3>
              <div className="flex justify-center">
                <AverageScoreChart averageScore={averageScoreCalc} />
              </div>
              <div className="text-center mt-5">
                <p className="text-2xl">Average Score: {averageScoreCalc}%</p>
                <p className="text-2xl">No of Participants: {topScores.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 w-3/5 text-center">
              <TopScore topScores={topScores} /> 
            </div>
          </div>
        </div>

        <div className="px-60 mt-10">
          <Participants assignmentId={assignmentId} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
