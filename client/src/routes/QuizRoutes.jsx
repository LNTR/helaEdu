import React from "react";
import { Route, Routes } from "react-router-dom";
import { userRoles } from "@utils/userRoles";
import { AuthorizeRoles, AuthorizeId } from "@utils/AuthorizeRoute";

import Quiz from "@pages/quizes/Quiz";
import QuizHome from "@pages/quizes/QuizHome";
import LeaderBoard from "@pages/leaderboard/LeaderBoard";
import History from "@pages/quizes/History";
import Friends from "@pages/quizes/Friends";

function QuizRoutes() {
  return (
    <Routes>
      <Route path="/" element={<QuizHome />} />
      <Route path="/:subject" element={<Quiz />} />
      <Route path="/history/1" element={<History />} />
      <Route path="/friends/1" element={<Friends />} />
      <Route path="/leaderboard/1" element={<LeaderBoard />} />
    </Routes>
  );
}

export default QuizRoutes;
