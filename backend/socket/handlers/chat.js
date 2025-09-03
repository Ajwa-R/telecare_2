// socket/handlers/chat.js
const Message = require("../../models/Message"); // your Mongoose model

// event names are namespaced to avoid collisions
const EVENTS = {
  JOIN: "room:join",
  SEND: "chat:send",
  RECV: "chat:receive",
};

module.exports = (io, socket) => {
  // client can also explicitly join another room
  socket.on(EVENTS.JOIN, (roomId) => socket.join(roomId));

  socket.on(EVENTS.SEND, async (payload) => {
    // payload: { senderId, receiverId, text }
    try {
      // persist message
      const saved = await Message.create({
        senderId: payload.senderId,
        receiverId: payload.receiverId,
        text: payload.text,
      });

      // emit to receiver’s personal room
      io.to(payload.receiverId).emit(EVENTS.RECV, saved);

      // also echo back to sender (so both sides have DB-formatted object)
      socket.emit(EVENTS.RECV, saved);
    } catch (e) {
      console.error("chat send error:", e.message);
      socket.emit("error", { scope: "chat", message: "Failed to send" });
    }
  });
};
