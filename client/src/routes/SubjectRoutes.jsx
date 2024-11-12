import React from "react";
import { Route, Routes } from "react-router-dom";
import { userRoles } from "@utils/userRoles";
import { AuthorizeRoles, AuthorizeId } from "@utils/AuthorizeRoute";

import SubjectCatalog from "@pages/subjects/SubjectCatalog";
import Subject from "@pages/subjects/Subject";

function SubjectRoutes() {
  return (
    <Routes>
      <Route path="/subjectCatalog" element={<SubjectCatalog />} />;
      <Route path="/subject/:grade/:subject" element={<Subject />} />;
    </Routes>
  );
}

export default SubjectRoutes;
