import { Landing } from "@/components/landing";
import { Route, Routes } from "react-router-dom";
// import Quiz from "./pages/quizes/Quiz";
// import Articles from "./pages/articles/Articles";
// import ReadArticles from "./pages/articles/ReadArticles";

// import { Route, Routes } from "react-router-dom";
import Quiz from "@pages/quizes/Quiz";
import QuizHome from "@pages/quizes/QuizHome";
import Articles from "@pages/articles/Articles";
import ReadArticles from "@pages/articles/ReadArticles";
import Auth from "@pages/auth/Auth";
import AddArticles from "@pages/articles/AddArticles";
import AddArticleForm from "@pages/articles/AddArticleForm";
import ReviewList from "@pages/articles/reviewList";
import ReviewArticle from "@pages/articles/ReviewArticle";
import AssignmentList from "@pages/assignments/AssignmentList";
import CreateAssignments from "@pages/assignments/createAssignments";
// import CreateAssignments from "@pages/assignments/CreateAssignments";
import QuizFormat from "@pages/assignments/QuizFormat";
import TProfile from "@pages/profiles/TProfile";

import LeaderBoard from "@pages/leaderboard/LeaderBoard";
import QuizEnd from "@pages/quizes/QuizEnd";
import History from "@pages/quizes/History";
import Friends from "@pages/quizes/Friends";
import Dashboard from "@pages/admin/Dashboard";
import Notifications from "@pages/admin/Notifications";
import ReviewQuiz from "@pages/quizes/ReviewQuiz";
import ReviewQuizList from "@pages/quizes/ReviewQuizList";


import ApproveTeachers from "@pages/admin/approveTeachers";
import TopTeachers from "@pages/admin/TopTeachers";
import SubjectCatalog from "@pages/subjects/SubjectCatalog";
import Chat from "@components/chat/Chat";
import "./index.css";

import Subject from "@pages/subjects/Subject";
import UserManagement from "@pages/admin/UserManagement";
import Reports from "@pages/admin/Reports";
import ViewArticleMyself from "@pages/articles/ViewArticleMyself";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/quiz" element={<QuizHome />}></Route>
        <Route path="/quiz/1" element={<Quiz />}></Route>
        <Route path="/quizend/1" element={<QuizEnd />}></Route>
        <Route path="/history/1" element={<History />}></Route>
        <Route path="/friends/1" element={<Friends />}></Route>
        <Route path="/leaderboard/1" element={<LeaderBoard />}></Route>
        <Route path="/quiz" element={<QuizHome />}></Route>
        <Route path="/quiz/:subject" element={<Quiz />}></Route>
        <Route path="/quizend/1" element={<QuizEnd />}></Route>
        <Route path="/history/1" element={<History />}></Route>
        <Route path="/friends/1" element={<Friends />}></Route>
        <Route path="leaderboard/1" element={<LeaderBoard />}></Route>
        <Route path="/articles" element={<Articles />}></Route>
        <Route
          path="/readArticles/:articleId"
          element={<ReadArticles />}
        ></Route>
        <Route path="/addArticles" element={<AddArticles />}></Route>
        <Route path="/addArticleForm" element={<AddArticleForm />}></Route>
        <Route path="/reviewList" element={<ReviewList />}></Route>
        <Route
          path="/reviewArticle/:articleId"
          element={<ReviewArticle />}
        ></Route>
        <Route path="/assignmentList" element={<AssignmentList />}></Route>

        <Route path="/tProfile" element={<TProfile />}></Route>
        <Route
          path="/createAssignments"
          element={<CreateAssignments />}
        ></Route>
        <Route path="/quizFormat" element={<QuizFormat />}></Route>

        <Route
          path="/createAssignments"
          element={<CreateAssignments />}
        ></Route>
        <Route path="/quizFormat" element={<QuizFormat />}></Route>

        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/ModeratorDetails" element={<ModeratorDetails/>}></Route>
        <Route path="/ModeratorManagement" element={<ModeratorManagement/>}></Route>
        <Route path="/Notifications" element={<Notifications/>}></Route>
        <Route path="/reviewQuiz" element={<ReviewQuiz/>}></Route>
        <Route path="/reviewQuizList" element={<ReviewQuizList/>}></Route>

        <Route path="/quizFormat" element={<QuizFormat />}></Route>
        <Route path="/chat" element={<Chat />}></Route>

        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/UserManagement" element={<UserManagement />}></Route>
        <Route path="/Reports" element={<Reports />}></Route>
        {/* <Route path="/ModeratorDetails" element={<ModeratorDetails />}></Route>
        <Route
          path="/ModeratorManagement"
          element={<ModeratorManagement />}
        ></Route> */}
        <Route path="/Notifications" element={<Notifications />}></Route>

        <Route path="/ApproveTeachers" element={<ApproveTeachers />}></Route>
        <Route path="/TopTeachers" element={<TopTeachers />}></Route>
        <Route path="/ViewMyArticles/1" element={<ViewArticleMyself />}></Route>
        <Route path="/SubjectCatalog" element={<SubjectCatalog />}></Route>
        <Route path="/subject" element={<Subject />}></Route>

      </Routes>
    </div>
  );
}

export default App;
