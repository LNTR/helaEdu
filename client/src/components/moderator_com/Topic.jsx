import React from 'react'

const Topic = (props) => {
  return (
    <div className='m-10 h-1/5'>
    <div className='s-topic'>{props.topic}</div>
    <div className='n-text'>{props.description}</div>
    <hr className='my-4 border-yellow leading-8' />
  </div>
  )
}

export default Topic