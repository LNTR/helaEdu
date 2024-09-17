import axios from "axios";
const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/admins`;
const GET_CURRENT_ADMIN_BASIC_URL =`${import.meta.env.VITE_REST_API_BASE_URL}/admins/me`;
const ADD_PROFILE_IMAGE = `${import.meta.env.VITE_REST_API_BASE_URL}/admins/uploadProfilePicture`;
const EDIT_ADMIN_PROFILE = `${import.meta.env.VITE_REST_API_BASE_URL}/admins/me`;

export const deleteAdmin =(adminId) =>axios.delete( `${REST_API_BASE_URL}/${adminId}`);
export const currentAdmin=(headers)=>axios.get(GET_CURRENT_ADMIN_BASIC_URL,{headers})
export const updateAdmin=(formData,headers)=>axios.put(`${EDIT_ADMIN_PROFILE}`, formData, {headers});
export const addProfileImageToAdmin = (email, formData, headers) =>axios.post(ADD_PROFILE_IMAGE, formData, {
    headers: { ...headers, "Content-Type": "multipart/form-data" },
  });
  