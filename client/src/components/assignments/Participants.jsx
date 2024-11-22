import React, { useState, useEffect } from 'react';
import TableRowHeaderReviewed from './TableRowHeaderReviewed';
import ReviewedTableRow from '@components/assignments/ReviewedTableRow';
import Pagination from '@components/articles/Pagination';
import { getAssignment } from '@services/AssignmentService';
import { getStudentById } from '@services/StudentService';

export default function Participants({ assignmentId }) {

  const [participants, setParticipants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const assignmentDetails = await getAssignment(assignmentId);
        console.log('Fetched assignment details:', assignmentDetails.data);
        const quizzes = assignmentDetails.data?.quizzes ?? [];
        const studentMarks = assignmentDetails.data?.studentMarks ?? {};
        const attemptedUserIds = [];

        quizzes.forEach((quiz) => {
          if (quiz.givenAnswers) {
            console.log('givenAnswers:', quiz.givenAnswers);
            Object.keys(quiz.givenAnswers).forEach((userId) => {
              if (!attemptedUserIds.includes(userId)) {
                attemptedUserIds.push(userId);

              }
            });
          }
        });

        const users = await Promise.all(
          attemptedUserIds.map(async (userId) => {
            try {
              const user = await getStudentById(userId);
              console.log(`Fetched data for user ID ${userId}:`, user);
              return user.data;
            } catch (error) {
              console.error(`Failed to fetch user ID ${userId}:`, error);
              return null; 
            }
          })
        ); 
        const participantData = users.map((user) => ({
          userId:user?.userId,
          name: user?.firstName + user?.lastName|| 'Unknown',
          email: user?.email || 'No email',
          score: studentMarks[user?.userId] || 0,
        }));

        setParticipants(participantData);
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [assignmentId]);

  const totalPages = Math.ceil(participants.length / rowsPerPage);
  const currentRows = participants
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((participant, index) => (
      <ReviewedTableRow
        key={index}
        assignmentId={assignmentId}
        userId={participant.userId}
        name={participant.name}
        email={participant.email}
        score={participant.score} 
      />
    ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1>Participants</h1>
      <TableRowHeaderReviewed />
      {loading ? (
        <p>Loading participants...</p>
      ) : (
        <>
          <div>{currentRows}</div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
