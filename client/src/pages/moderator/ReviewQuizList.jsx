import React from "react";
import { Header, Footer } from "@/components/common";
import Banner from "../../components/Quiz/Banner";
import QuizCard from "@components/Quiz/QuizCard";
import Sidebar from '@components/moderator_com/ModeratorSidebar'
import { Link } from "react-router-dom";
import { useState } from 'react'
//import CardCarousel from "@/components/articles/CardCarousel";

import QuizHead from "@/components/Quiz/QuizHead";
const Articles = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <Header />
      <div className="dashboard h-screen mx-auto" style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }} onClick={() => setSidebar(false)}>
        <Sidebar value={sidebar} setValue={setSidebar} />
        <div className="content-wrapper mx-64 border" >
          <QuizHead />
          <QuizCard />
        </div>
      </div>
      <br></br>
      <Footer />
    </>
  );
};
export default Articles;
