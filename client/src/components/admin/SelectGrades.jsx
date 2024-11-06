import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
export default function SelectGrades({grade}) {
  return (
    <div>
       <Link  to="/selectedSub" state={{grade}}>
            <div className='rounded-xl shadow-xl w-72 h-64 py-20 hover:bg-blue hover:scale-95 transition-transform hover:text-white'>
                <p className='text-3xl text-center'>{grade}</p>
                <div className='flex justify-center my-7'><FontAwesomeIcon icon={faFolder}/></div>

            </div>
       </Link>
        
    </div>
   
  )
}
