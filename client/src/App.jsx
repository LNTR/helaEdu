
import { Landing } from "@/components/landing";
import {  Route, Routes } from 'react-router-dom';
import Quiz from "./pages/quizes/Quiz";
import Articles from "./pages/articles/Articles";
import ReadArticles from "./pages/articles/ReadArticles";
import AddArticles from "./pages/articles/AddArticles";
import AddArticleForm from "./pages/articles/AddArticleForm";
import TextEditor from "./components/articles/TextEditor";
function App() {
  return (
    <div>
  
      <Routes>
    {/* http://localhost:5173/ */}
    <Route path="/" element={<Landing />}></Route>
    {/* http://localhost:5173/quiz */}
        <Route path='/quiz' element={<Quiz/>}></Route>
        <Route path="/articles" element={<Articles />}></Route>
        <Route path="/readArticles" element={<ReadArticles />}></Route>
        <Route path="/addArticles" element={<AddArticles />}></Route>
        <Route path="/addArticleForm" element={<AddArticleForm />}></Route>
        <Route path="/textEditor" element={<TextEditor />}></Route>
      </Routes>
   
   </div> 
  )  
}
export default App;


