import React, { useEffect, useState } from 'react';
import Profile from '@assets/img/articles/profile.jpg';
import { getStudentById } from '@services/StudentService';
export default function TopScore({ topScores }) {
  const [studentDetails, setStudentDetails] = useState([]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const fetchedDetails = await Promise.all(
        topScores.map(async ({ studentId, score }) => {
          try {
            const student = await getStudentById(studentId);
            console.log(student);
            return {
              id: studentId,
              name: student.data.firstName || 'Unknown Student',
              profileImage: student.data.profilePictureUrl || Profile,
              score: parseFloat(score).toFixed(2),
            };
          } catch (error) {
            console.error(`Failed to fetch details for student ${studentId}:`, error);
            return { id: studentId, name: 'Error Loading', profileImage: Profile, score };
          }
        })
      );
      setStudentDetails(fetchedDetails);
    };

    fetchStudentDetails();
  }, [topScores]);

  return (
    <div>
      <h3 className="text-4xl mb-4">Top Scores</h3>
      <div className="justify-center mt-14">
        {studentDetails.map((student, index) => (
          <div
            key={student.id}
            className="rounded-2xl border border-blue w-3/4 mx-40 h-20 flex justify-start px-5 py-2 my-3"
          >
            <div className="w-14 mr-10 h-14 p-2 rounded-full bg-blue text-white">
              <p>{index + 1}</p>
            </div>
            <div className="w-3/5 flex justify-start">
              <img src={student.profileImage} alt="Profile" className="w-14 h-14 rounded-full" />
              <p className="py-2 text-2xl">{student.name}</p>
            </div>
            <div className="w-2/5 py-2">
              <p>{student.score} %</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
