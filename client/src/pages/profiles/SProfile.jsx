import { Header } from '@components/common';
import StudentHero from '@components/student/StudentHero'
import React from 'react'

const SProfile = () => {
  const student = {
    email: "sanduni@helaedu.com",
    firstName: "Sanduni",
    lastName: "Dilhara",
    username: "SDilhara",
    profilePictureUrl: "https://storage.googleapis.com/helaedu-website.appspot.com/profile_pictures/nirmalhettiarachchi5@gmail.com/ba9b9415-7075-4ecb-9b5e-7e4372ed6d45-Messenger.png",
    coverPictureUrl: "https://storage.googleapis.com/helaedu-website.appspot.com/profile_pictures/nirmalhettiarachchi5@gmail.com/ba9b9415-7075-4ecb-9b5e-7e4372ed6d45-Messenger.png",
    quote: "Work hard, dream big, and believe in yourself, because you're capable of amazing things!"
  };
  return (
    <div>
      <Header />
      <StudentHero
        username={student.username}
        firstName={student.firstName}
        lastName={student.lastName}
        profileImg={student.profilePictureUrl}
        coverImg={student.coverPictureUrl}
        quote={student.quote}
      />
      
    </div>
  )
}

export default SProfile