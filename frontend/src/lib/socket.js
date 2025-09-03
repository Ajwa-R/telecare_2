// src/lib/socket.js
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// create the client but don't auto-connect until we attach the token
const socket = io(API_BASE, {
  path: "/socket.io",
  autoConnect: false,
  transports: ["websocket"], // ok to keep websocket-first
});

export function ensureSocketConnected() {
  // always refresh token before connecting/reconnecting
  const token = localStorage.getItem("token");
  if (token) {
    socket.auth = { token };
  } else {
    // if no token, still allow connect (server will treat as guest)
    socket.auth = {};
  }

  if (!socket.connected) {
    try {
      socket.connect();
    } catch (e) {
      // swallow; ChatPanel will see connect_error
    }
  }
  return socket;
}

// optional: simple helpers for login/logout flows
export function reconnectWithFreshToken() {
  const token = localStorage.getItem("token");
  socket.auth = token ? { token } : {};
  // force reconnect so server gets the new token and joins user room
  try {
    socket.disconnect();
  } catch {}
  socket.connect();
}

export default socket;
