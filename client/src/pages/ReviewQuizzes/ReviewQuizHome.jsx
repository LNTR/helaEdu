import React , {useState} from 'react'
import Sidebar from '@components/moderator_com/ModeratorSidebar'
import { Header } from '@components/common';
import SelectGrades from '@components/moderator_com/SelectGrades';

export default function ReviewQuizHome() {
    const [sidebar, setSidebar] = useState(false);
    const Grades = ["Grade 6","Grade 7","Grade 8", "Grade 9","Grade 10","Grade 11","Grade 12","Grade 13" ];
    return (
  
      <>
        <Header />
        <div className="dashboard h-screen mx-auto" style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }} onClick={() => setSidebar(false)}>
          <Sidebar value={sidebar} setValue={setSidebar} />
          <div className="content-wrapper mx-64 border" >
            <h1 className="mx-10 my-14">Weekly Quizzes
            </h1>
            <div className="grid grid-cols-4 gap-4 my-20">
                {Grades.map((grade, index) => (
                  <SelectGrades key={index} grade={grade} />
                ))}
            </div>
          </div>
        </div>
  
      </>
    )
}
