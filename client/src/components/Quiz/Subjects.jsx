import React, { useEffect, useState } from 'react'
import maths from "@assets/img/subjects/maths.png";
import science from "@assets/img/subjects/2.png";
import geography from "@assets/img/subjects/3.png";
import bussiness from "@assets/img/subjects/4.png";
import buddhism from "@assets/img/subjects/5.png";
import islam from "@assets/img/subjects/6.png";
import christian from "@assets/img/subjects/7.png";
import hinduism from "@assets/img/subjects/8.png";
import { useNavigate } from 'react-router-dom';
import { getEnrolledSubjects } from '@services/StudentService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
 

const Subjects = () => {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const [subjects, setSubjects] = useState([]); // State to store subjects
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching enrolled subjects...");
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

  // useEffect(() => {
  //   console.log("Fetching enrolled subjects...");
  //   getEnrolledSubjects(headers)
  //     .then((res) => {
  //       console.log(res.data);
  //     })
  //     .catch((error) => {
  //       console.error("Failed to fetch enrolled subjects:", error);
  //     });
  // }, []); 

  const subjects1 = [
    {
      "value": maths,
      "name": "Mathematics"
    },
    {
      "value": science,
      "name": "Science"
    }
  ]

  const navigator = useNavigate()

  const handleSubjectClick = (subject) => {
    navigator(`./${subject}`)
  };


  return (
    <div className='w-9/12 m-auto my-20'>
      <h1 className='font-medium p-8'>Choose your subject</h1>
      <div className='grid grid-cols-6 gap-12'>
        {subjects.map(subject => (
          <div className='subject-cards hover:cursor-pointer' onClick={() => handleSubjectClick(subject.subjectName)}>
            <img src={subject.coverImgRef} alt="image" />
            <div className='text-1'>{subject.subjectName}</div>
          </div>
        ))}
      </div>
      <div className='flex justify-center my-12'>
        <button className='bg-black text-white rounded-full font-normal text-1 px-60 py-4 mx-auto' >Enroll in more subjects</button>
      </div>
    </div>
  )
}

export default Subjects