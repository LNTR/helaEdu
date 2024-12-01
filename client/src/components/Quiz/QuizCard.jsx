import React from 'react';
import { Link } from 'react-router-dom';

export default function QuizCard({ imageUrl, topic, subject, grade, link, quizId }) {
  return (
    <div>
      <div className="card w-72 shadow-xl hover:scale-105 transition-transform m-2 mx-7">
        <figure>
          <img
            src={imageUrl || 'src/assets/img/Quizes/Quiz1.jpg'}
            alt="Quiz"
          />
        </figure>
        <div className="card-body">
          <h2 className="text-center text-2xl mt-2">{topic}</h2>
          <div className="flex justify-center mt-2">
            <div className="px-2 py-1 rounded-2xl bg-yellow border-none text-blue text-xl">
              {subject}
            </div>
          </div>
        </div>
        <div className="mb-3 flex justify-center">
          <Link to={`/reviewQuiz/${quizId}`}>
            <button className="bg-blue text-white rounded-lg px-3 py-1 text-lg">
              Review Quiz
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
