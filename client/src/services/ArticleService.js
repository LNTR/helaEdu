import axios from "axios";
const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/articles`;
const TEACHER_ARTICLE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/tm/me/articles`;
const APPROVE_ARTICLE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/articles/approved`;
const PENDING_ARTICLE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/articles/pending`;
const CREATE_ARTICLE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/articles/create`;
const RECCOMEND_ARTICLE_URL = `${import.meta.env.VITE_SERVICE_API}/articles/get-recommendation`;
const ADD_COMMENTS_ARTICLES_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/forum/create`;
const GET_COMMENTS_ARTICLES_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/forum`;



export const listArticles = () => axios.get(REST_API_BASE_URL);
export const listArticlesByTeacher = (headers) =>
  axios.get(TEACHER_ARTICLE_URL, { headers });
export const approvedArticles = () => axios.get(APPROVE_ARTICLE_URL);
export const pendingArticles = () => axios.get(PENDING_ARTICLE_URL);
export const getArticleById = (articleId) =>
  axios.get(`${REST_API_BASE_URL}/${articleId}`);
export const createArticle = (article, headers) =>
  axios.post(CREATE_ARTICLE_URL, article, { headers });
export const approveArticle = (articleId) =>
  axios.put(`${REST_API_BASE_URL}/${articleId}/approve`);
export const rejectArticle = (articleId, rejectedReason) =>
  axios.put(`${REST_API_BASE_URL}/${articleId}/decline`, null, {
    params: { rejectedReason },
  });
export const uploadArticleCover = (articleId, formData, headers) =>
  axios.post(`${REST_API_BASE_URL}/${articleId}/uploadArticleCover`, formData, {
    headers: { ...headers, "Content-Type": "multipart/form-data" },
  });
export const uploadAdditionalFiles = (articleId, formData, headers) =>
  axios.post(
    `${REST_API_BASE_URL}/${articleId}/uploadAdditionalFiles`,
    formData,
    { headers }
  );

export const reccomendArticles = (clusterId) =>
  axios.get(`${RECCOMEND_ARTICLE_URL}/${clusterId}`);

export const updateArticle = (articleId, article, headers) =>
  axios.put(`${REST_API_BASE_URL}/${articleId}`, article, { headers });
export const deleteArticle = (articleId) =>
  axios.delete(`${REST_API_BASE_URL}/${articleId}`);
export const addUpvote = (articleId, headers) =>
  axios.put(`${REST_API_BASE_URL}/${articleId}/upvote`, { headers });

export const listCommentsByArticleId = (articleId) =>
  axios.get(`${REST_API_BASE_URL}/${articleId}/comments`);

export const addComment = (comment, headers) =>
  axios.post(ADD_COMMENTS_ARTICLES_URL, comment, { headers });


export const getCommentById = (commentId) =>
  axios.get(`${GET_COMMENTS_ARTICLES_URL}/${commentId}`);

export const deleteCommentByAuthor = (commentId,headers) =>
  axios.put(`${GET_COMMENTS_ARTICLES_URL}/author/${commentId}`,{headers});

export const deleteCommentByAdmin = (commentId) =>
  axios.put(`${GET_COMMENTS_ARTICLES_URL}/admin/${commentId}`);
export const getCommentCountByArticleId =(articleId)=>axios.get(`${GET_COMMENTS_ARTICLES_URL}/${articleId}/commentCount`);
export const getUpvoteCountByArticleId =(articleId)=>axios.get(`${REST_API_BASE_URL}/${articleId}/upvoteCount`);