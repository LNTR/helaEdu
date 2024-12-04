import React, { useState } from 'react';
import Sidebar from '@components/moderator_com/ModeratorSidebar';
import { Header } from '@components/common';
import { useLocation } from 'react-router-dom';
import FormComponent from '@components/moderator_com/FormComponent';
import QuizCard from '@components/Quiz/QuizCard';

export default function GenerateQuiz() {
  
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const { grade } = location.state || { grade: 'Default Grade' }; 
  const [showModal, setShowModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);

  const handleOpenModal = (subjectId) => {
    setShowModal(true);
    setSelectedSubjectId(subjectId);
  };
  
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
          subjectId={selectedSubjectId}  
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
              onClick={() => handleOpenModal(1)} 
            >
              Generate Quiz
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
}
