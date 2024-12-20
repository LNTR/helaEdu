import axios from "axios";

const GET_STUDENT_DETAILS_URL = `${
  import.meta.env.VITE_REST_API_BASE_URL
}/students/page`;
const CREATE_STUDENT = `${
  import.meta.env.VITE_REST_API_BASE_URL
}/students/create`;
const GET_STUDENT_BASIC_URL = `${
  import.meta.env.VITE_REST_API_BASE_URL
}/students`;
const GET_CURRENT_STUDENT_BASIC_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/students/me`;
const GET_STUDENT_SUBJECTS = `${import.meta.env.VITE_SERVICE_API}/subjects/subjects`;

export const listStudentDetails = (pageNo) =>
  axios.get(`${GET_STUDENT_DETAILS_URL}/${pageNo}`);

export const createStudent = (userData) =>
  axios.post(`${CREATE_STUDENT}`, userData);

export const deleteStudents =(studentId) =>axios.delete( `${GET_STUDENT_BASIC_URL}/${studentId}`);
export const currentStudent=(headers)=>axios.get(GET_CURRENT_STUDENT_BASIC_URL,{headers});
export const getStudentById=(userId)=>axios.get(`${GET_STUDENT_BASIC_URL}/${userId}`);
export const getEnrolledSubjects = (headers) => axios.get(GET_STUDENT_SUBJECTS, { headers });