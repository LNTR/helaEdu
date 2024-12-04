import React, { useState } from 'react';
import { uploadPdf, createSubject, uploadSubjectCover } from '@services/SubjectService';

export default function AddTextBookPopup({ grade, onClose, onSuccess }) {
  const [subjectName, setSubjectName] = useState('');
  const [language, setLanguage] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null); 

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Step 1: Create the subject only once
      const subjectData = { subjectName, language, grade };
      const response = await createSubject(subjectData);
      const subjectId = response.data; // Get the subject ID from the response
  
      if (!subjectId) {
        alert('Error creating subject');
        return;
      }
  
      // Step 2: Upload the PDF (if provided)
      if (pdfFile) {
        const pdfFormData = new FormData();
        pdfFormData.append('pdf', pdfFile);
  
        try {
          await uploadPdf(subjectId, pdfFormData);
        } catch (error) {
          console.error('Error uploading PDF:', error);
          alert('Failed to upload the PDF. Please try again.');
          return; // Exit on error to prevent inconsistent state
        }
      }
  
      // Step 3: Upload the cover image (if provided)
      if (coverImage) {
        const coverFormData = new FormData();
        coverFormData.append('subjectCoverImage', coverImage);
  
        try {
          await uploadSubjectCover(subjectId, coverFormData);
        } catch (error) {
          console.error('Error uploading Cover Image:', error);
          alert('Failed to upload the cover image. Please try again.');
          return; // Exit on error to prevent inconsistent state
        }
      }
  
      // Success message and cleanup
      alert('Subject, PDF, and Cover Image uploaded successfully!');
      onClose(); // Close the popup
      onSuccess(); // Trigger success callback
  
    } catch (error) {
      console.error('Error creating subject:', error);
      alert('An error occurred while creating the subject. Please try again.');
    }
  };
  
  

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="bg-yellow rounded-full p-3 h-9 w-9 flex justify-items-end cursor-pointer" onClick={onClose}>X</div>
        <div className="mx-16">
          <h3 className="text-4xl mb-4 flex justify-center">Add Your TextBook</h3>
          <form onSubmit={handleSubmit}>
            <label className="text-3xl my-3">Subject</label><br />
            <input
              type="text"
              className="border border-blue rounded-md px-5 py-3"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            /><br /><br />
            <label className="text-3xl my-3">Subject Medium</label><br />
            <input
              type="text"
              className="border border-blue rounded-md px-5 py-3"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            /><br /><br />
            <div className=''>
              <div className='items center'>
                <label className='text-2xl'>Upload Textbook</label>
                <input type="file" className="my-6 w-full" onChange={handleFileChange} />
              </div>
              <div className=''>
                <label className='text-2xl'>Upload Cover Image</label>
                <input type="file" className="my-6 w-full" onChange={handleCoverChange} />
              </div>
            </div>
         
            <button type="submit" className="bg-blue rounded-md px-5 py-3 text-2xl text-white my-10">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
