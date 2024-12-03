import React, { useState, useEffect } from "react";
import { Header } from "@components/common";
import {
  PdfBook,
  ActionMenu,
  ChatBot,
  Discussion,
  StickyNote,
  Enrollment,
} from "@components/subject";
import {
  checkHasEnrolled,
  enrollToSubject,
  unenrollFromSubject,
} from "@services/EnrollmentService";
import { useLocation } from "react-router-dom";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function Subject() {
  const { state } = useLocation();
  const { subjectId, pdfRef, subject } = state || {};
  const [hasEnrolled, setHasEnrolled] = useState(false);
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  useEffect(() => {
    checkHasEnrolled(subjectId, headers).then((res) => {
      let hasEnrolled = res.data.hasEnrolled;
      setHasEnrolled(hasEnrolled);
    });
  }, []);

  const sideBarComponentMap = Object.freeze({
    PASSIVE: false,
    DISCUSSION: <Discussion subjectId={subjectId} hasEnrolled={hasEnrolled} />,
    CHATBOT: <ChatBot subject={subject} hasEnrolled={hasEnrolled} />,
    STICKYNOTE: <StickyNote subjectId={subjectId} hasEnrolled={hasEnrolled} />,
    ENROLLMENT: (
      <Enrollment
        subjectId={subjectId}
        hasEnrolled={hasEnrolled}
        setHasEnrolled={setHasEnrolled}
      />
    ),
  });

  const [sideBarComponent, setSideBarComponent] = useState(
    sideBarComponentMap.PASSIVE
  );

  return (
    <>
      <Header />
      <section className="subject">
        <div
          className={`left-panel ${sideBarComponent ? "sidebar-visible" : ""}`}
        >
          <ActionMenu
            sideBarComponent={sideBarComponent}
            sideBarComponentMap={sideBarComponentMap}
            setSideBarComponent={setSideBarComponent}
          />
          <PdfBook subject={subject} subjectId={subjectId} pdfRef={pdfRef} />
        </div>
        <div className={`right-panel ${sideBarComponent ? "active" : ""}`}>
          {sideBarComponent}
        </div>
      </section>
    </>
  );
}

export default Subject;
