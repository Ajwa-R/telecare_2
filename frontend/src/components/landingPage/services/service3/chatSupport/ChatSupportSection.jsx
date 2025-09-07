import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import agentImg from "../../../../../assets/chat-agent.png";
import chatpop from "../../../../../assets/chat-popup.png";

const ChatSupportSection = () => {
  const navigate = useNavigate();
  const fullText = "Instant Help, Anytime You Need";
  const [displayText, setDisplayText] = useState("");

  const handleStartChat = () => {
    navigate("/benefits/chat-support");
  };

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white to-blue-50 px-6 py-16">
      {/* === Left Image === */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/3 flex  mb-10 md:mb-0"
      >
        <img
          src={agentImg}
          alt="Live Chat Support"
          className="max-w-xs md:max-w-sm"
        />
      </motion.div>

      {/* === Text Content === */}
      <div className="md:w-2/3 max-w-xl text-center md:text-left py-20 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {displayText}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-gray-700 text-base md:text-lg mb-6"
        >
          Whether it’s technical help or service queries, our live chat team is
          always there. Get fast responses from real people — 24/7.
        </motion.p>

        {/* === Chat UI Image === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex justify-center md:justify-start"
        >
          <img
            src={chatpop}
            alt="Chat UI"
            className="max-w-md pl-25 w-full mb-4"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ChatSupportSection;
