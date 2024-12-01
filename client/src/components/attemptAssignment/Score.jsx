import React, { useEffect, useState } from "react";
import congratulations from "@assets/img/congrats-banner.svg";
import goldBadge from "@assets/img/badges/gold.svg";
import { useNavigate } from "react-router-dom";
import { getAssignment } from "@services/AssignmentService";

const Score = ({ assignmentId, studentId, name }) => {
  const navigate = useNavigate();
  const [studentScore, setStudentScore] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const response = await getAssignment(assignmentId);
        let studentMarks = response.data?.studentMarks || {}; 
        if (typeof studentMarks === "object" && studentMarks !== null) {
          const studentMarksValue = studentMarks[studentId];
  
          if (studentMarksValue !== undefined) {
            setStudentScore(studentMarksValue);
          } else {
            console.warn("Student ID not found in the marks object");
            setStudentScore("N/A");
          }
        } else {
          console.error("Unexpected studentMarks type:", typeof studentMarks);
          setStudentScore("Error");
        }
      } catch (error) {
        console.error("Error fetching assignment data:", error);
        setStudentScore("Error");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAssignmentData();
  }, [assignmentId, studentId]);
  
  

  const handleBtnClick = (path) => {
    navigate(`/${path}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="popup-container">
      <div className="popup-box-large visible relative">
        <div className="congrats-img">
          <img src={congratulations} alt="Congratulations" className="" />
        </div>
        <div className="badge-wrapper">
          <img src={goldBadge} alt="Gold Badge" />
        </div>
        <div className="h-auto p-5 m-10 rounded-xl bg-white-transparent w-full">
          <div className="overflow-x-auto">
            <div className="s-topic text-blue text-center leading-tight">{name}</div>

            <table className="table special-text leading-tight">
              <tbody>
                <tr className="border-none">
                  <td>Total Score</td>
                  <td className="text-right">{studentScore}</td> 
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="n-text-bold white-button"
            onClick={() => handleBtnClick("")}
          >
            <h4>Go to home</h4>
          </button>
          <button
            className="n-text-bold gold-button"
            onClick={() => handleBtnClick("assignmentView")}
          >
            <h4>Review Quiz</h4>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Score;
