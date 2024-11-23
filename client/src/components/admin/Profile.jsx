import React, { useState, useEffect } from 'react';
import { currentAdmin, addProfileImageToAdmin, updateAdmin } from '@services/AdminService'; 
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import ProfileImagePopup from '@components/admin/ProfileImagePopup';
import EditPasswordPopup from '@components/admin/EditPasswordPopup';
import EditProfilePopup from '@components/admin/EditProfilePopup';
import ProfileImg from "@assets/img/articles/profile.jpg";


const AdminDetails = () => {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    profilePictureUrl: '', 
  });

  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const adminData = await currentAdmin(headers);
        console.log('Fetched Admin Data:', adminData);
        setFormData((prevData) => ({
          ...prevData,
          firstName: prevData.firstName || adminData.data.firstName,
          lastName: prevData.lastName || adminData.data.lastName,
          email: adminData.data.email,
          password:adminData.data.password,
          profilePictureUrl: adminData.data.profilePictureUrl,
        }));
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin details:', error);
        setLoading(false);
      }
    };
  
    if (loading) {
      fetchAdminDetails();
    }
  }, [loading, headers]); 
  
  const handleSaveImage = async (imageFile) => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('profilePicture', imageFile); 
    formDataToSubmit.append('email', formData.email); 
  
    try {
      const response = await addProfileImageToAdmin(formData.email, formDataToSubmit, headers);
      console.log('Image uploaded successfully:', response.data);
      window.location.reload(); 
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleProfileSave = async (updatedData) => {
    try {
      await updateAdmin(updatedData, headers);
      alert("Edited successfully");
      window.location.reload();

    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordSave = async (passwordData) => {
    try {
      await updateAdminPassword(formData.email, passwordData, headers);
      window.location.reload();
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  

  return (
    <div className="my-20">
      <EditProfilePopup
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
        onSave={handleProfileSave}
        initialData={formData}
      />
      <EditPasswordPopup
        isOpen={isPasswordPopupOpen}
        onClose={() => setIsPasswordPopupOpen(false)}
        onSave={handlePasswordSave}
      />
      <ProfileImagePopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSave={handleSaveImage}
        initialPreviewSrc={formData.profilePictureUrl}
      />

      <div className="bg-white shadow-xl rounded-lg p-12">
        <div className="flex justify-start">
          <div className="pl-28 w-1/3 flex  flex-col justify-center relative">
            <div className="relative z-10">
              {
                
              }
              <img
                src={formData.profilePictureUrl ? formData.profilePictureUrl : ProfileImg}
                alt="Profile Photo"
                className=" w-72 h-72 rounded-full object-cover shadow-xl"
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
            <div className="mb-4">
              <label className="block mb-2 text-2xl">First Name</label>
              <input type="text" value={formData.firstName} className="w-full px-3 py-2 border rounded-md" disabled />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-2xl">Last Name</label>
              <input type="text" value={formData.lastName} className="w-full px-3 py-2 border rounded-md" disabled />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-2xl">Email</label>
              <input type="text" value={formData.email} className="w-full px-3 py-2 border rounded-md" disabled />
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setIsProfilePopupOpen(true)} className="bg-blue text-xl text-white px-4 py-2 rounded-md">Edit Profile</button>
              <button onClick={() => setIsPasswordPopupOpen(true)} className="bg-gray-700 text-xl text-white px-4 py-2 rounded-md">Edit Password</button>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
