import React from 'react'
import HTMLReactParser from 'html-react-parser';

const NoteCard = ({ topic, subject, date, content, onClick }) => {
  return (
    <div className='relative mx-auto'>
      <div className='note-card' onClick={onClick}>
        <div className='note-card-left'>
          <h3 className='special-text text-blue'>{topic}</h3>
        </div>
        <div className='note-card-right'>
          <p className='s-text'>{HTMLReactParser(content)}</p>
        </div>
      </div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-xl border text-black text-center w-52 rounded-md'>
        <p className='n-text-bold'>{subject}</p>
        <p className='s-text text-gray1'>{date}</p>
      </div>
    </div>
  );
};

export default NoteCard;



