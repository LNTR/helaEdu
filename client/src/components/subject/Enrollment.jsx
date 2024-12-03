import React, { useState, useEffect } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {
  enrollToSubject,
  unenrollFromSubject,
} from "@services/EnrollmentService";

function Enrollment({ subjectId, hasEnrolled, setHasEnrolled }) {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  return (
    <div className="m-12 mt-10 ">
      <h1>Enrollment</h1>
      {!hasEnrolled ? (
        <>
          <hr className="border-yellow border-t-4 w-56 mb-20"></hr>
         <div className="flex justify-center mb-10">
           <h4 className="items-center">You haven't enrolled to this subject yet.</h4>
         </div>
          <div className="flex justify-center ">
            <button
              className="bg-blue rounded-2xl px-32 py-5 text-white text-3xl hover:bg-yellow"
              onClick={() => {
                enrollToSubject(subjectId, headers).then((res) => {
                  if (res.data.hasEnrolled) {
                    window.location.reload();
                  }
                });
              }}
            >
              Enroll Now
            </button>
          </div>
         
        </>
      ) : (
        <>
          <hr className="border-yellow border-t-4 w-56"></hr>
          <h4>You already have enrolled to this subject</h4>
          <button
            className="blue-button"
            onClick={() => {
              unenrollFromSubject(subjectId, headers).then((res) => {
                if (!res.data.hasEnrolled) {
                  window.location.reload();
                }
              });
            }}
          >
            Unenroll
          </button>
        </>
      )}

      <br />
    </div>
  );
}

export default Enrollment;
