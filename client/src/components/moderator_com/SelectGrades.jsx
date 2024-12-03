import React ,{useState} from 'react'
import { Link } from 'react-router-dom'
import FormComponent from '@components/moderator_com/FormComponent';

export default function SelectGrades({subjectDetails }) {
  
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
    
  const handleFormSubmit = (formData) => {
    setGeneratedData(formData);
    console.log('Generated Data:', formData);
  };

  return (
    <div>
       {showModal && (
        <FormComponent
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          grades={subjectDetails.grade}
        />
      )}
            <div className='rounded-xl border border-blue shadow-xl w-72 h-64 py-10  hover:scale-95 transition-transform '>
                <p className='text-3xl text-center text-blue'>{subjectDetails.subjectName}</p>
                <p className='text-3xl text-center'>{subjectDetails.grade}</p>
                <div className="flex justify-center mt-6">
                  <button
                    className="bg-blue px-7 py-3 text-white text-2xl cursor-pointer"
                    onClick={handleOpenModal}
                  >
                    Generate Quiz
                  </button>
          </div>
          
            </div>
      
    </div>
   
  )
}
