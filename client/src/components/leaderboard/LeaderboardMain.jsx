import React from 'react'
import LeaderBoardTable from './LeaderBoardTable'
import LeaderboardSidebar from '../leaderboard/LeaderboardSidebar'
import Top3 from '@components/Quiz/Top3'


const LeaderboardMain = () => {
  return (
    <>  
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 800 400'><rect fill='#0A2033' width='800' height='400'/><defs><radialGradient id='a' cx='396' cy='281' r='514' gradientUnits='userSpaceOnUse'><stop  offset='0' stop-color='#4E34DD'/><stop  offset='1' stop-color='#0A2033'/></radialGradient><linearGradient id='b' gradientUnits='userSpaceOnUse' x1='400' y1='148' x2='400' y2='333'><stop offset='0'  stop-color='#B1D0FF' stop-opacity='0'/><stop offset='1'  stop-color='#B1D0FF' stop-opacity='0.5'/></linearGradient></defs><rect fill='url(#a)' width='800' height='400'/><g fill-opacity='0.4'><circle fill='url(#b)' cx='267.5' cy='61' r='300'/><circle fill='url(#b)' cx='532.5' cy='61' r='300'/><circle fill='url(#b)' cx='400' cy='30' r='300'/></g></svg>
  
    <div className='flex '>
      <LeaderboardSidebar />
      <div className='w-9/12 mx-auto mt-14'>
        <div className='w-52 border-b-4 border-yellow'>
          <h1>Leaderboard</h1>
        </div>
        {/* <Top3/> */}
        <Top3 />
        <LeaderBoardTable />

      </div>
    </div>
    </>
  )
}

export default LeaderboardMain