import React from "react";
import { Route, Routes } from "react-router-dom";
import { userRoles } from "@utils/userRoles";
import { AuthorizeRoles, AuthorizeId } from "@utils/AuthorizeRoute";

import AssignmentList from "@pages/assignments/AssignmentList";
import CreateAssignments from "@pages/assignments/CreateAssignments";
import QuizFormat from "@pages/assignments/QuizFormat";

function AssignmentRoutes() {
  return (
    <Routes>
      <Route path="/assignmentList" element={<AssignmentList />} />
      <Route path="/createAssignments" element={<CreateAssignments />} />
      <Route path="/quizFormat/:assignmentId" element={<QuizFormat />} />
    </Routes>
  );
}

export default AssignmentRoutes;
