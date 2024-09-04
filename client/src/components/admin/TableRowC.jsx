import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash,faEye } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/fontawesome-free-regular';

export default function TableRowC({comment,commentedBy,reportedBy,date,status}) {
  return (
    <div className='bg-white border border-blue text-black rounded-3xl  mx-32 my-4 px-7 py-4'>
        <div className='flex justify-between items-center'>
        
        <div className='w-3/12 text-left'>
                <p className='text-2xl'>{comment}</p>
            </div>
            
            <div className='w-2/12 text-left'>
                <p className='text-2xl'>{commentedBy}</p>
            </div>
            <div className='w-2/12   text-left '>
                <p className='text-2xl'>{reportedBy}</p>
            </div>
            <div className='w-2/12   text-left '>
                <p className='text-2xl'>{date}</p>
            </div>
            <div className='w-1/12   text-left '>
                <div className='bg-blue text-white rounded-xl px-2 py-1 flex justify-center'>
                    <p className='text-2xl'>{status}</p>
                </div>      
            </div>
            <div className='flex justify-center w-2/12 text-left'>
               
                <FontAwesomeIcon icon={faEye}  className='text-2xl m-2 hover:text-yellow hover:translate-x-1' />
                <FontAwesomeIcon icon={faEdit} className='text-2xl m-2 hover:text-yellow hover:translate-x-1' />
                <FontAwesomeIcon icon={faTrash} className='text-2xl m-2 hover:text-yellow hover:translate-x-1' />
            </div>
        </div>
  </div>
 
  )
}
