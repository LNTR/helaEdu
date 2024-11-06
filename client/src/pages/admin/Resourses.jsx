import React from "react";
import { Header, Footer } from "@/components/common";
import Sidebar from "@/components/admin/Sidebar";
import SelectGrades from "@components/admin/SelectGrades";

const Resources = () => {
  const Grades = ["Grade 6","Grade 7","Grade 8", "Grade 9","Grade 10","Grade 11","Grade 12","Grade 13" ];

  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-wrapper">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="content-wrapper">
            <div className="mx-32 mt-10">
              <h1>Resources</h1>
              <p className="text-2xl">Upload updated or newly published textbooks and teachers resources</p>
              <hr className="border-yellow border-t-4 w-2/5"></hr>
              <div className="grid grid-cols-4 gap-4 my-20">
                {Grades.map((grade, index) => (
                  
                  <SelectGrades key={index} grade={grade} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Resources;
