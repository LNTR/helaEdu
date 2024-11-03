import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile,faTrash,faEye,faEdit } from '@fortawesome/free-solid-svg-icons';

export default function SubjectFile({subjects}) {
  return (
    <div>
      <div className='rounded-xl shadow-xl w-56 h-80 py-20 hover:scale-95 transition-transform '>
       
        <div className='flex justify-center mb-5 text-black'><FontAwesomeIcon icon={faFile} size="3x"/></div>
        <p className='text-3xl text-black text-center h-12'>{subjects.subject}</p>
       

        <div className='flex justify-center text-center mt-10'>  
            <div className='bg-blue p-2 rounded-lg hover:translate-x-1 mx-3'>
                <FontAwesomeIcon icon={faEye}  className='text-xl m-2 text-white ' />
          
                <FontAwesomeIcon icon={faEdit}  className='text-xl m-2 text-white ' />
          
                <FontAwesomeIcon icon={faTrash}  className='text-xl m-2 text-white ' />
            </div>  
           
        </div>

      </div>
    </div>
  )
}
