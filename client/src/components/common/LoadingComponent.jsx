import React from 'react'

export default function LoadingComponent() {
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
            <div className="h-12 w-4 bg-blue rounded-full animate-pulse mx-5"></div>
            <div className="h-8 w-4 bg-blue rounded-full animate-pulse delay-200"></div>
            <div className="h-4 w-4 bg-blue rounded-full animate-pulse delay-400 mx-5"></div>
      </div>
    </div>
  )
}
