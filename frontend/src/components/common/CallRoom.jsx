// frontend/src/components/common/CallRoom.jsx
import io from "socket.io-client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

export default function CallRoom() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  // UI state
  const [status, setStatus] = useState("idle"); // idle | ringing | calling | in-call | ended
  const [incomingFrom, setIncomingFrom] = useState(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [error, setError] = useState("");

  // Media / RTC
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  // Socket
  const socketRef = useRef(null);

  // Helpers
  const baseURL = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:5000",
    []
  );
  const token = useMemo(() => localStorage.getItem("token") || "", []);

  useEffect(() => {
    if (!appointmentId) return;

    // 1) Connect socket
    const socket = io(`${baseURL}/ws/video`, {
      path: "/socket.io", // server default path
      auth: { token, appointmentId }, // namespace auth
      transports: ["websocket"], // optional but cleaner
      withCredentials: true,
      reconnection: true,
    });
    socketRef.current = socket;

    // --- Incoming events ---
    socket.on("connect_error", (e) =>
      setError(e.message || "Socket connect error")
    );
    socket.on("presence:update", () => {
      /* could show online status */
    });

    socket.on("call:ring", ({ from }) => {
      // Only trigger incoming UI if we're not already in call
      if (status !== "in-call") {
        setIncomingFrom(from || "Unknown");
        setStatus("ringing");
      }
    });

    socket.on("call:accepted", () => {
      // As caller: create offer now
      if (!pcRef.current) return;
      createAndSendOffer().catch((e) => setError(String(e)));
    });

    socket.on("call:rejected", () => {
      setStatus("idle");
    });

    socket.on("call:ended", () => {
      endCall(false);
    });

    socket.on("webrtc:signal", async (msg) => {
      try {
        if (!pcRef.current) {
          await ensurePC();
        }
        if (msg.type === "offer") {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(msg.sdp)
          );
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          socket.emit("webrtc:signal", { type: "answer", sdp: answer });
          setStatus("in-call");
        } else if (msg.type === "answer") {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(msg.sdp)
          );
          setStatus("in-call");
        } else if (msg.type === "candidate" && msg.candidate) {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(msg.candidate)
          );
        }
      } catch (e) {
        setError(String(e));
      }
    });

    // Cleanup on unmount
    return () => {
      try {
        socket.disconnect();
      } catch {}
      endCall(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  async function ensurePC() {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pc.onicecandidate = (e) => {
      if (e.candidate)
        socketRef.current?.emit("webrtc:signal", {
          type: "candidate",
          candidate: e.candidate,
        });
    };
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };
    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        endCall(false);
      }
    };
    pcRef.current = pc;
    return pc;
  }

  async function getLocalStream() {
    if (localStreamRef.current) return localStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  }

  async function attachLocalTracks() {
    const pc = await ensurePC();
    const stream = await getLocalStream();
    const senders = pc.getSenders();
    const v = stream.getVideoTracks?.()[0];
    const a = stream.getAudioTracks?.()[0];

    if (v && !senders.find((s) => s.track && s.track.kind === "video")) {
      pc.addTrack(v, stream);
    }
    if (a && !senders.find((s) => s.track && s.track.kind === "audio")) {
      pc.addTrack(a, stream);
    }
  }

  // Caller flow
  async function startCall() {
    try {
      await attachLocalTracks();
      setStatus("calling");
      socketRef.current?.emit("call:initiate", {});
    } catch (e) {
      setError(String(e));
    }
  }

  async function createAndSendOffer() {
    const pc = await ensurePC();
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await pc.setLocalDescription(offer);
    socketRef.current?.emit("webrtc:signal", { type: "offer", sdp: offer });
  }

  // Callee flow
  async function acceptCall() {
    try {
      await attachLocalTracks();
      socketRef.current?.emit("call:accept");
      setStatus("in-call"); // will finalize after offer->answer exchange
    } catch (e) {
      setError(String(e));
    }
  }

  function rejectCall() {
    socketRef.current?.emit("call:reject");
    setIncomingFrom(null);
    setStatus("idle");
  }

  function toggleMute() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMuted((m) => !m);
  }

  function toggleCamera() {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOff((v) => !v);
  }

  function endCall(emit = true) {
    try {
      if (emit) socketRef.current?.emit("call:end");
    } catch {}
    try {
      if (pcRef.current) {
        pcRef.current.getSenders()?.forEach((s) => {
          try {
            s.track && s.track.stop();
          } catch {}
        });
        pcRef.current.close();
      }
    } catch {}
    try {
      const s = localStreamRef.current;
      if (s) s.getTracks().forEach((t) => t.stop());
    } catch {}
    pcRef.current = null;
    localStreamRef.current = null;
    setStatus("idle");
    setIncomingFrom(null);
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-3 text-sm opacity-70">
        Appointment: {appointmentId}
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Videos */}
      <div className="grid md:grid-cols-2 gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg bg-black aspect-video"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg bg-black aspect-video"
        />
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-3">
        {status === "idle" && (
          <button
            onClick={startCall}
            className="px-4 py-2 rounded bg-emerald-600 text-white"
          >
            Start Call
          </button>
        )}
        {status !== "idle" && (
          <button
            onClick={() => endCall(true)}
            className="px-4 py-2 rounded bg-rose-600 text-white"
          >
            Hang Up
          </button>
        )}
        <button onClick={toggleMute} className="px-4 py-2 rounded bg-gray-200">
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={toggleCamera}
          className="px-4 py-2 rounded bg-gray-200"
        >
          {camOff ? "Camera On" : "Camera Off"}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-slate-200"
        >
          Back
        </button>
      </div>

      {/* Status banners */}
      {status === "calling" && (
        <div className="mt-3 text-amber-600">
          Ringing… waiting for the other side to accept.
        </div>
      )}
      {status === "in-call" && (
        <div className="mt-3 text-emerald-700">You are in the call.</div>
      )}

      {/* Incoming call modal */}
      {status === "ringing" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-lg font-semibold mb-2">Incoming call</div>
            <div className="text-sm opacity-70 mb-4">
              from: {incomingFrom || "Unknown"}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={rejectCall}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Reject
              </button>
              <button
                onClick={acceptCall}
                className="px-4 py-2 rounded bg-emerald-600 text-white"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
