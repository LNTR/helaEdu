
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Card({ subject, icon, grade,pdfRef,subjectId }) {
  const navigate = useNavigate();

  // const formatSubjectName = (subject) => {
  //   return subject.replace(/([A-Z])/g, " $1").trim();
  // };

  return (
    <div
      className="subject-card shadow-xl card"
      onClick={() => {
        navigate(`/subjects/subject/${grade}/${subject}`, {
          state: { subjectId, pdfRef,subject },
        });
        
      }}
    >
      <div className="card-icon">
       {
        icon ? <img src={icon} alt="" srcset="" /> :<FontAwesomeIcon icon={faBook} size="5x"/>
       }
        
      </div>
      <div className="card-text">
       
        <h3>{subject}</h3>
      </div>
    </div>
  );
}

export default Card;
