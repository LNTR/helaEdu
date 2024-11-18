import React, { useState, useEffect } from 'react';
import { Header, Footer } from '@components/common';
import { useParams } from 'react-router-dom';
import { getAssignment } from '@services/AssignmentService';
import { getStudentById } from '@services/StudentService';

const QuestionsList = () => {
  const { assignmentId, userId } = useParams();
  console.log(userId);
  const [openIndex, setOpenIndex] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      try {
        const assignmentDetails = await getAssignment(assignmentId);
        setAssignment(assignmentDetails.data);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const studentDetails = await getStudentById(userId);
        setStudent(studentDetails.data);
      } catch (error) {
        console.error('Error fetching student Details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [userId]);

  const checkAnswer = (question, userId) => {
    const userAnswers = question.givenAnswers && question.givenAnswers[userId];
    const correctAnswers = question.correctAnswers || [];
    if (!userAnswers) {
      return false; // No answer given, consider it incorrect
    }
    const isCorrect = userAnswers.every((answer) => correctAnswers.includes(answer));
    return isCorrect;
  };

  const calculateScore = () => {
    let totalScore = 0;
    let totalMarks = 0;  
  
    assignment.quizzes.forEach((q) => {
      const userAnswers = q.givenAnswers && q.givenAnswers[userId];
      const correctAnswers = q.correctAnswers || [];
      const questionMarks = q.marks;  
      if (!userAnswers) {
        return;
      }
  
      if (userAnswers.length === correctAnswers.length && userAnswers.every((answer) => correctAnswers.includes(answer))) {
        totalScore += questionMarks;
      } else if (userAnswers.some((answer) => correctAnswers.includes(answer))) {
      
        const correctCount = userAnswers.filter((answer) => correctAnswers.includes(answer)).length;
        const percentage = (correctCount / correctAnswers.length);
        totalScore += questionMarks * percentage;  
      }
  
      totalMarks += questionMarks;  
    });
  
    const scorePercentage = (totalScore / totalMarks) * 100;
    return scorePercentage.toFixed(2);
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!assignment) {
    return <div>No assignment found.</div>;
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen mx-32">
        <div className="mt-14">
          <p>Student Name: {student?.firstName || 'N/A'}</p>
          <p>Total Score: {calculateScore()}%</p>
          <br />
          <p>
            No of Correct Answers: {assignment.quizzes.filter((q) => checkAnswer(q, userId)).length}
          </p>
          <p>
            No of Incorrect Answers:{' '}
            {assignment.quizzes.filter((q) => !checkAnswer(q, userId)).length}
          </p>
        </div>

        <div className="mt-16">
          <h1 className="text-4xl mb-4">Question Review</h1>
          {assignment.quizzes.map((q, i) => (
            <div key={q.questionId} className="py-4 border-b border-blue">
              <div
                className="flex justify-between items-center py-4 cursor-pointer"
                onClick={() => handleToggle(i)}
              >
                <span className="text-2xl">
                  {i + 1}. {q.question}
                </span>
                <span>{openIndex === i ? '▲' : '▼'}</span>
              </div>

              {openIndex === i && (
                <div className="px-7 py-5">
                  <div>
                    <h4 className="text-xl">Options:</h4>
                    {q.options.map((option, idx) => {
                      const isCorrect = q.correctAnswers.includes(option);
                      const isGiven = q.givenAnswers?.[userId]?.includes(option);
                      return (
                        <div
                          key={idx}
                          className={`py-2 my-2 rounded-md ${
                            isCorrect
                              ? 'bg-green-200 text-green-800'
                              : isGiven
                              ? 'bg-red-200 text-red-800'
                              : ''
                          }`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-xl">Correct Answer(s):</h4>
                    <p className="text-green-800">
                      {q.correctAnswers.join(', ')}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-xl">Your Answer(s):</h4>
                    <p
                      className={`${
                        q.givenAnswers?.[userId]
                          ? 'text-red-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {q.givenAnswers?.[userId]?.join(', ') || 'No answer given'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuestionsList;
