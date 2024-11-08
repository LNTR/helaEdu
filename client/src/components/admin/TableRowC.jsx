import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import DeletePopup from '@components/complaints/DeletePopup';
import FeedbackPopup from '@components/complaints/FeedbackPopup';
import ConfirmationPopup from '@components/complaints/ConfirmationPopup'; 
import { deleteComplaint } from '@services/ComplaintServce';
import { reviewComplaint } from '@services/ComplaintServce';
import { declineComplaint } from '@services/ComplaintServce';
import { deleteCommentByAdmin } from '@services/ArticleService';
import { useNavigate } from 'react-router-dom';

export default function TableRowC({ complaintId, comment, complaint, commentedBy, reportedBy, date, status, articleId,commentId}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showCommentDeleteConfirmation, setShowCommentDeleteConfirmation] = useState(false); 
  const navigate = useNavigate();

  const navigatePage = (articleId) => {
    navigate(`/articles/readArticles/${articleId}`);
  };

  const handleDelete = async () => {
    try {
      await deleteComplaint(complaintId);
      alert('Complaint deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete complaint:', error);
    }
    setShowDeletePopup(false);
  };

  const handleAcceptDecline = async (feedback, actionType) => {
    console.log(`Submitting ${actionType} for complaint ID: ${complaintId} with feedback: ${feedback}`);

    try {
      if (actionType === 'accept') {
        await reviewComplaint(complaintId, feedback);
        alert('Complaint accepted with feedback');
        window.location.reload();
      } else if (actionType === 'decline') {
        await declineComplaint(complaintId, feedback);
        alert('Complaint declined with feedback');
        setShowCommentDeleteConfirmation(true); 
      }
      
    } catch (error) {
      console.error(`Failed to ${actionType} complaint:`, error);
    }
    setShowFeedbackPopup(false);
  };

  const handleDeleteCommentConfirmation = async () => {
    try {
      await deleteCommentByAdmin(commentId); 
      alert('Comment marked as deleted');
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      window.location.reload();
    }
    setShowCommentDeleteConfirmation(false);
  };

  return (
    <div className='bg-white border border-blue text-black rounded-3xl mx-32 my-4 px-7 py-4'>
      <div className='flex justify-between items-center'>
        <div className='w-2/12 text-left'><p className='text-2xl'>{complaint}</p></div>
        <div className='w-2/12 text-left'><p className='text-2xl'>{comment}</p></div>
        <div className='w-2/12 text-left'><p className='text-2xl'>{commentedBy}</p></div>
        <div className='w-2/12 text-left'><p className='text-2xl'>{reportedBy}</p></div>
        <div className='w-2/12 text-left'><p className='text-2xl'>{date}</p></div>
        <div className='w-1/12 text-left'>
          <div className={`text-white rounded-xl px-2 py-1 flex justify-center text-xl ${status === 'REVIEWED' ? 'bg-blue' : status === 'DECLINED' ? 'bg-red-500' : 'bg-yellow-500'}`}>
             <p className='text-2xl'>{status.toLowerCase()}</p>
          </div>
        </div>
        <div className='flex justify-center w-2/12 text-left'>
          <FontAwesomeIcon icon={faEye} className='text-2xl m-2 hover:text-yellow hover:translate-x-1' onClick={() => navigatePage(articleId)} />
          <FontAwesomeIcon icon={faEdit} className='text-2xl m-2 hover:text-yellow hover:translate-x-1' onClick={() => setShowFeedbackPopup(true)} />
          <FontAwesomeIcon icon={faTrash} className='text-2xl m-2 hover:text-yellow hover:translate-x-1' onClick={() => setShowDeletePopup(true)} />
        </div>
      </div>

      {showDeletePopup && <DeletePopup onCancel={() => setShowDeletePopup(false)} onDelete={handleDelete} />}
      {showFeedbackPopup && <FeedbackPopup onCancel={() => setShowFeedbackPopup(false)} onSubmitFeedback={handleAcceptDecline} />}

      {showCommentDeleteConfirmation && (
        <ConfirmationPopup
          message="Do you want to remove this comment from the forum also?"
          onConfirm={handleDeleteCommentConfirmation}
          onCancel={() => setShowCommentDeleteConfirmation(false)}
        />
      )}
    </div>
  );
}
