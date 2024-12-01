import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@components/moderator_com/ModeratorSidebar';
import { Header } from '@components/common';

const sampleQuizData = {
  1: [
    { question: 'What is the capital of France?', options: ['Paris', 'London', 'Rome', 'Berlin'] },
    { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'] },
  ]
  
};

export default function ReviewQuiz() {
  const [sidebar, setSidebar] = useState(false);
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    
    setQuestions(sampleQuizData[1] || []);
  }, [1]);

  const handleRegenerate = (index) => {
  
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = `Regenerated question for Q${index + 1}`;
    updatedQuestions[index].options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    setQuestions(updatedQuestions);
  };

  return (
    <>
    <Header />
    <div className="dashboard h-screen mx-auto" style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }} onClick={() => setSidebar(false)}>
      <Sidebar value={sidebar} setValue={setSidebar} />
      <div className="content-wrapper mx-64 border" >
        <div className="mx-64 my-10">
          <h1 className="text-3xl font-bold text-center mb-5">Review Quiz {quizId}</h1>
          <div className="">
            {questions.map((q, index) => (
              <div key={index} className="w-full  p-4 border rounded-lg mb-5 shadow-lg">
                <h2 className="text-xl font-semibold">{q.question}</h2>
                <ul className="mt-3 space-y-2">
                  {q.options.map((option, idx) => (
                    <li key={idx} className="bg-gray-100 p-2 rounded-lg text-xl">
                      {option}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleRegenerate(index)}
                  className="bg-blue text-white text-xl px-4 py-2 mt-3 rounded-lg hover:bg-blue-dark"
                >
                  Regenerate Question
                </button>
              </div>
            ))}
          </div>
          <div className='flex justify-end'>
            <button className='text-xl bg-blue px-6 py-3 text-white'>Done</button>
          </div>
      </div>
      </div>
    </div>

  </>
    
  );
}
