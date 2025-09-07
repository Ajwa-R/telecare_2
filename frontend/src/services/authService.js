// src/services/authService.js
import api from "./api";

export const loginApi = (email, password) =>
  api.post("/auth/login", { email, password }); // server sets cookie, returns user

export const googleLoginApi = (credential) =>
  api.post("/auth/google", { credential });     // server sets cookie, returns user

export const logoutApi = () => api.post("/auth/logout");
