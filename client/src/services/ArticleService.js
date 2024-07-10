import axios from "axios";
const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/articles`;
const TEACHER_ARTICLE_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/teachers/me/articles`
const APPROVE_ARTICLE_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/articles/approved`
const CREATE_ARTICLE_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/articles/create`
export const listArticles=()=>axios.get(REST_API_BASE_URL);
export const listArticlesByTeacher=()=>axios.get(TEACHER_ARTICLE_URL);
export const approvedArticles=()=>axios.get(APPROVE_ARTICLE_URL);
export const getArticleById = (articleId) => axios.get(`${REST_API_BASE_URL}/${articleId}`)
export const createArticle =(article) => axios.post(CREATE_ARTICLE_URL,article);