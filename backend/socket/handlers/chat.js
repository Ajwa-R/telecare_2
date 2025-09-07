// socket/handlers/chat.js
const Message = require('../../models/Message');

const EVENTS = {
  JOIN: 'room:join',
  SEND: 'chat:send',
  RECV: 'chat:receive',
  ERROR: 'error',
};

module.exports = (io, socket) => {
  socket.on(EVENTS.JOIN, (id) => {
    const rid = String(id || '').trim();
    if (rid) socket.join(`user:${rid}`);
  });

  // Secure send: senderId comes from cookie-JWT (socket.data.userId), not client payload
  socket.on(EVENTS.SEND, async (payload = {}) => {
    try {
      const senderId = socket.data.userId; // set in socket/index.js auth middleware
      const receiverId = String(payload.receiverId || '').trim();
      const text = String(payload.text || '').trim();

      if (!senderId) {
        return socket.emit(EVENTS.ERROR, { scope: 'auth', message: 'Unauthenticated' });
      }
      if (!receiverId || !text) return; // silently ignore bad payload

      // persist
      const saved = await Message.create({ senderId, receiverId, text });

      // fanout to both personal rooms
      io.to(`user:${receiverId}`).emit(EVENTS.RECV, saved);
      io.to(`user:${senderId}`).emit(EVENTS.RECV, saved); // echo to sender
    } catch (e) {
      console.error('chat:send error:', e);
      socket.emit(EVENTS.ERROR, { scope: 'chat', message: 'Failed to send' });
    }
  });
};
