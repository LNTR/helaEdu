import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import TeacherProfileModal from './TeacherProfileModal';
import { askingToPromote } from '@services/TeacherService';

export default function TableRowTopTeachers({ teacherId, firstName, email, points }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [assignedSubject, setAssignedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setAssignedSubject('');
    setErrorMessage('');
  };

  const openViewModal = () => setIsViewModalOpen(true);
  const closeViewModal = () => setIsViewModalOpen(false);

  const handleApprove = async () => {
    if (!assignedSubject.trim()) {
      setErrorMessage('Assigned subject is required.');
      return;
    }

    try {
      setIsLoading(true);
      await askingToPromote(teacherId, assignedSubject);
      alert('Teacher promotion request sent successfully!');
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to send promotion request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center my-4'>
      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <p className="py-4 text-3xl">Are you sure you want to approve this teacher?</p>
            <div>
              <form>
                <input
                  type="text"
                  placeholder="Assigned Subject"
                  value={assignedSubject}
                  onChange={(e) => setAssignedSubject(e.target.value)}
                  className="border border-blue rounded-xl px-5 py-3 w-full"
                  required
                />
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
