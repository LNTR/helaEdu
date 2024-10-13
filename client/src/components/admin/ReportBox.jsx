import React from 'react'

export default function ReportBox() {
  return (
    <div>
      <div className='shadow-xl rounded-xl px-14 pt-14 pb-7'>
        <h2 className='text-blue text-3xl py-2'>Get your customized Report</h2>
        <p className='text-black text-2xl pb-7'>You can download and also customize your reports with filters</p>

        <h1 className='text-2xl text-blue'>Choose your report type</h1>
        <select className='my-4 px-5 py-3 w-10/12 border border-blue rounded-xl text-xl'>
            <option>User Registrations</option>
            <option>User Subscriptions</option>
            <option>User Registrations</option>
        </select>
        <h1 className='text-2xl text-blue my-6'>Choose user type</h1>
        <div className='flex justify-start '>
            <div className='w-1/3'>
                <label className='text-xl flex items-center'>
                    <span className='mr-7'>Student</span>
                    <input type="checkbox" className='w-8 h-8 text-blue border-gray-300 rounded focus:ring-blue'/> 
                    
                </label>
            </div>
            <div className='w-1/3'>
                <label className='text-xl flex items-center'>
                    <span className='mr-7'>Teacher</span>
                    <input type="checkbox" className='w-8 h-8 text-blue border-gray-300 rounded focus:ring-blue'/> 
                   
                </label>
            </div>  
            <div className='w-1/3'>
                <label className='text-xl flex items-center'>
                    <span className='mr-7'>Moderator</span>
                    <input type="checkbox" className='w-8 h-8 text-blue border-gray-300 rounded focus:ring-blue'/> 
                   
                </label>
            </div>    
        </div>
        <h1 className='text-2xl text-blue my-6'>Choose time duration</h1>
        <div className='flex justify-start mt-7'>
        
            <div className='w-1/2'>
                <label className='text-xl flex items-center'>
                    <span >Start date</span>
                    <input type="date" className='px-5 py-3 border border-blue rounded-xl mx-5 text-2xl'/> 
                </label>
            </div>
            <div className='w-1/2'>
                <label className='text-xl flex items-center'>
                    <span >End Date</span>
                    <input type="date" className='px-5 py-3 border border-blue rounded-xl mx-5 text-2xl'/> 
                   
                </label>
            </div>    
        </div>
           <div className='flex justify-end my-10'>
            <p className='text-blue hover:text-blue text-2xl mx-14 px-6 py-3 cursor-pointer'>Preview</p>
            <button className='bg-blue px-6 py-3 rounded-xl text-2xl text-white'>Generate report</button>
           
           </div>
      </div>
    </div>
  )
}
