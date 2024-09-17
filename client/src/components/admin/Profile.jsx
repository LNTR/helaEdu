import React, { useState, useEffect } from 'react';
import ProfilePhoto from '@/assets/img/articles/profile.jpg';
import { currentAdmin, addProfileImageToAdmin } from '@services/AdminService'; 
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

const AdminDetails = () => {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const [profileImage, setProfileImage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(ProfilePhoto);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const adminData = await currentAdmin(headers);
        setFormData({
          username: adminData.firstname,
          email: adminData.email,
          password: '',
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin details:', error);
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, [headers]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setPreviewSrc(src);
      setProfileImage(file);
    }
  };

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const saveImage = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      alert("Please select an image before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', profileImage);
    formData.append('email', formData.email);

    try {
      const response = await addProfileImageToAdmin(formData.email, formData, headers);
      console.log('Image uploaded successfully:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
    console.log('Form Data:', formData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-20">
      {isPopupOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray1 z-50 bg-opacity-50'>
          <div className='bg-white p-6 rounded-md shadow-md'>
            <form onSubmit={saveImage}>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {previewSrc ? (
                    <img
                      id="preview_img"
                      className="h-40 w-40 object-cover rounded-full"
                      src={previewSrc}
                      alt="Current profile photo"
                    />
                  ) : (
                    <img
                      id="preview_img"
                      className="h-40 w-40 object-cover rounded-full"
                      src={ProfilePhoto}
                      alt="Current profile photo"
                    />
                  )}
                </div>
                <label className="block">
                  <span className="sr-only text-2xl">Choose profile photo</span>
                  <input
                    type="file"
                    onChange={handleProfileImageChange}
                    className="block w-full text-2xl text-gray1
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-2xl file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100"
                    name="profilePicture"
                  />
                </label>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue text-white px-2 py-1 rounded-md text-xl"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 py-1 rounded-md text-xl ml-2"
                  onClick={handleClosePopup}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-lg p-12">
        <div className="flex justify-start">
          <div className="pl-28 w-1/3 flex flex-col justify-center relative">
            <div className="relative">
              <img
                src={ProfilePhoto}
                alt="Profile Photo"
                className="w-72 h-72 rounded-full object-cover shadow-xl"
              />
              <div
                className="absolute bottom-4 right-20 left-11 bg-yellow p-3 rounded-full w-12 h-12 cursor-pointer"
                onClick={handleEditClick}
              >
                <FontAwesomeIcon icon={faPencil} className="size-5" />
              </div>
            </div>
          </div>

          <div className="w-2/3">
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-4">
                <label className="block mb-2 text-2xl">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue"
                  disabled={!isEditing}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block mb-2 text-2xl">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue"
                  disabled
                />
              </div>

              {/* Password Update Fields */}
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

              <div className="flex justify-between items-center mt-6">
                <div className="flex justify-start items-center w-3/5">
                  <button
                    type="button"
                    className="text-2xl bg-blue text-white px-5 py-2 rounded-md"
                    onClick={handleEdit}
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </button>

                  <button
                    type="button"
                    className="ml-4 text-2xl bg-blue text-white px-5 py-2 rounded-md"
                    onClick={handlePasswordEdit}
                  >
                    {isEditingPassword ? 'Save Password' : 'Edit Password'}
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
