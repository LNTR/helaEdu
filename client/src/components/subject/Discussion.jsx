import React, { useState,useEffect } from "react";
import Comments from "./Comments";
import AddComment from "./AddComment";
import Profile from "@assets/img/articles/profile.jpg";
import { getAllDetailsForCurrentUser } from '@services/AuthService';
import { listAllUsersDetails } from "@services/TeacherService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { getCommentsBySubjectId } from "@services/SubjectService";

// const commentsData = [
//   {
//     author: "M.Perera",
//     date: "20 hours ago",
//     text: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it.",
//     avatar: Profile,
//     replies: [
//       {
//         author: "J.Doe",
//         date: "18 hours ago",
//         text: "This is a reply to the original comment. Lorem Ipsum is not simply random text.",
//         avatar: Profile,
//         replies: [
//           {
//             author: "A.Smith",
//             date: "16 hours ago",
//             text: "This is a nested reply. Lorem Ipsum is not simply random text.",
//             avatar: Profile,
//             replies: [],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     author: "S.Jones",
//     date: "22 hours ago",
//     text: "Another comment without replies. Lorem Ipsum is not simply random text.",
//     avatar: Profile,
//     replies: [],
//   },
// ];

function Discussion({subjectId}) {

  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentsBySubjectId(subjectId);
        const commentsData = response.data;
        const structuredComments = await Promise.all(
          commentsData.map(async (comment) => {
            const userId = comment.userId;
            const userDetails = await  listAllUsersDetails(userId); 
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
  }, [subjectId]);
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
    <AddComment subjectId={subjectId}/>
    
  </div>
  );
}

export default Discussion;
