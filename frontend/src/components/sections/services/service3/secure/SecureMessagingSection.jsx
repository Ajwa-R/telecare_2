import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import secureImg from '../../../../../assets/secure-messaging-img.png';

const SecureMessagingSection = () => {
  const fullText = "Secure Messaging";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-30 bg-gradient-to-r from-slate-100 via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* === Left Image === */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={secureImg}
            alt="Secure Messaging"
            className="w-full max-w-sm mx-auto"
          />
        </motion.div>

        {/* === Right Text === */}
        <div className="text-gray-800">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-4">
            {displayText}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-md sm:text-lg text-gray-700 mb-6"
          >
            When privacy matters, TeleCare delivers. With Secure Messaging, patients and doctors can communicate in complete confidentiality. Share reports, ask questions, and receive updates — all encrypted and protected.
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
          >
            Start Messaging Securely
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default SecureMessagingSection;
