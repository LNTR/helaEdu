import React from 'react'

export default function TableRowHeaderC() {
  return (
    <div className='bg-blue text-white rounded-3xl  mx-32 my-4 px-7 py-4'>
        <div className='flex justify-between items-center'>
        
            <div className='w-3/12 text-left'>
                <p className='text-2xl'>Comment</p>
            </div>
            
            <div className='w-2/12 text-left'>
                <p className='text-2xl'>Commented By</p>
            </div>
            <div className='w-2/12   text-left '>
                <p className='text-2xl'>Reported By</p>
            </div>
            <div className='w-2/12   text-left '>
                <p className='text-2xl'>Date</p>
            </div>
            <div className='w-1/12   text-left '>
                <p className='text-2xl'>Status</p>
            </div>
            <div className='flex justify-center w-2/12 text-left'>
                <p className='text-2xl'>Actions</p>
            </div>
        
        </div>
  </div>
 
  )
}
