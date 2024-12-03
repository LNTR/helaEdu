import React, { useState } from "react";
import { addComment } from "@services/ArticleService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export default function AddComment({ articleId }) {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  const [commentText, setCommentText] = useState("");
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    console.log(articleId);
    try {
      const comments = {
        comment: commentText,
        articleId,
        parentId: 0,
      };
      console.log(headers);
      const response = await addComment(comments, headers);
      if (response.status === 200 || response.status === 201) {
        setCommentText("");
        window.location.reload();
      }
    } catch (err) {
      if (err.response) {
        console.error("Error posting comment:", err.response.data);
        alert(err.response.data);
      } else {
        console.error("Error posting comment:", err.message);
        alert(err.response.data);
      }
    }
  };

  return (
    <div className="m-12">
      <h1>Leave a Comment</h1>
      <hr className="border-yellow border-t-4 w-96"></hr>
      <br></br>

      <form onSubmit={handlePostComment}>
        <input
          type="text"
          className="border border-blue w-11/12  rounded-xl mt-7 mb-7 px-10 pb-40 pt-3"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
        />

        <div className="flex justify-start">
          <button
            type="submit"
            className="bg-yellow text-white rounded-xl p-4 text-3xl"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}
