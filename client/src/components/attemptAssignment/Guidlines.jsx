import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import BackKey from "@components/common/BackKey";
import { useNavigate } from "react-router-dom";
import { getAssignment } from "@services/AssignmentService";

const Guidelines = ({ assignmentId }) => {
  const navigator = useNavigate();

  const clickBack = () => {
    navigator(`/quiz`);
  };

  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    if (!assignmentId) {
      console.error("Assignment ID is undefined or null.");
      return;
    }
    const fetchAssignment = async () => {
      try {
        const response = await getAssignment(assignmentId);
        const assignmentData = response.data;
        console.log("Fetched Assignment:", assignmentData);
        setAssignment(assignmentData);
      } catch (error) {
        console.error("Failed to fetch assignment", error);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  return (
    <>
      <div className="bg-white max-w-4xl mx-auto py-8 shadow-2xl rounded-xl border relative mt-10">
      
        <h1 className=" text-4xl text-blue text-center mb-6">{assignment.title}</h1>
        <h3 className="special-text text-blue text-center -mb-2">
          Start Your Assignment!
        </h3>
       
        <p className="s-text text-gray-600 text-center">
          Read the following instructions carefully before you start the quiz
        </p>

        <div className="w-full p-2">
          {assignment ? (
            <div className="flex items-center m-4">
              <FontAwesomeIcon
                icon={faBookOpen}
                style={{ color: "var(--color-primary)" }}
                size="2xl"
                className="mx-5"
              />
              <p className="n-text">{assignment.instructions}</p>
            </div>
          ) : (
            <p className="n-text">Loading instructions...</p>
          )}

          <div className="special-text text-blue text-center mx-20 mt-10">
            Each question you conquer is a step closer to mastery—keep moving,
            keep learning!"
          </div>
        </div>
      </div>
    </>
  );
};

export default Guidelines;
