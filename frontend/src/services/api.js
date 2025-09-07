// src/services/api.js
import axios from "axios";
import { API_BASE, API_PREFIX } from "@/app/config";

const api = axios.create({
  baseURL: `${API_BASE}${API_PREFIX}`,
  withCredentials: true, // <-- send/receive HTTP-only cookies
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    err.message = err?.response?.data?.message || err.message;
    return Promise.reject(err);
  }
);

export default api;

