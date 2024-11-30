import { Footer, Header } from '@components/common';
import React, { useEffect, useState } from 'react';
import { studentsReviewAssignmentList } from '@services/AssignmentService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import AttemptedAssignmentList from '@components/assignments/AttemptedAssignmentList';

export default function AssignmentView() {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const [quizzes, setQuizzes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await studentsReviewAssignmentList(headers);
        setQuizzes(response.data); 
      } catch (error) {
        setError('Failed to fetch assignments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [authHeader]);

  const convertMillisToISO = (millis) => {
    const date = new Date(millis);
    return date.toISOString();
  };
  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen p-4 px-32">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="min-h-screen p-4 px-32">
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen p-4 px-32">
        <p className="text-4xl mb-4 my-10">Your Resumed Assignments</p>
          {/* <ResumedAssignmentList quizzes={quizzes}/> */}
        <p className="text-4xl mb-4 my-10">Your Attempted Assignments</p>
          <AttemptedAssignmentList quizzes={quizzes}/>
        
      </div>
      <Footer />
    </div>
  );
}
