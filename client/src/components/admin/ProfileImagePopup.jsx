import React, { useState } from 'react';
import ProfilePhoto from '@/assets/img/articles/profile.jpg';

const ProfileImagePopup = ({ isOpen, onClose, onSave, initialPreviewSrc }) => {
  const [previewSrc, setPreviewSrc] = useState(initialPreviewSrc || ProfilePhoto);
  const [profileImage, setProfileImage] = useState(null);

  if (!isOpen) return null; 

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setPreviewSrc(src);
      setProfileImage(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (profileImage) {
      onSave(profileImage);
    } else {
      alert('Please select an image before saving.');
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray1 z-50 bg-opacity-50'>
      <div className='bg-white p-6 rounded-md shadow-md'>
        <form onSubmit={handleSave}>
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              <img
                id="preview_img"
                className="h-40 w-40 object-cover rounded-full"
                src={previewSrc}
                alt="Current profile photo"
              />
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
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileImagePopup;
