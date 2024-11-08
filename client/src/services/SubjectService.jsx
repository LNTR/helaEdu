import axios from "axios";

const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/subjects`;
const CREATE_SUBJECTS_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/subjects/create`;

export const createSubject = (subjectsData) =>axios.post(`${CREATE_SUBJECTS_URL}`, subjectsData);

export const uploadPdf = (subjectId, formData) =>axios.post(`${REST_API_BASE_URL}/uploadPdf`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    params: { subjectId }
  });
  export const listSubjectsByGrade=(grade)=>axios.get(`${REST_API_BASE_URL}/byGrade/${grade}`);
