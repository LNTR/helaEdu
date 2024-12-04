import axios from "axios";
const CHAT_BOT_API = `${import.meta.env.VITE_SERVICE_API}/chat`;
const CHAT_BOT_HISTORY_API = `${import.meta.env.VITE_SERVICE_API}/chat/history`;

export const sendToChatBot = (payload, headers) =>
  axios.post(CHAT_BOT_API, payload, { headers });
export const getChatBotHistory = (payload, headers) =>
  axios.post(CHAT_BOT_HISTORY_API, payload, { headers });
