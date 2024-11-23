import axios from "axios";
const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/assignments`;
const LIST_ARTICLES_BY_TEACHERID = `${import.meta.env.VITE_REST_API_BASE_URL}/assignments/tm`;
const CREATE_ASSIGNMENT =`${import.meta.env.VITE_REST_API_BASE_URL}/assignments/create`;

export const listAssignment=(userId)=>axios.get(`${LIST_ARTICLES_BY_TEACHERID}/${userId}`);
export const createAssignment=(assignment,headers) =>axios.post(CREATE_ASSIGNMENT,assignment,{headers});
// export const createAssignment=(assignment) =>axios.post(CREATE_ASSIGNMENT,assignment);
export const addQuizzes =(assignment,assignmentId)=>axios.post(`${REST_API_BASE_URL}/${assignmentId}/quizzes`,assignment);
export const getAssignment=(assignmentId)=>axios.get(`${REST_API_BASE_URL}/${assignmentId}`)
export const startAssignment=(assignmentId)=>axios.post(`${REST_API_BASE_URL}/${assignmentId}/start`);
export const endAssignment=(assignmentId)=>axios.post(`${REST_API_BASE_URL}/${assignmentId}/end`);
export const startAssignmentByStudent = (assignmentId, headers) =>
    axios.post(`${REST_API_BASE_URL}/${assignmentId}/student/start`, null, { headers });

export const submitAnswer = (assignmentId, quizId, providedAnswers, headers) => axios.post(`${REST_API_BASE_URL}/${assignmentId}/${quizId}/answer`, providedAnswers,{ headers });

export const submitStudentMark = (assignmentId, marks, headers) => axios.post(`${REST_API_BASE_URL}/${assignmentId}/marks?studentMarks=${marks}`, null,{ headers });

export const deleteAssignment=(assignmentId)=>axios.delete(`${REST_API_BASE_URL}/${assignmentId}`);

