import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header, Footer } from '@components/common';
import Sidebar from '@components/admin/Sidebar';
import SubjectFile from '@components/admin/SubjectFile';
import AddTextBookPopup from '@components/admin/AddTextBookPopup';
import { listSubjectsByGrade } from '@services/SubjectService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function SelectedSub() {
  const location = useLocation();
  const { grade } = location.state;
  const [openPopup, setOpenPopup] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const openPopupFunc = () => setOpenPopup(true);
  const closePopupFunc = () => setOpenPopup(false);

  const goBack = () => {
    window.history.back();
  };

  const fetchSubjects = async () => {
    try {
      const response = await listSubjectsByGrade(grade);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [grade]);

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
              <hr className="border-yellow border-t-4 w-40" />
              <div className="flex justify-end">
                <button className="bg-blue px-6 py-3 rounded-xl text-2xl text-white" onClick={openPopupFunc}>
                  Add Text Books
                </button>
              </div>
              <div className="grid grid-cols-6 gap-6 my-20">
                {subjects.map((subject, index) => (
                  <SubjectFile key={index} subject={subject} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {openPopup && (
          <AddTextBookPopup grade={grade} onClose={closePopupFunc} onSuccess={fetchSubjects} />
        )}
      </div>
      <Footer />
    </>
  );
}
