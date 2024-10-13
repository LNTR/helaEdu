import React, { useState } from 'react';

const EditProfilePopup = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className='text-3xl flex justify-center font-bold my-6'>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-2xl">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-2xl">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-2xl">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md" disabled
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-2xl">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md" disabled
            />
          </div>
          <button type="submit" className="bg-green-500 text-xl text-white px-4 py-2 rounded-md">Save</button>
          <button onClick={onClose} className="ml-2 bg-red-500 text-xl text-white px-4 py-2 rounded-md">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
