import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { currentStudent } from '@services/StudentService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

export default function AttemptedAssignmentList({ quizzes }) {

    const authHeader = useAuthHeader();
    const headers = {
      Authorization: authHeader,
    };
  
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await currentStudent(headers); 
        setUserId(response.data?.userId);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentDetails();
  }, []);

  return (
    <div>
      {quizzes.map((quiz) => (
        <div
          key={quiz.assignmentId}
          className="rounded-xl border border-blue p-4 mb-4 flex justify-between items-center"
        >
          <div>
            <p className="text-pink-600 text-2xl">{quiz.title}</p>
            <p>
              {quiz.started ? (
                <span className="text-2xl text-blue">Opened</span>
              ) : (
                <span className="text-2xl text-red-500">Closed</span>
              )}
              <br />
            </p>
          </div>
          {/* <div> <span className="text-2xl">Created By { convertMillisToISO(quiz.publishedTimestamp)}</span></div> */}
          <div className="flex justify-start">
            <div className="mx-10">
              <span className="bg-green-500 text-white px-3 py-1 rounded-md text-xl">✔ Done</span>
            </div>
            <div className="mx-10">
              {userId ? (
                <Link
                  to={`/questionList/${quiz.assignmentId}/${userId}`}
                  className="rounded-md bg-blue px-3 text-white py-1 text-xl"
                >
                  Review
                </Link>
              ) : (
                <span>Loading...</span> 
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
