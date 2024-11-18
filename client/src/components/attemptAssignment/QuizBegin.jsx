import React, { useEffect, useState } from "react";
import background from "@assets/img/quiz-bg.svg";
import Guidlines from "@components/attemptAssignment/Guidlines";
import Questions from "@components/attemptAssignment/Questions";
import Score from "@components/Quiz/Score";
import StartPopup from "@components/Quiz/StartPopup";
import { Header, Footer } from "@components/common";
import { getAssignment, startAssignmentByStudent } from "@services/AssignmentService";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { currentStudent } from "@services/StudentService";

const QuizBegin = ({ assignmentId }) => {

  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const [assignment, setAssignment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [globalTimer, setGlobalTimer] = useState(0); 
  const [quizStarted, setQuizStarted] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await currentStudent(headers);
        setStudentId(response.data.userId); 
        console.log("studentId", response.data.userId);
      } catch (error) {
        console.error("Failed to fetch student information", error);
      }
    };

    fetchStudent();
  }, [headers]);

  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await getAssignment(assignmentId, headers);
        const assignmentData = response.data;

        const fetchedQuestions = assignmentData.quizzes.map(quiz => ({
          question: quiz.question,
          options: quiz.options,
          answer: quiz.correctAnswer,
          id: quiz.questionId,
        }));

        setAssignment(assignmentData);
        setQuestions(fetchedQuestions);

        const totalQuizTime = assignmentData.totalTime;
        setGlobalTimer(totalQuizTime);  
        setTotalTime(totalQuizTime);  
      } catch (error) {
        console.error("Failed to fetch assignment", error);
      }
    };

    fetchAssignment();
  }, [assignmentId, headers]);

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

  const startQuiz = async () => {
    try {
      console.log("Starting quiz...");
      
      setQuizStarted(true);
      setShowPopup(false);
      setScore(0);
      setCurrentQuestion(0);
      setGlobalTimer(totalTime);
      setIsLastQuestion(false); 
    } catch (error) {
      console.error("Failed to start assignment", error);
    }
  };

  const handleNextQuestion = (remainingTime) => {
    console.log("Time remaining: ", remainingTime);
    
    setCurrentQuestion((prevQuestion) => {
      const nextQuestion = prevQuestion + 1;
      if (nextQuestion === questions.length - 1) {
        setIsLastQuestion(true);
      } else {
        setIsLastQuestion(false);
      }

      return nextQuestion;
    });
  };

  const handleAnswerClick = (option) => {
    console.log("Selected Option: ", option);
  };

  const showStartPopup = () => {
    try {
      startAssignmentByStudent(assignmentId, headers);
      setShowPopup(true);
    } catch (error) {
      console.log("error to start assignment by student");
    }
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

  const remainingTimesForUser = assignment.studentRemainingTimes && assignment.studentRemainingTimes.hasOwnProperty(studentId)
    ? assignment.studentRemainingTimes[studentId]
    : undefined;
  const isTimeRemainingDefined = typeof remainingTimesForUser !== 'undefined';
  const timet = assignment.studentRemainingTimes[studentId];

  return (
    <div className="relative min-h-screen bg-cover bg-fixed" style={{ backgroundImage: `url(${background})` }}>
      <Header />
      <div className="min-h-screen">
        {assignment.started ? (
          isTimeRemainingDefined ? (
            remainingTimesForUser > 0 ? (
              currentQuestion < questions.length ? (
                <Questions
                  questions={questions}
                  handleNextQuestion={handleNextQuestion}
                  currentQuestion={currentQuestion}
                  handleAnswerClick={handleAnswerClick}
                  initialTimer={globalTimer}
                  isLastQuestion={isLastQuestion}
                  timet={timet}
                  assignmentId={assignmentId}
                />
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
                <p className="text-3xl">You have already attempted the quiz and have no remaining time.</p>
              </div>
            )
          ) : (
            !quizStarted && !showPopup ? (
              <div>
                <Guidlines assignmentId={assignmentId} />
                <div className="text-center m-10">
                  <div className="button-29 mt-10" onClick={showStartPopup}>
                    Start Quiz!
                  </div>
                </div>
              </div>
            ) : showPopup && !quizStarted ? (
              <StartPopup onComplete={startQuiz} />
            ) : quizStarted && currentQuestion < questions.length ? (
              <Questions
                questions={questions}
                handleNextQuestion={handleNextQuestion}
                currentQuestion={currentQuestion}
                handleAnswerClick={handleAnswerClick}
                initialTimer={globalTimer}
                isLastQuestion={isLastQuestion}
              />
            ) : (
              <Score
                score={score}
                setScore={setScore}
                setCurrentQuestion={setCurrentQuestion}
                setQuizStarted={setQuizStarted}
              />
            )
          )
        ) : (
          <div className="flex justify-center my-20">
            <p className="text-3xl">Assignment is not started yet</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QuizBegin;
