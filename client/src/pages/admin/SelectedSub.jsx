import React  from 'react'
import { useLocation } from 'react-router-dom';
import {Header,Footer} from '@components/common';
import Sidebar from '@components/admin/Sidebar';
import SubjectFile from '@components/admin/SubjectFile';


export default function SelectedSub() {
  const location = useLocation();
  const { grade } = location.state;
  const Subjects = [
    {
      subjectId: 1,
      subject: "Science",
    },
    {
      subjectId: 2,
      subject: "Mathematics part II",
    }, 
  ];
  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-wrapper">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="content-wrapper">
            <div className="mx-32 mt-10">
              <h1>{grade}</h1>
              <div className='flex justify-end'>
                  <button className='bg-blue px-6 py-3 rounded-xl text-2xl text-white'>Add Subjects</button>
              </div>
              <div className='grid grid-cols-6 gap-6 my-20'>
                {Subjects.map((subjects,index)=>(
                   <SubjectFile key={index} subjects={subjects}/>

                ))}
              
              </div>
             
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
