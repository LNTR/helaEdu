import React from 'react'

export default function TableHeader() {
  return (
    <div className='flex justify-center'>
        <div className='bg-blue rounded-3xl w-10/12 h-16 px-7 py-4 flex justify-between items-center text-white'>
            <div className='w-6/12 text-left'>
                <p className='text-2xl'>User Name</p>
            </div>
            <div className='w-6/12 text-left'>
                <p className='text-2xl'>Email</p>
            </div>
            <div className='w-2/12 text-left'>
                <p className='text-2xl'>Actions</p>
            </div>
        
        </div>
  </div>
 
  )
}
