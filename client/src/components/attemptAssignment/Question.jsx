import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Question_progress from "@components/Quiz/Question_progress";


const formatTime = (time) => {
  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const Question = ({ question_no, question, totalQuizTime, questionLength, timet }) => {
  const [progress, setProgress] = useState(100); 
  const navigate = useNavigate();

  useEffect(() => {
    if (totalQuizTime > 0 && timet >= 0) {
      const timeRemaining = timet; 
      const newProgress = ((totalQuizTime - timeRemaining) / totalQuizTime) * 100;
      // const newProgress = (timeRemaining / totalQuizTime) * 100;
      setProgress(Math.max(0, newProgress)); 
      console.log(totalQuizTime);
      console.log(timeRemaining);
      console.log(newProgress);
      if (timeRemaining <= 0) {
        navigate("/"); 
      }
    }
  }, [timet, totalQuizTime, navigate]);

  return (
    <div className="h-80 bg-blue border relative">
      <div className="h-auto mx-12 my-8 flex items-center">
        <div className="text-white text-header3">{`${question_no}).`}</div>
        <div>
          <p className="text-header4 text-white ml-4">{question}</p>
        </div>
      </div>
      <div className="-mt-12 mx-auto min-h-32 w-32">
        <div
          className="radial-progress bg-blue text-yellow border-blue border-4 absolute -bottom-16 right-12"
          style={{
            "--value": progress,
            "--size": "10rem",
            "--thickness": "1.2rem",
          }}
          role="progressbar"
        >
          {formatTime(timet * 1000)} 
        </div>
      </div>
      <div className="absolute bottom-6 left-12">
        <Question_progress
          noOfQuestions={questionLength}
          currentQuestion={question_no}
        />
      </div>
    </div>
  );
};

export default Question;
