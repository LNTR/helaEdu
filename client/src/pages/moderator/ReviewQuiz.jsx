import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@components/moderator_com/ModeratorSidebar';
import { Header } from '@components/common';
import { getQuizById } from '@services/WeeklyQuizService'; 
import { reviewQuiz } from '@services/WeeklyQuizService';
import { useNavigate } from 'react-router-dom';
import { regenerateQuestion } from '@services/WeeklyQuizService';

export default function ReviewQuiz() {
  const [sidebar, setSidebar] = useState(false);
  const { quizId } = useParams(); 
  const [questions, setQuestions] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [isReviewed, setIsReviewed] = useState(false); 

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await getQuizById(quizId);
        console.log('Full Quiz data:', response.data); 
        setQuizInfo(response.data.quiz);
        setQuestions(response.data.quiz?.quiz); 
      } catch (error) {
        console.error('Error fetching quiz details:', error);
      }
    };
  
    if (quizId) {
      fetchQuizDetails();
    }
  }, [quizId]);

  const handleRegenerate = async (index) => {
    const question = questions[index];
    const payload = {
      subject: quizInfo.subject,
      grade: quizInfo.grade,
      topic: question.topic ? question.topic : "none", 
      quizId: quizId,
      questionId: question.id,
    };
    

    try {
      const response = await regenerateQuestion(payload); 
      if (response.data) {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = response.data.quiz; 
        setQuestions(updatedQuestions);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error regenerating question:', error);
    }
  };

  const handleDoneClick = () => {
    setShowConfirmModal(true); 
  };

  const navigate = useNavigate();
  const handleConfirm = () => {
    reviewQuiz(quizId); 
    setIsReviewed(true);
    setShowConfirmModal(false); 
    console.log('Quiz marked as reviewed.');
    alert("Quiz marked as reviewed.");
    navigate("/reviewQuizHome");
  };

  const handleCancel = () => {
    setShowConfirmModal(false); 
    console.log('Review canceled.');
  };

  return (
    <>
      <Header />
      <div
        className="dashboard h-screen mx-auto"
        style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }}
        onClick={() => setSidebar(false)}
      >
        <Sidebar value={sidebar} setValue={setSidebar} />
        <div className="content-wrapper mx-64 border">
          <div className="mx-64 my-10">
            <h1 className="text-3xl font-bold text-center mb-5">
              Review Quiz 
            </h1>
            {questions && questions.length > 0 ? (
  <div>
    {questions.map((q, index) => (
      q && q.question && q.options ? ( 
        <div key={q.id} className="w-full p-4 border rounded-lg mb-5 shadow-lg">
          <h2 className="text-xl font-semibold">{q.question}</h2>
          <ul className="mt-3 space-y-2">
            {q.options.map((option, idx) => (
              <li key={idx} className="bg-gray-200 p-2 rounded-lg text-xl">
                {option}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleRegenerate(index)}
            className="bg-blue text-white text-xl px-4 py-2 mt-3 rounded-lg hover:bg-blue"
          >
            Regenerate Question
          </button>
        </div>
      ) : (
        <p key={index}>Invalid question data</p>
      )
    ))}
  </div>
) : (
  <p>Loading questions...</p>
)}


            <div className="flex justify-end">
              <button
                onClick={handleDoneClick}
                className="text-xl bg-blue px-6 py-3 text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-20 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h2 className="text-2xl mb-4">Are you sure you want to mark the quiz as reviewed?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg text-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-blue text-white px-6 py-2 rounded-lg text-2xl"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
