import { Routes, Route } from "react-router-dom";
import {
  ArticleRoutes,
  GlobalRoutes,
  QuizRoutes,
  AssignmentRoutes,
  SubjectRoutes,
} from "@routes";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/articles/*" element={<ArticleRoutes />} />
        <Route path="/quiz/*" element={<QuizRoutes />} />
        <Route path="/assignments/*" element={<AssignmentRoutes />} />
        <Route path="/subjects/*" element={<SubjectRoutes />} />
        <Route path="/*" element={<GlobalRoutes />} />
      </Routes>
    </div>
  );
}

export default App;
