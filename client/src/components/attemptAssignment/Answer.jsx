
import React from 'react';

const Answer = ({ id, option, onclick, isSelected }) => {
  return (
    <div className="flex items-center">
      <div className="special-text text-blue">{`${id}).`}</div>
      <button
        className="card min-h-18 max-w-4xl m-7 border-2 border-blue rounded-full p-4 cursor-pointer text-1 min-w-128"
        onClick={onclick}
        style={{
          backgroundColor: isSelected ? '#0A6CF5' : 'white',
          color: isSelected ? 'white' : '#0A6CF5',
        }}
      >
        {option}
      </button>
    </div>
  );
};

export default Answer;
