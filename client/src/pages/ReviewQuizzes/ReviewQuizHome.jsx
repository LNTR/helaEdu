import React, { useEffect, useState } from 'react';
import Sidebar from '@components/moderator_com/ModeratorSidebar';
import { Header } from '@components/common';
import SelectGrades from '@components/moderator_com/SelectGrades';
import { listTeacherDetails } from '@services/TeacherService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { getSubjectById } from '@services/SubjectService';
import LoadingComponent from '@components/common/LoadingComponent';

export default function ReviewQuizHome() {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const [sidebar, setSidebar] = useState(false);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [subjectsDetails, setSubjectsDetails] = useState([]);
  const [loadingState,setLoadingState] = useState(false);
  useEffect(() => {
    const fetchTeacherDetails = async () => {
      setLoadingState(true);
      try {
      
        const teacherDetails = await listTeacherDetails(headers);
        const subjects = teacherDetails.data.assignedSubjects;
        console.log("Assigned Subjects: ", subjects); 
        setAssignedSubjects(subjects);

        if (subjects.length === 0) {
          console.log("No subjects found for the teacher.");
          return;
        }

        const subjectDetailsArray = [];
       
        for (const subjectId of subjects) {
          console.log("Fetching subject detail for: ", subjectId); 
          const subjectDetail = await getSubjectById(subjectId);
          console.log("get subject detail for: ", subjectDetail.data); 
          subjectDetailsArray.push(subjectDetail.data);
        }
       
        setSubjectsDetails(subjectDetailsArray);
      } catch (error) {
        console.error('Error fetching teacher details or subjects:', error);
      }finally{
        setLoadingState(false);
      }
    };

    fetchTeacherDetails();
  }, [])

  return (
    <>
      <Header />
      <div className="dashboard h-screen mx-auto" style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }} onClick={() => setSidebar(false)}>
        {loadingState? <LoadingComponent/>: null}
        <Sidebar value={sidebar} setValue={setSidebar} />
        <div className="content-wrapper mx-64 border">
          <h1 className="mx-10 my-14">Weekly Quizzes</h1>
          <div className="grid grid-cols-4 gap-4 my-20">
          {subjectsDetails.map((subjectDetail, index) => (
            <SelectGrades key={index} subjectDetails={subjectDetail} />
          ))}

          </div>
        </div>
      </div>
    </>
  );
}
