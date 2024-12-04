
import React from 'react'
import { Header, Footer } from "@/components/common";
import Guidlines from '@components/Quiz/Guidlines';
import QuizBegin from '@components/Quiz/QuizBegin';
import { useParams } from 'react-router-dom';


const Quiz = () => {

  const { subject } = useParams();
  return (
    <>
    <QuizBegin subject={subjectId} />
    </>
  );
};

export default Quiz;
