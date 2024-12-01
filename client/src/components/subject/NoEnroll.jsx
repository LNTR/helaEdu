import React from "react";

function NoEnroll({ action }) {
  switch (action) {
    case "Chatbot":
      return (
        <div className="flex-c h-full">
          <div>
            You first have to enroll to the subject in order to access the
            ChatBot.
          </div>
        </div>
      );

    case "Discussion":
      return (
        <div className="w-full">
          <div>
            You first have to enroll to the subject in order to reply to the
            forum.
          </div>
        </div>
      );
    case "Notes":
      return (
        <div className="flex-c h-full">
          <div>
            You first have to enroll to the subject in order to use the Study
            notes.
          </div>
        </div>
      );
  }
}

export default NoEnroll;
