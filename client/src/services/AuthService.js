import axios from "axios";
const URL = `${import.meta.env.VITE_REST_API_BASE_URL}/authenticate`;
const CURRENT_DETAILS_FOR_ALL_USERS=`${import.meta.env.VITE_REST_API_BASE_URL}/tm/me/all`;

export const authenticateUser = (formData) => axios.post(URL, formData);
export const getAllDetailsForCurrentUser=(headers)=>axios.get(CURRENT_DETAILS_FOR_ALL_USERS,{headers});
