import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import first from "@assets/temp/img1.jpg";
import coverImg1 from "@assets/temp/cover_img1.webp";


const StudentHero = ({ username, firstName, lastName, profileImg, coverImg, quote }) => {
    return (
        <div>
            <div className='h-128 w-full m-0 relative'>
                <img src={coverImg1} alt="Cover Image" className='h-full w-full object-cover z-0' />
                {/* <img src={coverImg} alt="Cover Image" className='h-full w-full object-cover z-0' /> */}
                <div className="p-0 absolute bottom-24 right-0 w-1/2">
                    <div className="text-center bg-white text-gray-700 italic font-serif text-lg md:text-2xl px-4 py-6 border-l-4 border-blue rounded-md shadow-sm">
                        "{quote}"
                    </div>
                </div>
                <div className='small-yellow-icon-circle absolute right-0 bottom-0 bg-gray2 cursor-pointer'>
                    <FontAwesomeIcon icon={faPencil} className='size-5' />
                </div>
            </div>
            <div className="flex items-center p-4 rounded-lg -mt-40 mx-auto justify-center md:mx-0  md:justify-start">
                <div className="relative p-9">
                    <div className='flex h-auto w-full my-auto justify-center items-center'>
                        <div className='top-place-box z-40'>
                            <div className='top-place ring-4 first'>
                                <img src={first} alt="image" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-4">
                    <div className="text-header4 font-bold text-gray1">{username}</div>
                    <div className="text-1 text-gray2">{firstName} {lastName}</div>
                </div>
            </div>


        </div>
    )
}

export default StudentHero