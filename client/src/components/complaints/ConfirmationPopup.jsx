import React from 'react';

export default function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3 text-center shadow-lg">
        <p className="text-3xl font-semibold mb-4">{message}</p><br></br>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-blue text-white py-2 px-4 rounded  text-2xl"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white py-2 px-4 rounded text-2xl"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
