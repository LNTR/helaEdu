import React, { useState } from "react";
import Question from "./Question";
import Answer from "./Answer";
import { submitAnswer } from "@services/AssignmentService";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
const Questions = ({
  questions,
  givenAnswers,
  handleNextQuestion,
  currentQuestion,
  handleAnswerClick,
  initialTimer,
  isLastQuestion,
  timet,
  assignmentId,
}) => {
  
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const optionIds = ["A", "B", "C", "D"];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const currentQuiz = questions[currentQuestion];
  const studentAnswer = givenAnswers[currentQuiz?.id] || [];
  const isAlreadyAnswered = studentAnswer.length > 0; 

  const handleOptionClick = (option) => {
    if (!isAlreadyAnswered) {
      setSelectedOptions((prevSelected) =>
        prevSelected.includes(option)
          ? prevSelected.filter((item) => item !== option)
          : [...prevSelected, option]
      );
    }
  };

  const handleNextButtonClick = () => {
    const currentQuiz = questions[currentQuestion];
    if (!isAlreadyAnswered) {
      const providedAnswers = selectedOptions;
       console.log("Submitting answer for quiz ID:", currentQuiz.id);
      console.log("Provided answers:", providedAnswers);
  
      if (providedAnswers.length === 0) {
        console.error("No answers selected for question:", currentQuiz.id);
        alert("Select your answer");
        return;
      }
      submitAnswer(assignmentId, currentQuiz.id, providedAnswers,headers)
        .then((response) => {
          console.log("Answer submitted successfully", response);
        })
        .catch((error) => {
          console.error("Error submitting answer", error);
        });
  
      setSelectedOptions([]);
    }

    handleNextQuestion(timet);
  };
  
  return (
    <div>
      <div>
        <Question
          question_no={currentQuestion + 1}
          question={currentQuiz?.question}
          totalQuizTime={initialTimer}
          questionLength={questions.length}
          timet={timet}
        />
      </div>

      {isAlreadyAnswered && (
        <div className="bg-yellow-100 text-yellow-800 p-3 mb-4 rounded">
          <strong>Note:</strong> Answer already submitted. You cannot change it.
        </div>
      )}

      <div className="w-full grid grid-flow-row grid-cols-2 mx-32">
        {currentQuiz?.options.map((option, index) => (
          <Answer
            key={index}
            option={option}
            id={optionIds[index]}
            onclick={() => handleOptionClick(option)}
            isSelected={isAlreadyAnswered
              ? studentAnswer.includes(option)
              : selectedOptions.includes(option)} 
            isDisabled={isAlreadyAnswered} 
          />
        ))}
      </div>

      <div className="flex justify-end mx-32 mt-32">
        <button
          className="gold-button w-64"
          onClick={handleNextButtonClick} >
          <h4>{isLastQuestion ? "Submit" : "Next"}</h4>
        </button>
      </div>
    </div>
  );
};

export default Questions;
