import axios from "axios";
const HAS_ENROLLED_API = `${
  import.meta.env.VITE_SERVICE_API
}/subjects/has-enrolled`;
const ENROLL_SUBJECT_API = `${
  import.meta.env.VITE_SERVICE_API
}/subjects/enroll`;
const UNENROLL_SUBJECT_API = `${
  import.meta.env.VITE_SERVICE_API
}/subjects/unenroll`;

export const checkHasEnrolled = (subjectId, headers) =>
  axios.get(`${HAS_ENROLLED_API}/${subjectId}`, { headers });

export const enrollToSubject = (subjectId, headers) =>
  axios.post(`${ENROLL_SUBJECT_API}/${subjectId}`, {}, { headers });

export const unenrollFromSubject = (subjectId, headers) =>
  axios.post(`${UNENROLL_SUBJECT_API}/${subjectId}`, {}, { headers });
