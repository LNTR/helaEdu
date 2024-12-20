import React, { useState ,useEffect} from 'react';
import { faComment as faCommentRegular } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCommentCountByArticleId } from '@services/ArticleService';
import { getUpvoteCountByArticleId } from '@services/ArticleService';
import HTMLReactParser from 'html-react-parser';
import Article from "@assets/img/articles/article.jpg";
import Profile from '@assets/img/articles/profile.jpg';
import DefaultArticle from '@assets/img/articles/defaultArticle.jpg'

export default function ArticleCard({ imageUrl, firstName,lastName, date, title, badges ,profilePictureUrl,articleId}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString();
  const [commentCount,setCommentCount] = useState(null);
  const [upvoteCount,setUpvoteCount] = useState(null);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleMark = () => {
    setIsMarked(!isMarked);
  };
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await getCommentCountByArticleId(articleId);
        setCommentCount(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch comment count:', error);
      }
    };

    if (articleId) {
      fetchCommentCount();
    }
  }, [articleId]);
  useEffect(() => {
    const fetchUpvoteCount = async () => {
      try {
        const response = await getUpvoteCountByArticleId(articleId);
        setUpvoteCount(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch upvote count:', error);
      }
    };

    if (articleId) {
      fetchUpvoteCount();
    }
  }, [articleId]);
  return (
    <div className="card w-96 h-auto shadow-xl bg-white hover:scale-105 transition-transform overflow-hidden">
      <div className="h-80">
        <figure className="h-full">
          {imageUrl ?(
            <img src={imageUrl} className="w-full h-full object-cover" alt="Article" />
          ):(
            <img src={DefaultArticle} className="w-full h-full object-cover" alt="Article" />
          )}
         
        </figure>
      </div>
      <div className="card-body p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
            {profilePictureUrl ?(
               <img className="w-8 h-8 rounded-full" src={profilePictureUrl} alt="Author avatar" />
              ):(
                <img className="w-8 h-8 rounded-full" src={Profile} alt="Author avatar" />
              )}
              
              <span className="text-sm ml-2">{firstName} {lastName}</span>
            </div>
            <div className='flex items-center'>
              <span className="text-sm">{formattedDate}</span>
            </div>
          </div>
          <h2 className="card-title text-2xl line-clamp-3">
            {title}
          </h2>
         
          <div className="flex flex-wrap mt-2 truncate-badges">
            {badges && badges.length > 0 ? (
              badges.map((badge, index) => (
                <div key={index} className="text-lg text-gray-500 mx-1">
                  #{badge}
                </div>
              ))
            ) : (
              <div className="text-sm text-transparent mx-1 placeholder-hidden">
                Placeholder
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center mt-1 space-x-4">
          <div className="relative">
            <FontAwesomeIcon
              icon={isLiked ? faThumbsUpSolid : faThumbsUpRegular}
              className="text-2xl icon-theme"
              
              onClick={toggleLike}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            />
            <span className="absolute bottom-10 right-0 translate-x-1/2 translate-y-1/2 text-xs bg-white text-black rounded-full w-5 h-5 flex items-center justify-center">{upvoteCount}</span>
          </div>
          <div className="relative">
            <FontAwesomeIcon
              icon={faCommentRegular}
              className="text-2xl icon-theme"
              
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            />
            <span className="absolute bottom-10 right-0 translate-x-1/2 translate-y-1/2 text-xs bg-white text-black rounded-full w-5 h-5 flex items-center justify-center">{commentCount}</span>
          </div>
          {/* <div className="relative">
            <FontAwesomeIcon
              icon={isMarked ? faBookmarkSolid : faBookmarkRegular}
              className="text-2xl icon-theme"
              onClick={toggleMark}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
