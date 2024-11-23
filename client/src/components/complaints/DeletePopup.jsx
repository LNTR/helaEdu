import React from 'react';

function DeletePopup({ onCancel, onDelete }) {
  return (
    <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="popup-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-4">Are you sure you want to delete this complaint? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onDelete} className="bg-red-600 text-white px-4 py-2 rounded-md text-2xl">Delete</button>
          <button onClick={onCancel} className="bg-blue text-white px-4 py-2 rounded-md text-2xl">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopup;
