import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormComponent from '@components/moderator_com/FormComponent';
import { generateQuiz, getQuizByModAndSubjectId } from '@services/WeeklyQuizService';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export default function SelectGrades({ subjectDetails }) {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [quizStatus, setQuizStatus] = useState(""); 
  const [quizId, setQuizId] = useState(null);

  // Fetch quiz status on component mount or subjectDetails change
  useEffect(() => {
    const fetchQuizStatus = async () => {
      try {
        const response = await getQuizByModAndSubjectId(subjectDetails.subjectId, headers);
        const quiz = response.data.quizzes.find(
          (q) => q.subjectId === subjectDetails.subjectId
        );
        if (quiz) {
          setQuizId(quiz.quizId);
          setQuizStatus(quiz.status_label); 
          setGeneratedData(quiz.quiz);
        } else {
          setQuizStatus("Generate Quiz"); // Default to "Generate Quiz" if no quiz found
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuizStatus();
  }, [subjectDetails.subjectId, headers]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await generateQuiz(formData, headers);
      const quiz = response.data.response;
      const quizId = response.data.response.quizId;
      setQuizId(quizId);
      setGeneratedData(quiz);
      setQuizStatus("Pending"); // Update status to Pending after quiz generation
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const handleReviewQuiz = () => {
    navigate(`/reviewQuiz/${quizId}`);
  };

  return (
    <div>
      {showModal && (
        <FormComponent
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          grades={subjectDetails.grade}
          subjects={subjectDetails.subjectName}
          subjectId={subjectDetails.subjectId}
        />
      )}

      <div className="rounded-xl border border-blue shadow-xl w-72 h-64 py-10 hover:scale-95 transition-transform">
        <p className="text-3xl text-center text-blue">{subjectDetails.subjectName}</p>
        <p className="text-3xl text-center">{subjectDetails.grade}</p>
        <div className="mt-6 flex justify-center">
          <button
            className={`px-7 py-3 text-white text-2xl cursor-pointer ${
              quizStatus === "Generate Quiz" || quizStatus === "" || quizStatus === null
                ? "bg-blue"
                : quizStatus === "Already Reviewed"
                ? "bg-red-500 cursor-not-allowed"
                : quizStatus === "Pending"
                ? "bg-green-400" 
                : ""
            }`}
            onClick={
              quizStatus === "Generate Quiz" || quizStatus === "" || quizStatus === null || quizStatus === "Opened"
                ? handleOpenModal
                : quizStatus === "Already Reviewed"
                ? null :  quizStatus =="Pending" ? handleReviewQuiz
                : null
            }
            disabled={quizStatus === "Already Reviewed"}
          >
            {quizStatus === "Generate Quiz" || quizStatus === "" || quizStatus === null ||  quizStatus === "Opened"
              ? "Generate Quiz"
              : quizStatus === "Already Reviewed"
              ? "Already Reviewed"
              : quizStatus === "Pending"
              ? "Review Quiz"
              : "Generate Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
