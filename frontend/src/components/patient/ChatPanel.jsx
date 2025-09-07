import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socket, { ensureSocketConnected } from "../../lib/socket";
import api from "../../services/api";

const EVENTS = {
  JOIN: "room:join",
  SEND: "chat:send",
  RECV: "chat:receive",
};

const ChatPanel = ({ partnerId, partnerName }) => {
  const user = useSelector((s) => s.auth.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  const myId = user?._id;

  // 1) connect shared socket once
  useEffect(() => {
    ensureSocketConnected();
    const onErr = (e) => console.log("socket connect_error:", e?.message);
    socket.on("connect_error", onErr);

    return () => {
      socket.off("connect_error", onErr);
    };
  }, []);

  // 2) join personal room 
  useEffect(() => {
    if (!myId) return;
    socket.emit(EVENTS.JOIN, myId);
  }, [myId]);

  // 3) receive new msgs (filter for this dm only)
  useEffect(() => {
    if (!myId || !partnerId) return;

    const onRecv = (msg) => {
      const sid = msg.senderId?._id || msg.senderId;
      const rid = msg.receiverId?._id || msg.receiverId;

      if (
        (sid === myId && rid === partnerId) ||
        (sid === partnerId && rid === myId)
      ) {
        setMessages((prev) => {
          const id = msg._id ? String(msg._id) : null;
          // already have this message? skip
          if (id && prev.some((x) => String(x._id) === id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on(EVENTS.RECV, onRecv);
    return () => socket.off(EVENTS.RECV, onRecv);
  }, [myId, partnerId]);

  // 4) fetch history when partner changes
  useEffect(() => {
    if (!myId || !partnerId) return;
    (async () => {
      try {
        const data = await api.get(`/chats/${myId}/${partnerId}`);
        const out = [];
        const seen = new Set();
        (Array.isArray(data) ? data : []).forEach((m) => {
          const key = m._id
            ? String(m._id)
            : `${m.senderId}-${m.createdAt}-${m.text}`;
          if (!seen.has(key)) {
            seen.add(key);
            out.push(m);
          }
        });
        setMessages(out);
      } catch {
        setMessages([]);
      }
    })();
  }, [myId, partnerId]);

  // 5) auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const t = (text || "").trim();
    if (!t || !myId || !partnerId) return;
    socket.emit(EVENTS.SEND, {
      senderId: myId,
      receiverId: partnerId,
      text: t,
    });
    setText("");
  };

  if (!partnerId) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="font-semibold mb-2">Chat</div>
        <p className="text-gray-600">
          Book an appointment to start chatting with a doctor.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col h-[480px]">
      <div className="font-semibold mb-2">
        Chat with {partnerName || "Doctor"}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((m, i) => {
          const mine = m.senderId === myId || m.senderId?._id === myId;
          const k = `${m._id ?? "tmp"}-${m.createdAt ?? ""}-${i}`; // unique for sure
          return (
            <div
              key={k}
              className={`max-w-[70%] p-2 rounded ${
                mine ? "bg-emerald-100 ml-auto" : "bg-gray-100"
              }`}
              title={m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
            >
              {m.text}
            </div>
          );
        })}

        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={send}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
