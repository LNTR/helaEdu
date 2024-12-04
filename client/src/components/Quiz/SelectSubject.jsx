import React, { useEffect, useState } from 'react'
import maths from "@assets/img/subjects/maths.png";
import science from "@assets/img/subjects/2.png";
import geography from "@assets/img/subjects/3.png";
import bussiness from "@assets/img/subjects/4.png";
import buddhism from "@assets/img/subjects/5.png";
import islam from "@assets/img/subjects/6.png";
import christian from "@assets/img/subjects/7.png";
import hinduism from "@assets/img/subjects/8.png";
import { useNavigate } from "react-router-dom";
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { getEnrolledSubjects } from '@services/StudentService';

const StartQuiz = () => {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]); 

  useEffect(() => {
    getEnrolledSubjects(headers)
      .then((res) => {
        setSubjects(res.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch enrolled subjects:", err);
        setError("Failed to load subjects. Please try again later.");
        setLoading(false);
      });
  }, []);
  const navigator = useNavigate()

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    document.getElementById('subjects_modal').close(); 
    navigator(`./${subject}`)
  };

  return (
    <>
      <div className='button-29 animate-bounce animate-thrice animate-duration-1000 animate-ease-linear animate-normal mt-10' onClick={() => document.getElementById('subjects_modal').showModal()}>Start Quiz!</div>
      <dialog id="subjects_modal" className="modal">
        <div className="modal-box w-11/12 max-w-7xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="s-topic text-blue text-center">Select your subject</h3>
          <div className='w-full p-2'></div>
          <div className='grid grid-cols-7 gap-12'>
          {subjects.map(subject => (
            <button className="lg:tooltip custom-tooltip" data-tip={subject.subjectName} onClick={() => handleSubjectClick(subject.subjectId)}>
              <div className='subject-circles'>
                <img src={subject.coverImgRef} alt="image" />
              </div>
            </button>
            ))}
          </div>
        </div>
      </dialog>
    </>
  )
}

export default StartQuiz