import axios from "axios";

const REST_API_BASE_URL = `${import.meta.env.VITE_SERVICE_API}/chat`;
const GENERATE_WEEKLY_QUIZ = `${import.meta.env.VITE_SERVICE_API}/chat/quizgen`;
const GET_WEEKLY_QUIZ = `${import.meta.env.VITE_SERVICE_API}/chat/getquiz`;


export const generateQuiz = (formData,headers) =>axios.post(GENERATE_WEEKLY_QUIZ, formData,{headers});
export const getQuizById=(quizId)=>axios.get(`${REST_API_BASE_URL}/get-quiz/${quizId}`);
export const reviewQuiz=(quizId)=>axios.get(`${REST_API_BASE_URL}/${quizId}/review`);
export const getQuizByModeratorEmail=(headers)=>axios.get(`${REST_API_BASE_URL}/get-quizzes`,{headers});
export const getQuizByModAndSubjectId=(subjectId,headers)=>axios.get(`${REST_API_BASE_URL}/get-quizzes-by-date/${subjectId}`,{headers});
export const regenerateQuestion=(payload)=>axios.post(`${REST_API_BASE_URL}/regen`,payload);
export const getWeeklyQuiz = () =>axios.post(GET_WEEKLY_QUIZ, formData);
export const getOpenQuiz = (headers, subjectId) =>
    axios.get(`${import.meta.env.VITE_REST_API_BASE_URL}/chat/quiz/${subjectId}`, { headers })
