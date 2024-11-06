import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import AddReply from './AddReply'; 
import AddReport from "@components/articles/AddReport"
import { faThumbsUp as faThumbsUpRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown as faThumbsDownRegular } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';

function Comment({ comment }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showAddReply, setShowAddReply] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);

 
  return (
    <div>
      <div className="flex mt-6">
        <img
          className="w-12 h-12 rounded-full"
          src={comment.avatar}
          alt="Avatar"
        />
        <div className="ml-4 w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-bold text-lg">{comment.author}</span>
              <span className="ml-4 text-gray-500 text-lg">{comment.date}</span>
            </div>
          </div>
          <p className="mt-2 text-gray text-2xl">{comment.comment}</p>
          <div className="flex items-center mt-2 space-x-4 text-gray-600">
            <span
              className="flex items-center cursor-pointer"
              onClick={() => setShowReplies(!showReplies)}
            >
              <FontAwesomeIcon icon={faChevronDown} className="mr-1" />
              {comment.replies.length}
            </span>
            <p><FontAwesomeIcon icon={faThumbsUpRegular} /></p>
            <p><FontAwesomeIcon icon={faThumbsDownRegular} /></p>
            <span className="cursor-pointer" onClick={() => setShowAddReply(true)}>Reply</span>
            <span className="cursor-pointer"onClick={() => setShowAddReport(true)}>Report</span>
          </div>
          {showReplies && comment.replies.length > 0 && (
            <div className="ml-10 mt-4">
              {comment.replies.map((reply, index) => (
                <Comment key={index} comment={reply}  />
              ))}
            </div>
          )}
        </div>   
      </div>
      {showAddReply && (
        <AddReply 
          onCancel={() => setShowAddReply(false)} 
          commentId={comment.commentId} 
          articleId={comment.articleId} 
        />
      )}
      {showAddReport && (
        <AddReport 
          onCancel={() => setShowAddReport(false)} 
          commentId={comment.commentId} 
          articleId={comment.articleId} 
        />
      )}
    </div>
  );
}

export default Comment;
