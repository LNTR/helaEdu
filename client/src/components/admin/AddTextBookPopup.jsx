import React, { useState } from 'react';
import { uploadPdf, createSubject } from '@services/SubjectService';

export default function AddTextBookPopup({ grade, onClose, onSuccess }) {
  const [subjectName, setSubjectName] = useState('');
  const [language, setLanguage] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subjectData = { subjectName, language, grade };
      const response = await createSubject(subjectData);
      const subjectId = response.data;
      
      if (subjectId && pdfFile) {
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        await uploadPdf(subjectId, formData);
        alert('Subject and PDF uploaded successfully');
        onClose();
        onSuccess(); // Refresh subjects
      } else {
        alert('Error uploading PDF');
        onClose();
      }
    } catch (error) {
      console.error('Error creating subject or uploading PDF:', error);
      alert('There was an error. Please try again.');
      onClose();
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
            <label className="text-3xl my-3">Language</label><br />
            <input
              type="text"
              className="border border-blue rounded-md px-5 py-3"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            /><br /><br />
            <input type="file" className="my-6 w-full" onChange={handleFileChange} /><br />
            <button type="submit" className="bg-blue rounded-md px-5 py-3 text-2xl text-white my-10">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
