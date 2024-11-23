import React from 'react'
import badge from "@assets/temp/img1.jpg";

const Badges = () => {
    const badges = [
        badge,
        badge,
        badge,
        badge,
        badge,
        badge,
        badge,
      ];
    
  return (
    <div className="relative overflow-hidden w-1/2 border">
    <div className="marquee border">
      <div className="marquee-content border">
        {badges.map((badge, index) => (
          <img
            key={index}
            src={badge}
            alt={`Badge ${index + 1}`}
            className="w-20 h-20 mx-2 rounded-full border"
          />
        ))}
         
      </div>
    </div>
  </div>
  )
}

export default Badges