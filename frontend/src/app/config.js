// src/app/config.js
export const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "");
export const API_PREFIX = "/api"; 
