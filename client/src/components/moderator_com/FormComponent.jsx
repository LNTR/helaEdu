import React, { useState } from 'react';

export default function FormComponent({ onSubmit, onClose, grades }) {

  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState(grades);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      subject,
      grade,
      startPage,
      endPage,
    };
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="popup-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full items-center px-20">
        <h3 className='text-4xl my-7 text-center'>Create Weekly Quiz</h3>
        <form onSubmit={handleSubmit} >
          <div className='flex justify-between my-4'>
            <label className='text-2xl '>Subject:</label>
            <input className='rounded-xl border border-gray-600 w-80 px-3 py-3'
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className='flex justify-between my-4'>
            <label className='text-2xl '>Grade:</label><br></br>
            <input className='rounded-xl border border-gray-600 w-80 px-3 py-3'
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>
          <div className='flex justify-between my-4'>
            <label className='text-2xl '>Start Page:</label><br></br>
            <input className='rounded-xl border border-gray-600 w-80 px-3 py-3'
              type="number" min="0" step="1"
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
              required
            />
          </div>
          <div className='flex justify-between my-4'>
            <label className='text-2xl '>End Page:</label><br></br>
            <input className='rounded-xl border border-gray-600 w-80 px-3 py-3'
              type="number" min="0" step="1"
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
              required
            />
          </div>
          <div className='flex justify-center'>
            <button type="submit" className='bg-blue px-3 py-2 rounded-lg text-xl text-white mx-6'>Generate</button>
            <button type="button" className='bg-red-500 px-3 py-2 rounded-lg text-xl text-white' onClick={onClose}>
                Cancel
            </button>
          </div>
         
        </form>
      </div>
    </div>
  );
}
