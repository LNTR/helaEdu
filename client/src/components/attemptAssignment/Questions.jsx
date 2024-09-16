import React, { useState, useEffect } from "react";
import Question from "@components/attemptAssignment/Question";
import Answer from "@components/attemptAssignment/Answer";

const Questions = ({
  questions,
  handleNextQuestion,
  currentQuestion,
  handleAnswerClick,
  initialTimer, 
  isLastQuestion,timet
}) => {
  const optionIds = ["A", "B", "C", "D"];
  const [selectedOption, setSelectedOption] = useState(null);
  // const [timer, setTimer] = useState(initialTimer); // Global quiz timer

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer((prevTimer) => {
  //       if (prevTimer <= 0) {
  //         clearInterval(interval);
  //         return 0;
  //       }
  //       return prevTimer - 1000; // Decrement every second
  //     });
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    handleAnswerClick(option);
  };

  return (
    <div>
      <Question
        question_no={currentQuestion + 1}
        question={questions[currentQuestion].question}
        // timer={timer}
        totalQuizTime={initialTimer}
        questionLength={questions.length}
        timet={timet}
      />
      <div className="w-full grid grid-flow-row grid-cols-2 mx-32">
        {questions[currentQuestion].options.map((option, index) => (
          <Answer
            key={index}
            option={option}
            id={optionIds[index]}
            onclick={() => handleOptionClick(option)}
            selectedOption={selectedOption}
          />
        ))}
      </div>
      <div className="flex justify-end mx-32 mt-32">
        <button
          className="gold-button w-64"
          onClick={() => handleNextQuestion(timet)}
        >
          <h4>{isLastQuestion ? "Submit" : "Next"}</h4>
        </button>
      </div>
    </div>
  );
};

export default Questions;
