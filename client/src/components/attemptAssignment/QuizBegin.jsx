import React, { useEffect, useState } from "react";
import background from "@assets/img/quiz-bg.svg";
import Guidlines from "@components/attemptAssignment/Guidlines";
import Questions from "@components/attemptAssignment/Questions";
import Score from "@components/Quiz/Score";
import StartPopup from "@components/Quiz/StartPopup";
import { Header, Footer } from "@components/common";
import { getAssignment } from '@services/AssignmentService';

const QuizBegin = ({ assignmentId }) => {
  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [globalTimer, setGlobalTimer] = useState(0); 
  const [quizStarted, setQuizStarted] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const timeToMilliseconds = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMilliseconds = (hours * 3600000) + (minutes * 60000);
    return totalMilliseconds;
  };

  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await getAssignment(assignmentId);
        const assignmentData = response.data;

        const fetchedQuestions = assignmentData.quizzes.map(quiz => ({
          question: quiz.question,
          options: quiz.options,
          answer: quiz.correctAnswer,
          id: quiz.quizId 
        }));

        setAssignment(assignmentData);
        setQuestions(fetchedQuestions);

        const totalQuizTime = timeToMilliseconds(assignmentData.totalTime);
        setGlobalTimer(totalQuizTime);  
        setTotalTime(totalQuizTime);  

      } catch (error) {
        console.error("Failed to fetch assignment", error);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    if (quizStarted && globalTimer > 0) {
      const interval = setInterval(() => {
        setGlobalTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1000;
          } else {
            setQuizStarted(false);
            clearInterval(interval);
            return 0; 
          }
        });
      }, 1000); 

      return () => clearInterval(interval);
    }
  }, [quizStarted, globalTimer]);

  const handleNextQuestion = (remainingTime) => {
    console.log("Time remaining: ", remainingTime);
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const handleAnswerClick = (option) => {
    console.log("Selected Option: ", option);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setShowPopup(false);
    setScore(0);
    setCurrentQuestion(0);
    setGlobalTimer(totalTime);
    setIsLastQuestion(false);
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Header />
      <div className="min-h-screen">
        {assignment.started ? (
          !quizStarted && !showPopup ? (
            <div>
              <Guidlines assignmentId={assignmentId}/>
              <div className="text-center m-10">
                <div className="button-29 mt-10" onClick={startQuiz}>
                  Start Quiz!
                </div>
              </div>
            </div>
          ) : quizStarted && currentQuestion < questions.length ? (
            <div>
              <div className="timer-display"></div>
              <Questions
                questions={questions}
                handleNextQuestion={handleNextQuestion}
                currentQuestion={currentQuestion}
                handleAnswerClick={handleAnswerClick}
                initialTimer={globalTimer}
                isLastQuestion={isLastQuestion}
              />
            </div>
          ) : (
            <Score
              score={score}
              setScore={setScore}
              setCurrentQuestion={setCurrentQuestion}
              setQuizStarted={setQuizStarted}
            />
          )
        ) : (
          <div className="flex justify-center my-20">
              <p className="text-3xl ">Assignment is not started yet</p>
          </div> 
         
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QuizBegin;
