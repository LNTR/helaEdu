import React, { useState } from 'react';
import { addComplaint } from '@services/ComplaintServce';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function AddReport({ onCancel, commentId, articleId }) {

  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const [reportText, setReportText] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(true); 
  const [error, setError] = useState('');

  const handlePost = async (e) => {
    e.preventDefault();

    if (!reportText.trim()) {
      setError("Add your complaint");
      return;
    }
    const reportData = {
      complaint: reportText,
      articleId: articleId,
      commentId: commentId,
    };
    try {
      const response = await addComplaint(reportData, headers);
      console.log("Create reply response:", response);

      if (response.status === 201) {
       
        setReportText(''); 
        setIsPopupOpen(false);
        window.location.reload(); 
      } else {
        setError("Failed to post complaint. Please try again.");
      }
    } catch (error) {
      console.error("Failed to post reply", error);
      setError("Failed to post reply. Please try again.");
    }
  };

  const handleCancelReport = () => {
    setIsPopupOpen(false);
    onCancel();
  };

  return (
    <>
      {isPopupOpen && (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="popup-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Add Your Complaint</h3>
            <textarea 
              value={reportText}
              onChange={(e) => {
                setReportText(e.target.value);
                setError(''); 
              }}
              placeholder="Type your complaint..."
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handlePost}
                className="bg-blue text-2xl text-white px-4 py-2 rounded-md"
              >
                Post Complaint
              </button>
              <button
                onClick={handleCancelReport}
                className="bg-red-600 text-2xl text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddReport;
