import React from "react";
import { useState } from "react";
import Card from "@components/catalog/Card";
import { Header, Footer } from "@components/common";
import banner from "@assets/img/subject_background.png";
import { SubjectFilters } from "@components/subject";
function SubjectCatalog() {
  const subjects = [
    { subject: "BusinessStudies", icon: "BuisnessStudies" },
    { subject: "Catholicism", icon: "Catholicism" },
    { subject: "Geography", icon: "Geography" },
    { subject: "HealthScience", icon: "HealthScience" },
    { subject: "ICT", icon: "ICT" },
    { subject: "Mathematics", icon: "Mathematics" },
    { subject: "Science", icon: "Science" },
  ];

  let [selectedGrade, setSelectedGrade] = useState("null");

  return (
    <>
      <Header />
      <SubjectFilters
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
      />
      <div className="subject-catalog">
        <img className="catalog-img" src={banner} alt="" />

        <div className="catalog-ul">
          {subjects.map(({ subject, icon }, index) => (
            <Card
              key={index}
              subject={subject}
              icon={icon}
              grade={selectedGrade}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SubjectCatalog;
