import React, { useState } from 'react';
import AssignmentReviewed from '@components/assignments/AssignmentReviewed';
import { Header, Footer } from '@components/common';

const QuestionsList = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const questions = [
    {
      question: 'What is the answer when 2434₆ is divided by 42₆?',
      options: [
        { text: '23₆', correct: false },
        { text: '35₆', correct: true },
        { text: '52₆', correct: false },
        { text: '52₆', correct: false }
      ],
      review: 'Explanation or review goes here.',
    },
    {
      question: 'What is the answer when 2434₆ is divided by 42₆?',
      options: [
        { text: '23₆', correct: false },
        { text: '35₆', correct: true },
        { text: '52₆', correct: false },
        { text: '52₆', correct: false }
      ],
      review: 'Explanation or review goes here.',
    },
    {
      question: 'What is the answer when 2434₆ is divided by 42₆?',
      options: [
        { text: '23₆', correct: false },
        { text: '35₆', correct: true },
        { text: '52₆', correct: false },
        { text: '52₆', correct: false }
      ],
      review: 'Explanation or review goes here.',
    },
    {
      question: 'What is the answer when 2434₆ is divided by 42₆?',
      options: [
        { text: '23₆', correct: false },
        { text: '35₆', correct: true },
        { text: '52₆', correct: false },
        { text: '52₆', correct: false }
      ],
      review: 'Explanation or review goes here.',
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
   
    <div>
      <Header/>
      <div className='min-h-screen mx-32'>
        <div className='mt-14'>
          <p>Student Name : M.K.P.Ahinsa</p>
          <p>Total Score  : 89%</p>
          <br></br>
          <p>No of Correct Answers : 6 </p>
          <p>No of Incorrect Answers :4 </p>
        </div>
        <div className='mt-16'>
          <h1 className="text-4xl  mb-4">Question Review</h1>
          {questions.map((q, i) => (
            <AssignmentReviewed
              key={i}
              index={i}
              question={q.question}
              options={q.options}
              review={q.review}
              isOpen={openIndex === i}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default QuestionsList;
