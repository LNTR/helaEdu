import React, { useEffect, useState } from 'react';
import { getUserDetails } from '@services/TeacherService';

export default function TeacherProfileModal({ teacherId, onClose }) {
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchTeacherDetails = async () => {
      try {
        const response = await getUserDetails(teacherId);
        const data = await response.json();
        setTeacherDetails(data);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [teacherId]);

//   if (loading) return <div>Loading...</div>;

  return (
    <dialog open className="modal">
      <div className="modal-box">
        <button onClick={onClose} className="btn btn-sm btn-circle btn-outline float-right">✕</button>
        {teacherDetails ? (
          <div className="flex flex-col items-center">
            <img src={teacherDetails.profileImage} alt="Profile" className="rounded-full w-24 h-24 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{teacherDetails.firstName}</h2>
            <p className="text-lg">Email: {teacherDetails.email}</p>
            <p className="text-lg">Contact: {teacherDetails.contactNo}</p>
            <p className="text-lg">School: {teacherDetails.school}</p>
            <div className="my-4">
              <h3 className="text-xl font-semibold">Subjects</h3>
              <ul>
                {teacherDetails.subjects.map((subject, index) => (
                  <li key={index} className="text-lg">{subject}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No teacher details available.</p>
        )}
      </div>
    </dialog>
  );
}
