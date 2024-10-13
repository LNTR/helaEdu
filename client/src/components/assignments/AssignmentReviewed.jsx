import React from 'react';

const AssignmentReviewed = ({ question, index, options, isOpen, onToggle }) => {
  return (
    <div className=" py-4 border-b border-blue ">
      <div
        className="flex justify-between items-center py-4 cursor-pointer"
        onClick={() => onToggle(index)}
      >
        <span className="text-2xl ">{index + 1}. {question}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="px-7 py-5">
          {options.map((option, i) => (
            <div key={i} className={`flex items-center py-3 my-3 ${option.correct ? 'bg-blue2 py-1 rounded-md' : ''}`}>
              <span className="  text-2xl">{i+1}. </span>
              <span className="text-black text-2xl">{option.text}</span>
            </div>
          ))}
          <div className="mt-4">
            <h4 className=" text-black text-xl">Question Review:</h4>
            <p className="text-gray-600 text-xl">{options.review}</p>
          </div>
        </div>
      )}
    </div>
    // <div>

    // </div>
  );
};

export default AssignmentReviewed;
