import React, { useState } from 'react';
import { deleteCommentByAuthor } from '@services/ArticleService';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function DeleteComment({ onCancel, commentId }) {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const [isPopupOpen, setIsPopupOpen] = useState(true); 
  const [error, setError] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      console.log("Authorization Header:", headers);
      const response = await deleteCommentByAuthor(commentId, headers);
      setIsPopupOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete comment", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setIsPopupOpen(false);
    onCancel();
  };

  return (
    <>
      {isPopupOpen && (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="popup-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this comment?</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-2xl text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-400 text-2xl text-white px-4 py-2 rounded-md"
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

export default DeleteComment;
