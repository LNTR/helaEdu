import { Landing } from "@/components/landing";
import { Route, Routes } from "react-router-dom";

import Auth from "@pages/auth/Auth";

import TProfile from "@pages/profiles/TProfile";
import SProfile from "@pages/profiles/SProfile";

import AllNotes from "@pages/personalNotes/AllNotes";
import NewNote from "@pages/personalNotes/NewNote";
import Dashboard from "@pages/admin/Dashboard";
import ModeratorDetails from "@pages/admin/ModeratorDetails";
// import ModeratorManagement from "@pages/admin/ModeratorManagement";
import Notifications from "@pages/admin/Notifications";

import ReviewQuiz from "@pages/moderator/ReviewQuiz";
import ReviewQuizList from "@pages/moderator/ReviewQuizList";
import Resources from "@pages/moderator/Resources";
import ModNotifications from "@pages/moderator/ModNotifications";
import ModDashboard from "@pages/moderator/ModDashboard";

// import ApproveTeachers from "@pages/admin/ApproveTeachers";
// import TopTeachers from "@pages/admin/TopTeachers";
import Test from "@components/test/Test";
import ViewArticleMyself from "@pages/articles/ViewArticleMyself";
import UserManagement from "@pages/admin/UserManagement";
import Settings from "@pages/admin/Settings";
import Reports from "@pages/admin/Reports";
import HeroLanding from "@pages/landing/HeroLanding";
import PremiumPlan from "@pages/landing/PremiumPlan";
import ReputationPoints from "@pages/reputation/ReputationPoints";
import Summary from "@pages/reputation/Summary";
import Votes from "@pages/reputation/Votes";
import Comments from "@pages/reputation/Comments";
import Badges from "@pages/reputation/Badges";
import QuestionsList from "@pages/assignments/QuestionsList";
import Complaints from "@pages/admin/Complaints";
import QuizA from "@pages/attemptAssignment/Quiz";

import Resource from "@pages/admin/Resourses";
import SelectedSub from "@pages/admin/SelectedSub";

function GlobalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HeroLanding />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/tProfile" element={<TProfile />} />
      <Route path="/sProfile" element={<SProfile />} />

      <Route path="/test" element={<Test />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/moderatorDetails" element={<ModeratorDetails />} />
      {/* <Route path="/moderatorManagement" element={<ModeratorManagement />} /> */}
      <Route path="/notifications" element={<Notifications />} />

      <Route
        path="/viewArticleMyself/:articleId"
        element={<ViewArticleMyself />}
      />
      <Route path="/userManagement" element={<UserManagement />} />
      <Route path="/Settings" element={<Settings />}></Route>
      <Route path="/Reports" element={<Reports />}></Route>

      <Route path="/reviewQuiz" element={<ReviewQuiz />} />
      <Route path="/reviewQuizList" element={<ReviewQuizList />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/modDashboard" element={<ModDashboard />} />
      <Route path="/modNotifications" element={<ModNotifications />} />
      <Route path="/notes" element={<AllNotes />} />
      <Route path="/notes/new" element={<NewNote />} />
      <Route path="/land" element={<HeroLanding />} />
      <Route path="/premiumPlan" element={<PremiumPlan />} />
      <Route path="/reputationPoints" element={<ReputationPoints />} />
      <Route path="/summary" element={<Summary />} />
      <Route path="/votes" element={<Votes />} />
      <Route path="/comments" element={<Comments />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="/questionList" element={<QuestionsList />} />
      <Route path="/complaints" element={<Complaints />} />
      <Route path="/quizStart/:assignmentId" element={<QuizA />} />
      <Route path="/resourse" element={<Resource />} />
      <Route path="/selectedSub" element={<SelectedSub />} />
    </Routes>
  );
}
export default GlobalRoutes;
