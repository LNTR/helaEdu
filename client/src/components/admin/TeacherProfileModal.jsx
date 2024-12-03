import React, { useEffect, useState } from 'react';
import { getUserDetails } from '@services/TeacherService';
import Profile from "@assets/img/articles/profile.jpg"
export default function TeacherProfileModal({ teacherId, onClose }) {
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await getUserDetails(teacherId);
        console.log(response);
        const data = response.data;
        setTeacherDetails(data);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [teacherId]);

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <button onClick={onClose} className="btn btn-sm btn-circle btn-outline float-right">✕</button>
        {loading ? (
          <p>Loading...</p>
        ) : teacherDetails ? (
          <div className="flex flex-col items-center">
            {teacherDetails.profilePictureUrl ? 
             <img src={teacherDetails.profilePictureUrl} alt="Profile" className="rounded-full w-24 h-24 mb-4" /> :
             <img src={Profile} alt="Profile" className="rounded-full w-24 h-24 mb-4" />
            }
           
            <h2 className="text-2xl font-bold mb-2">{teacherDetails.firstName}  {teacherDetails.lastName}</h2>
            <p className="text-lg"><span className='font-semibold'>Email:</span> {teacherDetails.email}</p>
            <p className="text-lg"><span className='font-semibold'>School:</span>{teacherDetails.school ?teacherDetails.school : "None" }</p>
            <p className="text-lg"><span className='font-semibold'>Reputation Points:</span>{teacherDetails.points ?teacherDetails.points : "0" }</p>
            <div className="my-4">
            <span className="font-semibold">Subjects</span>
              {Array.isArray(teacherDetails.subjects) && teacherDetails.subjects.length > 0 ? (
                <ul>
                  {teacherDetails.subjects.map((subject, index) => (
                    <li key={index} className="text-lg">{subject}</li>
                  ))}
                </ul>
              ) : (
                <p className='text-lg'>No subjects available.</p>
              )}
            </div>
          </div>
        ) : (
          <p>No teacher details available.</p>
        )}
      </div>
    </dialog>
  );
}
