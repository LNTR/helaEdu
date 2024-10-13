import React from 'react'
import QuizBegin from '@components/attemptAssignment/QuizBegin';
import { useParams } from 'react-router-dom';

const Quiz = () => {
  const { assignmentId } = useParams(); 
  console.log("assignmentId:", assignmentId);

  return (
    <>
      {assignmentId ? (
        <QuizBegin assignmentId={assignmentId} />
      ) : (
        <div>Assignment ID not found in the URL.</div>
      )}
    </>
  );
};

export default Quiz;
