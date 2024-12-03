import axios from "axios";
const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/notes`;
const GET_TM_NOTES_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/tm/me/notes`;
const GET_ALL_NOTES_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/notes/me/notes`;

export const getNotesByTeacherId=(headers)=>axios.get(`${GET_TM_NOTES_URL}`,{headers});
export const createNoteByTeacher =(noteData,headers) =>axios.post(`${REST_API_BASE_URL}/create`,noteData,{headers});
export const updateNoteByTeacher = (noteId, note) =>axios.put(`${REST_API_BASE_URL}/update/${noteId}`, note);
export const getNotesByUserId=(headers)=>axios.get(`${GET_ALL_NOTES_URL}`,{headers});
