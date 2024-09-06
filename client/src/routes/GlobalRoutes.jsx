import { Landing } from "@/components/landing";
import { Route, Routes } from "react-router-dom";
import Quiz from "@pages/quizes/Quiz";
import QuizHome from "@pages/quizes/QuizHome";
import Auth from "@pages/auth/Auth";
import AssignmentList from "@pages/assignments/AssignmentList";
import CreateAssignments from "@pages/assignments/CreateAssignments";
import QuizFormat from "@pages/assignments/QuizFormat";
import TProfile from "@pages/profiles/TProfile";
import SProfile from "@pages/profiles/SProfile";
import LeaderBoard from "@pages/leaderboard/LeaderBoard";
import History from "@pages/quizes/History";
import Friends from "@pages/quizes/Friends";
import AllNotes from "@pages/personalNotes/AllNotes";
import NewNote from "@pages/personalNotes/NewNote";
import Dashboard from "@pages/admin/Dashboard";
import ModeratorDetails from "@pages/admin/ModeratorDetails";
// import ModeratorManagement from "@pages/admin/ModeratorManagement";
import Notifications from "@pages/admin/Notifications";
import ReviewQuiz from "@pages/quizes/ReviewQuiz";
import ReviewQuizList from "@pages/quizes/ReviewQuizList";

// import ApproveTeachers from "@pages/admin/ApproveTeachers";
// import TopTeachers from "@pages/admin/TopTeachers";
import SubjectCatalog from "@pages/subjects/SubjectCatalog";
import Test from "@components/test/Test";
import ViewArticleMyself from "@pages/articles/ViewArticleMyself";
import Subject from "@pages/subjects/Subject";
import UserManagement from "@pages/admin/UserManagement";
import Settings from "@pages/admin/Settings";
import Reports from "@pages/admin/Reports";
import ModDashboard from "@pages/profiles/ModDashboard";
import HeroLanding from "@pages/landing/HeroLanding";
import PremiumPlan from "@pages/landing/PremiumPlan";
import ReputationPoints from "@pages/reputation/ReputationPoints";
import Summary from "@pages/reputation/Summary";
import Votes from "@pages/reputation/Votes";
import Comments from "@pages/reputation/Comments";
import Badges from "@pages/reputation/Badges";
import ReviewdQuiz from "@pages/assignments/ReviewdQuiz";
import QuestionsList from "@pages/assignments/QuestionsList";
import Complaints from "@pages/admin/Complaints";
import QuizA from "@pages/attemptAssignment/Quiz";
function GlobalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HeroLanding />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/quiz" element={<QuizHome />} />
      <Route path="/quiz/:subject" element={<Quiz />} />
      <Route path="/history/1" element={<History />} />
      <Route path="/friends/1" element={<Friends />} />
      <Route path="/leaderboard/1" element={<LeaderBoard />} />
      <Route path="/assignmentList" element={<AssignmentList />} />
      <Route path="/tProfile" element={<TProfile />} />
      <Route path="/sProfile" element={<SProfile />} />
      <Route path="/createAssignments" element={<CreateAssignments />} />

      <Route path="/quizFormat/:assignmentId" element={<QuizFormat />} />
      <Route path="/test" element={<Test />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/moderatorDetails" element={<ModeratorDetails />} />
      {/* <Route path="/moderatorManagement" element={<ModeratorManagement />} /> */}
      <Route path="/notifications" element={<Notifications />} />
    
      <Route
        path="/viewArticleMyself/:articleId"
        element={<ViewArticleMyself />}
      />
      <Route path="/subjectCatalog" element={<SubjectCatalog />} />
      <Route path="/userManagement" element={<UserManagement />} />
      <Route path="/Settings" element={<Settings />}></Route>
      <Route path="/Reports" element={<Reports />}></Route>
      <Route path="/subject/:subject" element={<Subject />} />
      <Route path="/reviewQuiz" element={<ReviewQuiz />} />
      <Route path="/reviewQuizList" element={<ReviewQuizList />} />
      <Route path="/modDashboard" element={<ModDashboard />} />
      <Route path="/notes" element={<AllNotes />} />
      <Route path="/notes/new" element={<NewNote />} />
      <Route path="/land" element={<HeroLanding />} />
      <Route path="/premiumPlan" element={<PremiumPlan />} />
      <Route path="/reputationPoints" element={<ReputationPoints/>} />
      <Route path="/summary" element={<Summary/>} />
      <Route path="/votes" element={<Votes/>} />
      <Route path="/comments" element={<Comments/>} />
      <Route path="/badges" element={<Badges/>} />
      <Route path="/reviewQuizzes" element={<ReviewdQuiz/>} />
      <Route path="/questionList" element={<QuestionsList/>}/>
      <Route path="/complaints" element={<Complaints/>}/>
      <Route path="/quizStart/:assignmentId" element={<QuizA/>}/>
    </Routes>
  );
}
export default GlobalRoutes;
