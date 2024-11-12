import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Sort({ onDateChange, onStatusChange }) {
  const [startDate, setStartDate] = useState(null); 
  const statuses = ["All", "REVIEWED", "DECLINED"];

  const handleDateChange = (date) => {
    setStartDate(date);
    onDateChange(date); 
  };
  return (
    <div className='flex justify-center items-center mb-10'>
      <div className='flex space-x-4 text-sm'>
        <button onClick={() => onStatusChange("All")} className='text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 hover:bg-blue hover:text-white transition-colors'>
          All
        </button>
        
        {/* Date picker button */}
        <div className='relative'>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange} 
            customInput={
              <button className='text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 hover:bg-blue hover:text-white transition-colors'>
                Date <FontAwesomeIcon icon={faChevronDown} className="text-gray1 text-sm ml-2" />
              </button>
            }
          />
        </div>

        <div className='dropdown dropdown-end '>
          <button
            tabIndex={0}
            className='text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 hover:bg-blue hover:text-white transition-colors flex items-center'
          >
            Status <FontAwesomeIcon icon={faChevronDown} className="text-gray1 text-sm ml-2 z-50" />
          </button>
          <ul tabIndex={0} className='dropdown-content menu p-1 shadow rounded-box w-52 text-sm z-50 bg-white'>
            {statuses.map((status) => (
              <li key={status} className='z-100'>
                <button
                  className='w-full text-left px-4 py-2 hover:bg-gray-300  text-xl z-100'
                  onClick={() => onStatusChange(status)}
                >
                  {status}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => { setStartDate(null); onDateChange(null); onStatusChange("All"); }} className='text-xl bg-black px-10 py-3 rounded-sm border border-gray1 text-white hover:bg-blue hover:text-white transition-colors'>
          Reset
        </button>
      </div>
    </div>
  );
}
