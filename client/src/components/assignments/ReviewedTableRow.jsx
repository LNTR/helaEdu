import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch } from '@fortawesome/free-solid-svg-icons';
import Profile from '@assets/img/articles/profile.jpg';
import { Link } from 'react-router-dom';
export default function ReviewedTableRow({ assignmentId,userId,name,email,score }) {
  return (
    <div>
      <div>
     
     <div className='border border-blue rounded-3xl  mx-auto my-4 px-7 py-3'>
       <div className='flex justify-between items-center'>
        
         <div className='w-1/4 text-left flex justify-start'>
           <img src={Profile} className='w-14 h-14 rounded-full'/>
           <p className='text-2xl pt-4'> {name}</p>
         </div>        
         <div className='w-1/4 text-left  '>
           <p className='text-2xl'>{email}</p>
         </div>
         <div className='w-1/4 text-left '>
           <p className='text-2xl'>{score}</p>
         </div>
        
         <div className=' w-1/4 flex justify-center'>
            {/* <button className='bg-blue text-white text-xl rounded-xl px-4 py-1 mr-7'>Reviewed</button> */}

            <Link to={`/questionList/${assignmentId}/${userId}`} className="bg-blue text-white text-xl rounded-xl px-4 py-1">
              View
            </Link>
         
          
         </div>
       </div>
     </div>
  
   </div>
    </div>
  )
}
