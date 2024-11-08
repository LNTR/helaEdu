import axios from "axios";

const REST_API_BASE_URL = `${import.meta.env.VITE_REST_API_BASE_URL}/complaints`;
const COMPLAINTS_ARTICLE_URL=`${import.meta.env.VITE_REST_API_BASE_URL}/complaints/create`;

export const addComplaint = (complaint, headers) =>
    axios.post(COMPLAINTS_ARTICLE_URL,complaint, { headers });
export const reviewComplaint = (complaintId,feedback) =>
    axios.put(`${REST_API_BASE_URL}/${complaintId}/review`, null, {
        params: {feedback },
      });
export const declineComplaint = (complaintId, feedback) =>
    axios.put(`${REST_API_BASE_URL}/${complaintId}/decline`, null, {
      params: { feedback },
    });
export const deleteComplaint = (complaintId) =>
        axios.delete(`${REST_API_BASE_URL}/${complaintId}`);