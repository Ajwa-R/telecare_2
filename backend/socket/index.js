// socket/index.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

let Appointment = null;
try { Appointment = require('../models/Appointment'); } catch { /* optional */ }

// --- auth helpers ---
function parseUserIdFromCookie(header) {
  try {
    const cookies = cookie.parse(header || '');
    const token = cookies.token;
    if (!token) return null;
    const p = jwt.verify(token, process.env.JWT_SECRET);
    return p?.sub || p?.id || p?._id || p?.userId || null;
  } catch { return null; }
}

function parseUserIdFromAuth(auth) {
  try {
    const token = auth?.token || auth?.authorization?.split(' ')[1];
    if (!token) return null;
    const p = jwt.verify(token, process.env.JWT_SECRET);
    return p?.sub || p?.id || p?._id || p?.userId || null;
  } catch { return null; }
}

function initSocket(httpServer, { origin, credentials = true } = {}) {
  const io = new Server(httpServer, {
    path: '/socket.io',
    cors: { origin: origin || '*', credentials },
  });

  // -------- base namespace: chat + notifications --------
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers?.cookie || '';
    const uidFromCookie = parseUserIdFromCookie(cookieHeader);
    const uid = uidFromCookie || parseUserIdFromAuth(socket.handshake.auth);
    socket.data.userId = uid ? String(uid) : '';
    next();
  });

  io.on('connection', (socket) => {
    const uid = socket.data.userId;
    if (uid) {
      socket.join(`user:${uid}`); // personal room for alerts
      socket.join(uid);           // optional compatibility
    }

    // explicit join (optional)
    socket.on('room:join', (id) => {
      const rid = String(id || '').trim();
      if (rid) socket.join(`user:${rid}`);
    });

    // attach feature handlers (chat send/receive lives here)
    require('./handlers/chat')(io, socket);
  });

  // -------- video namespace (appointment-gated) --------
  const video = io.of('/ws/video');

  video.use(async (socket, next) => {
    const { appointmentId } = socket.handshake.auth || {};
    const cookieHeader = socket.handshake.headers?.cookie || '';
    const uid = parseUserIdFromCookie(cookieHeader) || parseUserIdFromAuth(socket.handshake.auth);

    if (!appointmentId) return next(new Error('appointmentId required'));

    socket.data.userId = uid ? String(uid) : '';
    socket.data.appointmentId = String(appointmentId);

    if (Appointment) {
      try {
        const appt = await Appointment.findById(appointmentId).select('patientId doctorId');
        if (!appt) return next(new Error('appointment not found'));
        const allowed =
          String(appt.patientId) === socket.data.userId ||
          String(appt.doctorId) === socket.data.userId;
        if (!allowed) return next(new Error('not invited'));
      } catch { /* fall through */ }
    }
    next();
  });

  video.on('connection', (socket) => {
    const { appointmentId } = socket.data;
    const userId = socket.data.userId;

    socket.join(appointmentId);
    const size = video.adapter.rooms.get(appointmentId)?.size || 1;
    video.to(appointmentId).emit('presence:update', { userId, onlineCount: size });

    socket.on('call:initiate', (p = {}) =>
      socket.to(appointmentId).emit('call:ring', { from: userId, p })
    );
    socket.on('call:cancel', () =>
      socket.to(appointmentId).emit('call:cancelled', { by: userId })
    );
    socket.on('call:accept', () =>
      socket.to(appointmentId).emit('call:accepted', { by: userId })
    );
    socket.on('call:reject', () =>
      socket.to(appointmentId).emit('call:rejected', { by: userId })
    );
    socket.on('call:end', () =>
      video.to(appointmentId).emit('call:ended', { by: userId })
    );
    socket.on('webrtc:signal', (data) =>
      socket.to(appointmentId).emit('webrtc:signal', data)
    );

    socket.on('disconnect', () => {
      const left = video.adapter.rooms.get(appointmentId)?.size || 0;
      video.to(appointmentId).emit('presence:update', { userId, onlineCount: left });
    });
  });

  return io;
}

module.exports = { initSocket };











// const { Server } = require("socket.io");
// const jwt = require("jsonwebtoken");
// const cookie = require('cookie');

// // optional models
// let Appointment = null;
// try { Appointment = require("../models/Appointment"); } catch {}

// let Message = null; //  add for chat persistence
// try { Message = require("../models/Message"); } catch {}

// function parseUserFromToken(auth) {
//   try {
//     const token = auth?.token || auth?.authorization?.split(" ")[1];
//     if (!token) return null;
//     const p = jwt.verify(token, process.env.JWT_SECRET);
//     return p?.id || p?._id || p?.userId || null;
//   } catch { return null; }
// }

// function initSocket(httpServer, opts = {}) {
//   const io = new Server(httpServer, {
//     path: "/socket.io",                // keep default path
//     cors: { origin: opts.origin || "*", credentials: true }
//   });

//   // ---------- base namespace: chat + notifications ----------
//   io.use((socket, next) => {
//     socket.data.userId = parseUserFromToken(socket.handshake.auth) || "";
//     next();
//   });

//   io.on("connection", (socket) => {
//     const uid = socket.data.userId;
//     if (uid) {
//       socket.join(`user:${uid}`); // personal room for alerts
//       console.log("[socket] joined room:", `user:${uid}`, "->", socket.id);
//     } else {
//       console.log("[socket] connected without auth token", "->", socket.id);
//     }

//     // ✅ join request (optional, compatible with your client)
//     socket.on("room:join", (userId) => {
//       const id = String(userId || "").trim();
//       if (id) socket.join(`user:${id}`);
//     });

//     // ✅ persist + fanout chat messages
//     socket.on("chat:send", async (p = {}) => {
//       try {
//         const senderId   = p.senderId?.toString?.() || String(p.senderId || "");
//         const receiverId = p.receiverId?.toString?.() || String(p.receiverId || "");
//         const text       = (p.text || "").toString().trim();

//         if (!senderId || !receiverId || !text) return;

//         // If Message model not wired (dev mode), just fanout without DB
//         if (!Message) {
//           const echo = {
//             _id: `${Date.now()}-${Math.random()}`,
//             senderId, receiverId, text,
//             createdAt: new Date().toISOString(),
//           };
//           io.to(`user:${senderId}`).emit("chat:receive", echo);
//           io.to(`user:${receiverId}`).emit("chat:receive", echo);
//           return;
//         }

//         const msg = await Message.create({ senderId, receiverId, text });
//         // echo to both personal rooms
//         io.to(`user:${senderId}`).emit("chat:receive", msg);
//         io.to(`user:${receiverId}`).emit("chat:receive", msg);
//       } catch (e) {
//         console.error("chat:send error", e?.message || e);
//       }
//     });

//     // (you can add other base-namespace events here)
//   });

//   // ---------- video namespace ONLY ----------
//   const video = io.of("/ws/video");

//   video.use(async (socket, next) => {
//     const { appointmentId } = socket.handshake.auth || {};
//     const uid = parseUserFromToken(socket.handshake.auth);
//     if (!appointmentId) return next(new Error("appointmentId required"));

//     socket.data.userId = uid ? String(uid) : "";
//     socket.data.appointmentId = String(appointmentId);

//     if (Appointment) {
//       try {
//         const appt = await Appointment.findById(appointmentId).select("patientId doctorId");
//         if (!appt) return next(new Error("appointment not found"));
//         const allowed =
//           String(appt.patientId) === socket.data.userId ||
//           String(appt.doctorId) === socket.data.userId;
//         if (!allowed) return next(new Error("not invited"));
//       } catch {}
//     }
//     next();
//   });

//   video.on("connection", (socket) => {
//     const { appointmentId } = socket.data;
//     const userId = socket.data.userId;

//     socket.join(appointmentId);
//     const size = video.adapter.rooms.get(appointmentId)?.size || 1;
//     video.to(appointmentId).emit("presence:update", { userId, onlineCount: size });

//     socket.on("call:initiate", (p = {}) =>
//       socket.to(appointmentId).emit("call:ring", { from: userId, ...p })
//     );
//     socket.on("call:cancel", () =>
//       socket.to(appointmentId).emit("call:cancelled", { by: userId })
//     );
//     socket.on("call:accept", () =>
//       socket.to(appointmentId).emit("call:accepted", { by: userId })
//     );
//     socket.on("call:reject", () =>
//       socket.to(appointmentId).emit("call:rejected", { by: userId })
//     );
//     socket.on("call:end", () =>
//       video.to(appointmentId).emit("call:ended", { by: userId })
//     );
//     socket.on("webrtc:signal", (data) =>
//       socket.to(appointmentId).emit("webrtc:signal", data)
//     );

//     socket.on("disconnect", () => {
//       const left = video.adapter.rooms.get(appointmentId)?.size || 0;
//       video.to(appointmentId).emit("presence:update", { userId, onlineCount: left });
//     });
//   });

//   return io;
// }

// module.exports = { initSocket };
