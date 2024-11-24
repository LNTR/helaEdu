import React, { useState, useEffect } from "react";
import Card from "@components/catalog/Card";
import { Header, Footer } from "@components/common";
import banner from "@assets/img/subject_background.png";
import { SubjectFilters } from "@components/subject";
import { listSubjectsByGrade } from "@services/SubjectService";


function SubjectCatalog() {
  const [subjects, setSubjects] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedGrade) {
      fetchSubjects(selectedGrade); 
    }
  }, [selectedGrade]);

  const fetchSubjects = async (grade) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listSubjectsByGrade(grade); 
      console.log("subjects", response.data);
      setSubjects(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("Failed to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <SubjectFilters
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
      />
      <div className="subject-catalog">
        <img className="catalog-img" src={banner} alt="Subject Catalog Banner" />

        {loading ? (
          <p className="text-center text-gray-500">Loading subjects...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : subjects.length > 0 ? (
          <div className="catalog-ul">
            {subjects.map(({ subjectName, language,pdfRef, grade, subjectId }, index) => (
              <Card
                key={index}
                subject={subjectName || "No Name Available"} 
                icon={2} 
                grade={grade }
                pdfRef={pdfRef}
                subjectId={subjectId || `unknown-${index}`} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No subjects available.</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default SubjectCatalog;
