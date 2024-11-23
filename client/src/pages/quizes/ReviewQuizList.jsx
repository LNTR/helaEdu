import React from "react";
import { Header, Footer } from "@/components/common";
import ModeratorSidebar from "@components/teacher_com/ModeratorSidebar";
import QuizCard from "@components/Quiz/QuizCard"
const Articles = () => {
  return (
    <>
      {/* <Header />
      <Banner />
      <QuizHead />
      <QuizCard />

     
      <br></br>
      <iframe></iframe>
      <Footer /> */}
       <Header />
          <div className="dashboard">
            <div className="dashboard-wrapper mb-9">
              <div className="sidebar-wrapper">
                <ModeratorSidebar />
              </div>
              <div className="content-wrapper mx-32">
                <h1 className="mx-10 my-14">Review Quizzes List</h1>
                <QuizCard />
              </div>
            </div>
          </div>
    </>
  );
};
export default Articles;
