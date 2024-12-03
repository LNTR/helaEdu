import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import TeacherProfileModal from './TeacherProfileModal';
import { askingToPromote } from '@services/TeacherService';
import { listSubjectsByGrade } from '@services/SubjectService';

export default function TableRowTopTeachers({ teacherId, firstName, email, points }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedGrades.length > 0) {
      const fetchSubjects = async (grade) => {
        try {
          const data = await listSubjectsByGrade(grade);
          setSubjects((prevSubjects) => ({
            ...prevSubjects,
            [grade]: data.data, 
          }));
        } catch (error) {
          console.error('Failed to fetch subjects', error);
        }
      };

      selectedGrades.forEach(fetchSubjects); 
    }
  }, [selectedGrades]);

  const openViewModal = () => setIsViewModalOpen(true);
  const closeViewModal = () => setIsViewModalOpen(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGrades([]);
    setSelectedSubjects({});
    setErrorMessage('');
  };

  const handleGradeSelect = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handleSubjectSelect = (grade, subjectId) => {
    setSelectedSubjects((prev) => ({ ...prev, [grade]: subjectId }));
  };
  const handleApprove = async () => {
    if (Object.keys(selectedSubjects).length === 0) {
      setErrorMessage("Please select at least one subject.");
      return;
    }
    try {
      setIsLoading(true);
      const subjectIds = Object.values(selectedSubjects).filter(subjectId => subjectId !== null);
      await askingToPromote(teacherId, subjectIds);
  
      alert("Teacher promotion request sent successfully!");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send promotion request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className='flex justify-center my-4'>
      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <p className="py-4 text-3xl">Are you sure you want to upgrade this teacher as a moderator?</p>
            <div className='items-center'>
              <form>
               <p className="py-4 text-2xl">Select the subjects that you want to assign this teacher for :</p>
                {['Grade 6', 'Grade 7', 'Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','Grade 13'].map((grade) => (
                  <div key={grade} className="mb-4">
                    <label className="block text-lg font-medium">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedGrades.includes(grade)}
                        onChange={() => handleGradeSelect(grade)}
                      />
                      {grade}
                    </label>
                    {selectedGrades.includes(grade) && (
                      <select
                        className="border border-blue rounded-xl px-5 py-2 w-full mt-2"
                        onChange={(e) => handleSubjectSelect(grade, e.target.value)}
                        value={selectedSubjects[grade] || ''}
                      >
                        <option value="">Select a Subject</option>
                        {subjects[grade]?.map((subject) => (
                          <option key={subject.subjectId} value={subject.subjectId}>
                            {subject.subjectName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}

                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
              </form>
            </div>
            <div className="modal-action">
              <button className="btn bg-red-400 text-black" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`btn bg-yellow text-black ${isLoading && 'opacity-50'}`}
                onClick={handleApprove}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </dialog>
      )}

      {isViewModalOpen && (
        <TeacherProfileModal teacherId={teacherId} onClose={closeViewModal} />
      )}

      <div className='border border-blue rounded-3xl w-10/12 h-16 px-7 py-4 flex justify-between items-center'>
        <div className="bg-yellow rounded-full w-10 h-10 flex items-center justify-center mr-4">
          <span className="text-white text-lg font-bold">{firstName.charAt(0)}</span>
        </div>
        <div className='flex-1 text-left flex justify-start'>
          <p className='text-xl'>{firstName}</p>
        </div>
        <div className='flex-1 text-left'>
          <p className='text-xl'>{email}</p>
        </div>
        <div className='flex-1 text-left'>
          <p className='text-xl'>{points}</p>
        </div>
        <div className='flex items-center'>
          <div className='mx-1' onClick={openViewModal}>
            <FontAwesomeIcon icon={faEye} className='text-2xl m-2 hover:text-yellow hover:translate-x-1' />
          </div>
          <div className='mx-1'>
            <div className='rounded-3xl bg-yellow px-2 hover:translate-x-1 cursor-pointer' onClick={openModal}>
              <p className='text-xl py-2'>Upgrade as Moderator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
