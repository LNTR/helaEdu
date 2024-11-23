import React from 'react'
import congratulations from '@assets/img/congrats-banner.svg';
import goldBadge from '@assets/img/badges/gold.svg';
import { useNavigate } from 'react-router-dom';

const Score = ({ score, name }) => {

  const navigator = useNavigate()

  const handleBtnClick = (path) => {
    navigator(`/${path}`)
  }
  return (
    <div className=' popup-container'>
      <div className=' popup-box-large visible relative'>
        <div className='congrats-img'>
          <img src={congratulations} alt="" className='' />
        </div>
        <div className='bagde-wrapper'>
          <img src={goldBadge} alt="" />
        </div>
        <div className='h-auto p-5 m-10 rounded-xl bg-white-transparent w-full'>
          <div className="overflow-x-auto">
            <div className='s-topic text-blue text-center leading-tight'>{name} </div>
            
            <table className="table special-text leading-tight">
              <tbody>
                <tr className='border-none'>
                  <td className=''>Total Score</td>
                  <td className='text-right'>{score}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='flex justify-center items-center '>
          <button className='n-text-bold white-button'  onClick={() => handleBtnClick('')}><h4>Go to home</h4></button>
          <button className='n-text-bold gold-button' onClick={() => handleBtnClick('')}><h4>Review Quiz</h4></button>
        </div>
      </div>
    </div>
  )
}

export default Score;