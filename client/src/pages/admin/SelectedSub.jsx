import React,{useState}  from 'react'
import { useLocation } from 'react-router-dom';
import {Header,Footer} from '@components/common';
import Sidebar from '@components/admin/Sidebar';
import SubjectFile from '@components/admin/SubjectFile';
import pdfICT from '@assets/temp/pdfICT.pdf';
import pdfMaths from '@assets/temp/pdfMaths.pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { uploadPdf } from '@services/SubjectService';
import { createSubject } from '@services/SubjectService';

export default function SelectedSub() {
  const location = useLocation();
  const { grade } = location.state;
  const [openPopup,setOpenPopup] =useState(false);
  const openPopupFunc=()=>{
    setOpenPopup(true);
  }
  const closePopupFunc=()=>{
    setOpenPopup(false);
  }
  const goBack = () => {
    window.history.back(); 
  };
  const Subjects = [
    {
      subjectId: 1,
      subject: "Science",
      pdf:pdfICT,
    },
    {
      subjectId: 2,
      subject: "Mathematics part II",
      pdf:pdfMaths,
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
              <div className="mb-4 cursor-pointer bg-blue text-white rounded-full w-12 h-12 p-2" onClick={goBack}>
                <FontAwesomeIcon icon={faArrowLeft} size="2x" className="text-gray-700 hover:text-black" />
              </div>
              <h1>{grade}</h1>
              <hr className="border-yellow border-t-4 w-40"></hr>
              <div className='flex justify-end'>
                  <button className='bg-blue px-6 py-3 rounded-xl text-2xl text-white' onClick={openPopupFunc}>Add Text Books</button>
              </div>
              <div className='grid grid-cols-6 gap-6 my-20'>
                {Subjects.map((subjects,index)=>(
                   <SubjectFile key={index} subjects={subjects}/>

                ))}
              
              </div>
             
            </div>
          </div>
        </div>
        {openPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="bg-yellow rounded-full p-3 h-9 w-9 flex justify-items-end cursor-pointer"onClick={closePopupFunc}>
              X
              </div>
              <div className='mx-16'>
                <h3 className="text-4xl mb-4  flex justify-center ">Add Your TextBook</h3>
                <form>
                  <label className='text-3xl my-3'>Subject</label><br></br>
                  <input type="text" className="border border-blue rounded-md px-5 py-3"/><br></br><br></br>
                  <label className='text-3xl my-3'>Language</label><br></br>
                  <input type="text" className="border border-blue rounded-md px-5 py-3"/>
                  <input type="file" placeholder='Subject' className="my-6 w-full"/>
                  <br></br>
                  <button className='bg-blue rounded-md px-5 py-3 text-2xl  text-white my-10'>Submit</button>
                </form>
              </div>

              
            
            
            </div>
          </div>
      )}
      </div>
      <Footer />
    </>
  )
}
