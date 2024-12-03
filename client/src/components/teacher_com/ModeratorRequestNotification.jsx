import React, { useState ,useEffects} from 'react';
import { promoteToModerator, declinePromoting } from '@services/TeacherService';

export default function ModeratorRequestNotification({ assignedSubject, userId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openApproveModal = () => setIsModalOpen(true);
  const openDeclineModal = () => setIsDeclineModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeclineModalOpen(false);
  };

  const handleApprove = () => {
    setIsLoading(true);
    promoteToModerator(userId)
      .then(() => {
        setIsLoading(false);
        setIsModalOpen(false);
        alert('You have  successfully accepted this upgrating request.');
      })
      .catch(() => {
        setIsLoading(false);
        alert('Failed to accept request.');
      });
  };

  const handleDecline = () => {
    setIsLoading(true);
    declinePromoting(userId)
      .then(() => {
        setIsLoading(false);
        setIsDeclineModalOpen(false);
        alert('Moderator request declined successfully.');
      })
      .catch(() => {
        setIsLoading(false);
        alert('Failed to decline the request.');
      });
  };

  return (
    <div>
      <div role="alert" className="alert shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info h-6 w-6 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 className="font-bold text-2xl">Moderator Upgrade Request</h3>
          <div className="text-lg">
            Admin has requested to upgrade your account to a Moderator role.
            Please review and take action.
            {/* <p className="text-lg">
              Your Assigned Subjects : <span className="text-blue font-bold">{assignedSubject}</span>
            </p> */}
          </div>
        </div>
        <button onClick={openApproveModal} className="btn btn-sm bg-blue text-white">
          Approve Request
        </button>
        <button onClick={openDeclineModal} className="btn btn-sm bg-red-400 text-white">
          Decline Request
        </button>
      </div>



      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <p className="py-4 text-3xl">Are you sure you want to accept this moderator request?</p>
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

      {isDeclineModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <p className="py-4 text-3xl">Are you sure you want to decline this moderator request?</p>
            <div className="modal-action">
              <button className="btn bg-red-400 text-black" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`btn bg-yellow text-black ${isLoading && 'opacity-50'}`}
                onClick={handleDecline}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Decline'}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
