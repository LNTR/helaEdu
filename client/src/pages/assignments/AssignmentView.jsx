import { Footer, Header } from '@components/common';
import React from 'react';

export default function AssignmentView() {
  const quizzes = [
    {
      id: 1,
      title: 'Quiz 1',
      status: 'Closed',
      attemptedDate: 'Monday, 24 June 2024, 10:00 AM',
      completed: true,
    },
    {
      id: 2,
      title: 'Quiz 2',
      status: 'Open',
      attemptedDate: 'Wednesday, 26 June 2024, 11:59 PM',
      completed: false,
    },
  ];

  return (
    <div>
      <Header />
      <div className="min-h-screen p-4 px-32">
        <p className="text-4xl mb-4 my-10 ">Your Attempted Assignments</p><br></br>

        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="rounded-xl border border-blue p-4 mb-4 flex justify-between items-center"
          >
            <div>
              <p className="text-pink-600 text-2xl">{quiz.title}</p>
              <p>
                <span className="text-2xl">{quiz.status}</span> <br></br>
                <span className="text-2xl">{quiz.attemptedDate}</span>
              </p>
            </div>
            <div className='flex justify-start'> 
              <div className='mx-10'>
                {quiz.completed ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xl">✔ Done</span>
                ) : (
                  <span className="bg-yellow-500 text-white px-4 py-1 rounded-md text-xl">Pending</span>
                )}
               
              </div>
              <div>
                  <button className='rounded-md bg-blue px-2 text-white py-1 text-xl'> Reviewed</button>
              </div>

            </div>
            
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
