import React, { useState } from 'react';

function AddReport({ onCancel, commentId, articleId }) {
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
      const response = await addComment(commentData);
      console.log("Create reply response:", response);
      setReplyText('');
      setIsPopupOpen(false); 
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
              placeholder="Type your reply..."
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
