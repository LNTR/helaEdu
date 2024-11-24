import React, { useEffect, useState } from "react";
import background from "@assets/img/quiz-bg.svg";
import Guidlines from "@components/attemptAssignment/Guidlines";
import Questions from "@components/attemptAssignment/Questions";
import Score from '@components/attemptAssignment/Score';
import StartPopup from "@components/Quiz/StartPopup";
import { Header, Footer } from "@components/common";
import { getAssignment, startAssignmentByStudent } from "@services/AssignmentService";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { currentStudent } from "@services/StudentService";
import { submitStudentMark } from "@services/AssignmentService";

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
  const [studentName, setStudentName] = useState("");
  const [givenAnswers, setGivenAnswers] = useState({});

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await currentStudent(headers);
        setStudentId(response.data.userId); 
        setStudentName(`${response.data.firstName} ${response.data.lastName}`);
        console.log("studentId", response.data.userId);
      } catch (error) {
        console.error("Failed to fetch student information", error);
      }
    };
    fetchStudent();
  }, [headers]);


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
        const answers = {};
        assignmentData.quizzes.forEach((quiz) => {
          if (quiz.givenAnswers && quiz.givenAnswers[studentId]) {
            answers[quiz.questionId] = quiz.givenAnswers[studentId];
          }
        });

        setGivenAnswers(answers);
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
  }, [assignmentId,headers]);

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

  const calculateScore = () => {
    if (!assignment) return 0;
    let totalScore = 0;
    let totalMarks = 0;

    assignment.quizzes.forEach((q) => {
        const userAnswers = q.givenAnswers && q.givenAnswers[studentId];
        const correctAnswers = q.correctAnswers || [];
        const questionMarks = q.marks;

        if (!userAnswers) return;

        if (userAnswers.length === correctAnswers.length && userAnswers.every((answer) => correctAnswers.includes(answer))) {
            totalScore += questionMarks;
        } else if (userAnswers.some((answer) => correctAnswers.includes(answer))) {
            const correctCount = userAnswers.filter((answer) => correctAnswers.includes(answer)).length;
            const percentage = correctCount / correctAnswers.length;
            totalScore += questionMarks * percentage;
        }
        totalMarks += questionMarks;
    });
    const scorePercentage = (totalScore / totalMarks) * 100;
    const roundedScore = parseFloat(scorePercentage.toFixed(2));

    submitStudentMark(assignmentId, roundedScore, headers)
        .then(response => {
            console.log('Score submitted successfully:', response);
        })
        .catch(error => {
            alert(error);
            console.error('Error submitting score:', error);
        });

    return roundedScore;
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
                  givenAnswers={givenAnswers}
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
                  score={calculateScore()}
                  name={studentName}
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
                givenAnswers={givenAnswers}
                handleNextQuestion={handleNextQuestion}
                currentQuestion={currentQuestion}
                handleAnswerClick={handleAnswerClick}
                initialTimer={globalTimer}
                isLastQuestion={isLastQuestion}
              />
            ) : (
              <Score
                score={calculateScore()}
                name={studentName}
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
