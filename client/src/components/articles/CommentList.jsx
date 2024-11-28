import React, { useState, useEffect } from "react";
import Comments from "@components/articles/Comments";
import AddComment from "./AddComment";
import Profile from "@assets/img/articles/profile.jpg";
import { listCommentsByArticleId } from "@services/ArticleService";
import { getUserDetails } from "@services/TeacherService";
import { listAllUsersDetails } from "@services/TeacherService";

function CommentList({ articleId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await listCommentsByArticleId(articleId);
        const commentsData = response.data;
        const structuredComments = await Promise.all(
          commentsData.map(async (comment) => {
            const userId = comment.userId;
            const userDetails = await listAllUsersDetails(userId); 
            return {
              ...comment,
              author: userDetails.data.firstName + userDetails.data.lastName,
              avatar: userDetails.data.profilePictureUrl || Profile, 
              replies: [],
            };
          })
        );
        const structuredCommentTree = buildCommentTree(structuredComments);
        setComments(structuredCommentTree);
      } catch (err) {
        setError("Error fetching comments");
      }
    };

    fetchComments();
  }, [articleId]);
  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
      map[comment.commentId] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
      if (comment.parentId === null || comment.parentId === "0") {
        roots.push(map[comment.commentId]);
      } else if (map[comment.parentId]) {
        map[comment.parentId].replies.push(map[comment.commentId]);
      }
    });

    return roots;
  };
 

  return (
    <div className="m-12 mt-10">
      <h1>Discussion</h1>
      <hr className="border-yellow border-t-4 w-56"></hr>
      <br />
      {comments.map((comment) => (
        <Comments key={comment.commentId} comment={comment}  />
      ))}
      <AddComment articleId={articleId}/>
      
    </div>
  );
}

export default CommentList;
