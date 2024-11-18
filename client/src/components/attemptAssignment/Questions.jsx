
import React, { useState, useEffect } from "react";
import Answer from "@components/attemptAssignment/Answer";
import Question from "@components/attemptAssignment/Question";

import {submitAnswer} from "@services/AssignmentService";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const Questions = ({
  questions,
  handleNextQuestion,
  currentQuestion,
  handleAnswerClick,
  initialTimer,
  isLastQuestion,
  timet,
  assignmentId,  
  
}) => {
  const optionIds = ["A", "B", "C", "D"];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const handleOptionClick = (option) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter((item) => item !== option); 
      } else {
        return [...prevSelected, option]; 
      }
    });
  };

  const handleNextButtonClick = () => {
    const currentQuiz = questions[currentQuestion];
    const providedAnswers = selectedOptions; 
    console.log("Submitting answer for quiz ID:", currentQuiz.id);
    console.log("Provided answers:", providedAnswers);
    if (providedAnswers.length === 0) {
      console.error("No answers selected for question:", currentQuiz.id);
      return;
    }
    submitAnswer(assignmentId, currentQuiz.id, providedAnswers, headers) 
      .then((response) => {
        console.log("Answer submitted successfully", response);
      })
      .catch((error) => {
        console.error("Error submitting answer", error);
      });
  
    setSelectedOptions([]);
    handleNextQuestion(timet);
  };
  
  return (
    <div>
      <div>
        <Question
          question_no={currentQuestion + 1}
          question={questions[currentQuestion].question}
          totalQuizTime={initialTimer}
          questionLength={questions.length}
          timet={timet}
        />

        {/* <h2>Question {currentQuestion + 1}</h2>
        <p>{questions[currentQuestion].question}</p> */}
      </div>
      <div className="w-full grid grid-flow-row grid-cols-2 mx-32">
        {questions[currentQuestion].options.map((option, index) => (
          <Answer
            key={index}
            option={option}
            id={optionIds[index]}
            onclick={() => handleOptionClick(option)}
            isSelected={selectedOptions.includes(option)} 
          />
        ))}
      </div>
      <div className="flex justify-end mx-32 mt-32">
        <button className="gold-button w-64" onClick={handleNextButtonClick}>
          <h4>{isLastQuestion ? "Submit" : "Next"}</h4>
        </button>
      </div>
    </div>
  );
};

export default Questions;
