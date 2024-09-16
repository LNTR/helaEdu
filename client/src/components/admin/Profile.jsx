import React, { useState } from 'react';
import ProfilePhoto from '@/assets/img/articles/profile.jpg';

const AdminDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: 'Pathumi Ahinsa',
    email: 'pathuahinsa@example.com',
    password: '2423535',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const admin = {
    profilePhoto: ProfilePhoto, 
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handlePasswordEdit = () => {
    setIsEditingPassword(!isEditingPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here (e.g., API call)
    console.log('Form Data:', formData);
  };

  return (
    <div className="my-20">
      <div className="bg-white shadow-2xl rounded-lg p-12">
        <div className="flex justify-start">
          <div className="w-1/3 flex justify-center">
            <img
              src={admin.profilePhoto}
              alt="Profile Photo"
              className="w-72 h-72 rounded-full object-cover border-4 border-blue shadow-xl"
            />
          </div>
          <div className="w-2/3">
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-4">
                <label className="block mb-2 text-2xl">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue"
                  />
                ) : (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue"
                  disabled/>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-2xl">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue"
                    disabled
                  />
               
              </div>
              
              {isEditingPassword && (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 text-2xl">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-2xl">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-2xl">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between items-center mt-6 ">
                <div className='flex justify-start items-center w-3/5'>
                  <button
                    type="button"
                    className="text-2xl bg-blue text-white py-2 px-4 mr-7 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={handleEdit}
                  >
                    {isEditing ? 'Cancel' : 'Update'}
                  </button>
                  {isEditing && (
                    <button
                      type="submit"
                      className="text-2xl bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                  )}
                </div>
                <div  className='flex justify-between items-center w-2/5'>
                  <button
                    type="button"
                    className="text-2xl bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                    onClick={handlePasswordEdit}
                  >
                    {isEditingPassword ? 'Cancel Password Update' : 'Update Password'}
                  </button>
                </div>
                
               
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
