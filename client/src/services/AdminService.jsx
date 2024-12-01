import axios from "axios";
const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/admins`;
const SUBSCRIPTION_FLASK_BASE_URL = `${import.meta.env.VITE_SERVICE_API}/payment/subscribers`;
const GET_CURRENT_ADMIN_BASIC_URL =`${import.meta.env.VITE_REST_API_BASE_URL}/admins/me`;
const ADD_PROFILE_IMAGE = `${import.meta.env.VITE_REST_API_BASE_URL}/admins/uploadProfilePicture`;
const EDIT_ADMIN_PROFILE = `${import.meta.env.VITE_REST_API_BASE_URL}/admins/me`;
const COMPLAINTS_ARTICLE_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/complaints`;

export const deleteAdmin =(headers) =>axios.delete(GET_CURRENT_ADMIN_BASIC_URL,{headers});
export const currentAdmin=(headers)=>axios.get(GET_CURRENT_ADMIN_BASIC_URL,{headers});
export const updateAdmin=(formData,headers)=>axios.put(`${EDIT_ADMIN_PROFILE}`, formData, {headers});
export const addProfileImageToAdmin = (email, formData, headers) =>axios.post(ADD_PROFILE_IMAGE, formData, {
    headers: { ...headers, "Content-Type": "multipart/form-data" },
  });

export const listComplaints = () => axios.get(COMPLAINTS_ARTICLE_URL);

export const getSubscribersList = () => axios.get(SUBSCRIPTION_FLASK_BASE_URL);
