import React from 'react'

export default function TableRowSubscription({subscriptionId,name,status,startTimestamp,endTimestamp}) {
  return (
    <div className='bg-white border border-blue rounded-3xl  mx-32 my-4 px-7 py-4'>
        <div className='flex justify-between items-center'>
            <div className='w-2/12 text-left'>
                <p className='text-2xl'>{subscriptionId}</p>
            </div>
            <div className='w-2/12 text-left'>
                <p className='text-2xl'>{name}</p>
            </div>
           
            <div className='w-2/12 text-left'>
                <p className='text-2xl'>{status}</p>
            </div>
            <div className='flex justify-center w-2/12 text-left'>
                <p className='text-2xl'>{startTimestamp}</p>
            </div>
            <div className='flex justify-center w-2/12 text-left'>
                <p className='text-2xl'>{endTimestamp}</p>
            </div>
        
        </div>
       
  </div>
  )
}
