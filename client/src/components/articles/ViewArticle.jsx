import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import HTMLReactParser from 'html-react-parser';
import Profile from '@assets/img/articles/profile.jpg';
import Default from '@assets/img/articles/defaultArticle.jpg';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { addUpvote } from '@services/ArticleService';
import { listTeacherDetails } from '@services/TeacherService';

export default function ViewArticle({
    articleId,
    articleAuthorId, // Renamed for clarity
    upvote,// This is the list of users who have upvoted
    title,
    content,
    tags,
    firstName,
    lastName,
    date,
    imageRef,
    userProfile,
    additionalFilesRefs
}) {
    const formattedDate = new Date(date).toLocaleDateString();
    const [isLiked, setIsLiked] = useState(false);
    const [isMarked, setIsMarked] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null); // To store logged-in user ID
    const [upvoteCount, setUpvoteCount] = useState(upvote.length); // Track upvote count
    const authHeader = useAuthHeader();
    const headers = {
        Authorization: authHeader,
    };
    console.log(upvote);

    // Fetch logged-in user's details
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await listTeacherDetails(headers);
                const userId = response.data.userId;
                setLoggedInUserId(userId);
                // Check if logged-in user has already upvoted
                const isUserLiked = upvote.includes(userId);
                setIsLiked(isUserLiked);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };

        fetchUserData();
    }, [upvote]);
    // Handle upvote toggle
    const toggleLike = async () => {
        // Prevent the article's author from upvoting their own article
        if (loggedInUserId === articleAuthorId) {
            console.log("You cannot upvote your own article.");
            return;
        }
        try {
            if (isLiked) {
                // If already liked, remove upvote
                await addUpvote(articleId, headers);
                setIsLiked(false);
                setUpvoteCount((prevCount) => prevCount - 1); // Decrease upvote count
            } else {
                // If not liked, add upvote
                await addUpvote(articleId, headers);
                setIsLiked(true);
                setUpvoteCount((prevCount) => prevCount + 1); // Increase upvote count
            }
        } catch (error) {
            console.error('Failed to toggle upvote:', error);
        }
    };
    // Handle bookmark toggle (for future expansion)
    const toggleMark = () => {
        setIsMarked(!isMarked);
    };
    return (
        <div>
            <div className='rounded-2xl p-10 m-12'>
                <h1 className='text-5xl'>{title}</h1>
                <div className='card-actions flex justify-between mt-10'>
                    <div className='flex justify-start align-baseline'>
                        {userProfile ? (
                            <img className="w-10 h-10 rounded-full" src={userProfile} alt="User avatar" />
                        ) : (
                            <img className="w-10 h-10 rounded-full" src={Profile} alt="Default avatar" />
                        )}
                        <span className='text-2xl'>{firstName} {lastName}</span>
                    </div>
                    <div>
                        <span className='text-2xl'>{formattedDate}</span>
                    </div>
                </div>
                <br />
                <div className='flex justify-center w-full'>
                    {imageRef ? (
                        <img className="w-99/100 h-auto" src={imageRef} alt="Article image" />
                    ) : (
                        <img className="w-99/100 h-auto" src={Default} alt="Default article image" />
                    )}
                </div>
                <div className='text-xl mt-10'>
                    <p className='text-2xl'>
                        {HTMLReactParser(content)}
                    </p>
                    <br />
                </div>
                <div className="flex justify-start m-7">
                    {tags && tags.map((tag, index) => (
                        <div key={index} className="border-none text-gray1 text-xl px-2 py-5">
                            #{tag}
                        </div>
                    ))}
                </div>
                <div className='flex justify-between mx-9'>
                    <div className="rounded-xl m-2 flex items-center">
                        <FontAwesomeIcon icon={faFile} className="text-4xl hover:text-yellow cursor-pointer hover:translate-x-1" style={{ color: '#6C6C6C' }} />
                        <a href={additionalFilesRefs} download className="text-2xl text-gray1 hover:text-yellow cursor-pointer ml-2">
                            {additionalFilesRefs ? 'Download File' : 'No File Available'}
                        </a>
                    </div>
                    <div className='flex justify-start'>
                        <div className='relative'>
                            {/* Display the upvote count */}
                            <span className="absolute bottom-10 right-9 translate-x-1/2 translate-y-1/2 text-xs bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">
                                {upvoteCount}
                            </span>
                            <FontAwesomeIcon
                                icon={isLiked ? faThumbsUpSolid : faThumbsUpRegular}
                                className='text-xl  size-14 mx-10 relative'
                                style={{ color: isLiked ? "blue" : "gray", cursor: 'pointer' }}
                                onClick={toggleLike}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            />
                        </div>
                        <div className='relative'>
                            <FontAwesomeIcon
                                icon={isMarked ? faBookmarkSolid : faBookmarkRegular}
                                className='text-xl size-14'
                                style={{ color: isMarked ? "blue" : "gray", cursor: 'pointer' }}
                                onClick={toggleMark}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
