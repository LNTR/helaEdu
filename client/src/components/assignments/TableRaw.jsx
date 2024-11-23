// TableRaw.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/fontawesome-free-regular";
import SharePopup from "@components/assignments/SharePopup";
import StartPopup from "@components/assignments/StartPopup";
import { endAssignment } from "@services/AssignmentService";
import { useNavigate } from "react-router-dom";

export default function TableRaw({
  assignmentId,
  title,
  instruction,
  publishedDate,
  totalTime,
  onClose,
  onView,
  started,
}) {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [startPopup, setStartPopup] = useState(false);
  const [showEndQuizPopup, setShowendQuizPopup] = useState(false);
  const [isStarted, setIsStarted] = useState(started);

  const endQuiz = async () => {
    try {
      const response = await endAssignment(assignmentId);
      console.log("Assignment ended:", response.data);
      alert("Assignment is ended");
      closeEndQuiz();
      setIsStarted(false);
    } catch (error) {
      console.error("Error ending the assignment:", error);
      alert("error ending assignment");
    }
  };
  const closeEndQuiz = () => {
    setShowendQuizPopup(false);
  };
  const openEndQuiz = () => {
    setShowendQuizPopup(true);
  };
  const handleShareClick = () => {
    setShowPopup(true);
  };
  const openStartClick = () => {
    setStartPopup(true);
  };
  const closeStartPopup = () => {
    setStartPopup(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  const openReview = () => {
    navigate(`/assignments/reviewQuizzes/${assignmentId}`);
  };

  const spllitedInstruction = instruction.split(" ").slice(0, 6).join(" ");
  const spllitedTitle = title.split(" ").slice(0, 4).join(" ");
  return (
    <div>
      {showEndQuizPopup && (
        <dialog open className="modal ">
          <div className="modal-box max-w-3xl p-10">
            <p className="py-4 text-3xl">
              Are you sure you want to end this assignment?
            </p>
            <div className="modal-action">
              <button
                className="btn bg-red-400 text-white text-2xl"
                onClick={closeEndQuiz}
              >
                Cancel
              </button>
              <button
                className="btn bg-blue text-white text-2xl"
                onClick={endQuiz}
              >
                End
              </button>
            </div>
          </div>
        </dialog>
      )}
      <div className="border border-blue rounded-3xl w-10/12 mx-auto my-4 px-7 py-4">
        <div className="flex justify-between items-center">
          <div className="w-2/12 text-left ">
            <p className="text-2xl">{spllitedTitle}</p>
          </div>
          <div className="w-5/12 text-left  ">
            <p className="text-2xl">{spllitedInstruction} ...</p>
          </div>
          <div className="w-2/12 text-left ">
            <p className="text-2xl">{publishedDate}</p>
          </div>
          <div className="w-1/12 text-left ">
            <p className="text-2xl">{totalTime}</p>
          </div>

          <div className="flex justify-end w-4/12">
            <div className="w-2/5  text-right">
              <button
                className="bg-blue text-white rounded-xl p-2 my-1  text-lg mx-2"
                onClick={openReview}
              >
                Review answers
              </button>
            </div>
            <div className="w-3/5 text-right">
              {isStarted ? (
                <button
                  className="bg-red-500 text-white rounded-xl p-2 text-lg mx-2"
                  onClick={openEndQuiz}
                >
                  End Quiz
                </button>
              ) : (
                <button
                  className="bg-blue text-white rounded-xl p-2 text-lg mx-2"
                  onClick={openStartClick}
                >
                  Start Quiz
                </button>
              )}

              <FontAwesomeIcon
                icon={faShare}
                onClick={handleShareClick}
                className="text-xl m-2 hover:text-yellow hover:translate-x-1"
              />
              <FontAwesomeIcon
                icon={faSearch}
                onClick={onView}
                className="text-2xl m-2 hover:text-yellow hover:translate-x-1"
              />
              <FontAwesomeIcon
                icon={faEdit}
                className="text-2xl m-2 hover:text-yellow hover:translate-x-1"
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={onClose}
                className="text-2xl m-2 hover:text-yellow hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <SharePopup closePopup={closePopup} assignmentId={assignmentId} />
      )}
      {startPopup && (
        <StartPopup closePopup={closeStartPopup} assignmentId={assignmentId} />
      )}
    </div>
  );
}
