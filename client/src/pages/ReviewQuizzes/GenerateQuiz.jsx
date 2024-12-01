import React, { useState } from 'react';
import Sidebar from '@components/moderator_com/ModeratorSidebar';
import { Header } from '@components/common';
import { useLocation } from 'react-router-dom';
import FormComponent from '@components/moderator_com/FormComponent';
import QuizCard from '@components/Quiz/QuizCard';

export default function GenerateQuiz() {
  const quizzes = [
    {
      quizId: 1,
      topic: 'Quiz Topic 1',
      subject: 'Science',
      grade: 'Grade 8',
      link: '/reviewQuiz',
    },
    {
      quizId: 2,
      topic: 'Quiz Topic 2',
      subject: 'Science',
      grade: 'Grade 7',
    },
    {
      quizId: 3,
      topic: 'Quiz Topic 3',
      subject: 'Science',
      grade: 'Grade 6',
    },
    {
      quizId: 4,
      topic: 'Quiz Topic 4',
      subject: 'Science',
      grade: 'Grade 9',
    },
  ];

  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const { grade } = location.state || { grade: 'Default Grade' }; // Added default grade fallback
  const [showModal, setShowModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = (formData) => {
    setGeneratedData(formData);
    console.log('Generated Data:', formData);
  };

  return (
    <>
      <Header />
      {showModal && (
        <FormComponent
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          grades={grade}
        />
      )}
      <div
        className="dashboard h-screen mx-auto"
        style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }}
        onClick={() => setSidebar(false)}
      >
        <Sidebar value={sidebar} setValue={setSidebar} />
        <div className="content-wrapper mx-64 border">
          <h1 className="mx-10 my-14">{grade}</h1>
          <div className="flex justify-center">
            <button
              className="bg-blue px-7 py-3 text-white text-2xl"
              onClick={handleOpenModal}
            >
              Generate Quiz
            </button>
          </div>
          <div className="flex center py-5">
            {quizzes.map((quiz, index) => (
              <QuizCard
                key={index}
                imageUrl={quiz.imageUrl}
                topic={quiz.topic}
                subject={quiz.subject}
                grade={quiz.grade}
                link={quiz.link}
                quizId={quiz.quizId}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
