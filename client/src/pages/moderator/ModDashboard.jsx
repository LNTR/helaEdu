import React from 'react'
import { Header } from '@components/common'
import Sidebar from '@components/moderator_com/ModeratorSidebar'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function ModDashboard() {
  const [sidebar, setSidebar] = useState(false);

  const navigator = useNavigate()

  const handleCardClick = (path) => {
    navigator(`/${path}`)
  }
  return (

    <>
      <Header />
      <div className="dashboard h-screen mx-auto" style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }} onClick={() => setSidebar(false)}>
        <Sidebar value={sidebar} setValue={setSidebar} />
        <div className="content-wrapper mx-auto mt-28" >
          <div className='flex justify-center p-2 w-auto'>
            <div className="card bg-base-100 w-128 shadow-xl m-6">
              <div className="card-body">
                <h2 className="card-title text-header1">Articles</h2>
                <p className='text-1 text-gray1 pt-4'>Review and approve articles written by the teachers</p>
                <div className="card-actions justify-start mt-8">
                  <button className="btn border-none text-white bg-blue shadow-lg w-28 hover:text-black hover:bg-yellow" onClick={() => handleCardClick("articles/reviewList")}>Approve</button>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 w-128 shadow-xl m-6">
              <div className="card-body">
                <h2 className="card-title text-header1">Weekly Quizzes</h2>
                <p className='text-1 text-gray1 pt-4'>Generate and review weekly quizzes for this weeek</p>
                <div className="card-actions justify-end mt-8">
                  <button className="btn border-none text-white bg-blue shadow-lg w-28 hover:text-black hover:bg-yellow" onClick={() => handleCardClick("reviewQuizList")}>Review</button>
                </div>
              </div>
            </div>
            </div>
            <div className='flex justify-center p-2 w-auto'>
            <div className="card bg-base-100 w-128 shadow-xl m-6">
              <div className="card-body">
                <h2 className="card-title text-header1">Resources</h2>
                <p className='text-1 text-gray1 pt-4'>Upload updated or newly published textbooks and teachers' resources</p>
                <div className="card-actions justify-start mt-8">
                  <button className="btn border-none text-white bg-blue shadow-lg w-28 hover:text-black hover:bg-yellow" onClick={() => handleCardClick("resources")}>Add</button>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 w-128 shadow-xl m-6">
              <div className="card-body">
                <h2 className="card-title text-header1">Profile</h2>
                <p className='text-1 text-gray1 pt-4'>View and edit your profile</p>
                <div className="card-actions justify-end mt-8">
                  <button className="btn border-none text-white bg-blue shadow-lg w-28 hover:text-black hover:bg-yellow" onClick={() => handleCardClick("tProfile")}>View</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
