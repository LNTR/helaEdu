import React, { useState } from 'react';
import { deleteAdmin } from '@services/AdminService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useNavigate } from 'react-router-dom';

const DeleteProfileSection = () => {

  const navigate=useNavigate();
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control the popup

  const handleDeleteClick = () => {
    setIsPopupOpen(true); // Open the confirmation popup
  };

  const handleConfirmDelete = async () => {
    try {

      await deleteAdmin(headers);

      alert('Deleted successfully');
      navigate("/auth");
      setIsPopupOpen(false);

    } catch (error) {
      console.log('Error deleting profile:', error);
      setIsPopupOpen(false); 
    }
  };

  const handleCancelDelete = () => {
    setIsPopupOpen(false); 
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg" style={{ marginTop: '50px', width: '300px' }}>
      <h2 className="text-4xl font-extrabold mb-6 text-red-600">Delete Profile</h2>
      <p className="mb-4 text-lg text-gray-800">This action cannot be undone.</p>
      <button
        onClick={handleDeleteClick}
        className="bg-red-500 text-white text-lg px-6 py-3 rounded-lg"
      >
        Delete Profile
      </button>
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 className="text-2xl mb-4">Do you want to delete this account ?</h3>
            <p className="mb-4 text-xl ">This action cannot be undone. Do you want to proceed?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={handleConfirmDelete} className="bg-red-500 text-xl text-white px-4 py-2 rounded-md">Yes, Delete</button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500  text-xl text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProfileSection;
