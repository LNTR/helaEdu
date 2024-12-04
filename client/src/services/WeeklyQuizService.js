import axios from "axios";

const REST_API_BASE_URL = `${import.meta.env.VITE_SERVICE_API}/chat`;
const GENERATE_WEEKLY_QUIZ = `${import.meta.env.VITE_SERVICE_API}/chat/quizgen`;
const GET_WEEKLY_QUIZ = `${import.meta.env.VITE_SERVICE_API}/chat/getquiz`;


export const generateQuiz = (formData) =>axios.post(GENERATE_WEEKLY_QUIZ, formData);
export const getWeeklyQuiz = () =>axios.post(GET_WEEKLY_QUIZ, formData);
export const getOpenQuiz = (headers, subjectId) =>
    axios.get(`${import.meta.env.VITE_REST_API_BASE_URL}/chat/quiz/${subjectId}`, { headers })