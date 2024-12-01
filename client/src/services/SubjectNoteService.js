import axios from "axios";
const SUBJECT_NOTE_VIEW_API = `${import.meta.env.VITE_SERVICE_API}/notes/view`;
const SUBJECT_NOTE_UPDATE_API = `${
  import.meta.env.VITE_SERVICE_API
}/notes/update`;

export const viewNote = (subjectId, headers) =>
  axios.get(`${SUBJECT_NOTE_VIEW_API}/${subjectId}`, { headers });

export const updateNote = (subjectId, content, headers) =>
  axios.post(`${SUBJECT_NOTE_UPDATE_API}/${subjectId}`, content, { headers });
