import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || "http://54.180.150.135/api",
  withCredentials: true, // 쿠키 인증이 필요하면 유지
});

export default api;
