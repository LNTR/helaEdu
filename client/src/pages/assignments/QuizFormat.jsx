import { Header, Footer } from "@components/common";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addQuizzes } from "@services/AssignmentService";
import Question from "@components/assignments/Question";

export default function QuizFormat() {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswers: [], marks: 0 },
  ]);

  const navigate = useNavigate();
  const params = useParams();
  const assignmentId = params.assignmentId;

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswers: [], marks: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    const correctAnswers = newQuestions[qIndex].correctAnswers.filter(
      (answer) => answer !== questions[qIndex].options[oIndex]
    );
    newQuestions[qIndex].correctAnswers = correctAnswers;

    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, option) => {
    const newQuestions = [...questions];
    const correctAnswers = newQuestions[qIndex].correctAnswers || [];

    if (correctAnswers.includes(option)) {
      newQuestions[qIndex].correctAnswers = correctAnswers.filter(
        (answer) => answer !== option
      );
    } else {
      newQuestions[qIndex].correctAnswers = [...correctAnswers, option];
    }

    setQuestions(newQuestions);
  };

  const handleMarksChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].marks = parseInt(value, 10);
    setQuestions(newQuestions);
  };

  const addQuizzesToBackend = async () => {
    try {
      if (assignmentId) {
        console.log("Payload being sent:", questions);
        const response = await addQuizzes(questions, assignmentId);
        if (response.status === 200) {
          console.log(response);
          navigate("/assignments/assignmentList");
        }
      } else {
        console.error("Assignment ID is not defined.");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="shadow-xl rounded-xl mx-96 my-20 p-10">
        {questions.map((q, qIndex) => (
          <Question
            key={qIndex}
            qIndex={qIndex}
            questionData={q}
            handleQuestionChange={handleQuestionChange}
            handleOptionChange={handleOptionChange}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleMarksChange={handleMarksChange}
            removeQuestion={removeQuestion}
          />
        ))}
        <div className="flex justify-between mx-10 mb-10">
          <button
            className="bg-yellow text-white px-10 py-3 rounded-xl text-2xl"
            onClick={addQuestion}
          >
            Add Question
          </button>
          <button
            className="bg-blue text-white px-10 py-3 rounded-xl text-2xl"
            onClick={addQuizzesToBackend}
          >
            Submit Assignment
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
