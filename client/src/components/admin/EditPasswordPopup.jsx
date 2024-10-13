import React, { useState } from 'react';

const EditPasswordPopup = ({ isOpen, onClose, onSave }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(passwordData);
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className='text-3xl flex justify-center font-bold my-6'>Edit Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-2xl">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-2xl">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-2xl">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button type="submit" className="bg-green-500 text-xl text-white px-4 py-2 rounded-md">Save</button>
          <button onClick={onClose} className="ml-2 bg-red-500 text-xl  text-white px-4 py-2 rounded-md">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditPasswordPopup;
