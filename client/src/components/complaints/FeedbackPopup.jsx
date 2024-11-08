import React, { useState } from 'react';

function FeedbackPopup({ onCancel, onSubmitFeedback }) {
  const [feedback, setFeedback] = useState('');

  const handleAccept = () => {
    onSubmitFeedback(feedback, 'accept'); // Pass "accept" as the action type
  };

  const handleDecline = () => {
    onSubmitFeedback(feedback, 'decline'); // Pass "decline" as the action type
  };

  return (
    <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="popup-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-semibold mb-4">Review Complaint</h3>
        <p className="mb-4">Do you want to accept or decline this complaint?</p>
        
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback (optional)"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-2xl"
        />
        
        <div className="flex justify-end space-x-4">
          <button 
            onClick={handleAccept} 
            className="bg-green-500 text-white px-4 py-2 rounded-md text-2xl"
          >
            Accept
          </button>
          <button 
            onClick={handleDecline} 
            className="bg-red-500 text-white px-4 py-2 rounded-md text-2xl"
          >
            Decline
          </button>
          <button 
            onClick={onCancel} 
            className="bg-gray1 text-white px-4 py-2 rounded-md text-2xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackPopup;
