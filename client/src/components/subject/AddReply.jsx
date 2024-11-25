import React, { useState } from 'react';
import { addCommentForForum } from '@services/SubjectService';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function AddReply({ onCancel, commentId, articleId }) {

  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const [replyText, setReplyText] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(true); 
  const [error, setError] = useState('');

  const handlePost = async (e) => {
    e.preventDefault();

    if (!replyText.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    const commentData = {
      comment: replyText,
      subjectId: subjectId,
      parentId: commentId,
    };

    try {
      const response = await addCommentForForum(commentData,headers);
      console.log("Create reply response:", response);
      setReplyText('');
      setIsPopupOpen(false);
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to post reply", error);
      setError("Failed to post reply. Please try again.");
    }
  };

  const handleCancelReply = () => {
    setIsPopupOpen(false);
    onCancel();
  };

  return (
    <>
      {isPopupOpen && (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="popup-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Add Your Reply</h3>
            <textarea 
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
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
                Post Reply
              </button>
              <button
                onClick={handleCancelReply}
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

export default AddReply;
