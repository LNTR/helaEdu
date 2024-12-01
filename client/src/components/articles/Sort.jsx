import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Sort({onStatusChange}) {
  const [startDate, setStartDate] = useState(null);
  const grades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'];
  const statuses = ["All", "APPROVED", "PENDING", "REJECTED"];
  const toCamelCase = (str) => str.toLowerCase().replace(/ (\w)/g, (_, letter) => letter.toUpperCase());

  return (
    <div className='flex mb-10 z-100'>
      <div className='flex space-x-4 text-sm'>
        {/* <button className='text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 hover:bg-blue hover:text-white transition-colors'>
          All
        </button> */}
         <p className='py-3 '>Filtered By</p>
        <div className='relative'>
         
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            customInput={
              <button className='text-xl px-3 py-3 rounded-sm border border-gray1 text-gray1 hover:bg-blue hover:text-white transition-colors'>
                Published Date <FontAwesomeIcon icon={faChevronDown} className="text-gray1 text-sm ml-2" />
              </button>
            }
          />
        </div>
     
        <div className='dropdown dropdown-end'>
          <button
            tabIndex={0}
            className='text-xl px-3 py-3 rounded-sm border border-gray1 text-gray1 hover:bg-blue hover:text-white transition-colors flex items-center'
          >
            Status <FontAwesomeIcon icon={faChevronDown} className="text-gray1 text-sm ml-2 z-50" />
          </button>
          <ul tabIndex={0} className='dropdown-content menu p-1 shadow rounded-box w-52 text-sm  z-50 bg-white'>
            {statuses.map((status) => (
              <li key={status}>
                <button
                  className='w-full text-left px-4 py-2 hover:bg-gray-100 text-xl'
                  onClick={() => onStatusChange(status)}
                >
                  {toCamelCase(status)}
                </button>
              </li>
            ))}
          </ul>
        </div>
       
        {/* <button className='text-xl bg-black px-10 py-3 rounded-sm border border-gray1 text-white hover:bg-blue hover:text-white transition-colors'>
          Reset
        </button> */}
      </div>
    </div>
  );
}
