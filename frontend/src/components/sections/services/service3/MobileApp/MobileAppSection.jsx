import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import mockupImg from '../../../../../assets/mobMockup.png';
import logo from '../../../../../assets/logo.png';

const MobileAppSection = () => {
  const fullText = "Your care, always in your pocket";
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
    <section className="w-full py-16 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* === Left Content === */}
        <div>
          {/* Logo & Label */}
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="TeleCare Logo" className="w-10 h-7" />
            <span className="text-emerald-700 font-semibold text-md bg-emerald-100 px-2 py-1 rounded">
              Mobile App
            </span>
          </div>

          {/* Heading with typing animation */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {displayText}
          </h2>

          {/* Paragraph */}
          <motion.p
            className="text-gray-700 text-md sm:text-lg mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Download the TeleCare mobile app to manage appointments, chat with
            doctors, access medical records, and receive instant notifications — all
            in one secure, user-friendly platform.
          </motion.p>

          {/* Bullet List */}
          <motion.ul
            className="list-disc pl-5 text-gray-700 text-sm space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <li>Book & reschedule appointments</li>
            <li>Chat with doctors & support</li>
            <li>Access medical records anytime</li>
            <li>Receive health tips & alerts</li>
          </motion.ul>

          {/* Buttons */}
          <motion.div
            className="flex gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <button className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition">
              Download for Android
            </button>
            <button className="bg-white text-emerald-600 border border-emerald-600 px-6 py-2 rounded hover:bg-emerald-50 transition">
              Download for iOS
            </button>
          </motion.div>
        </div>

        {/* === Right Image === */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
        >
          <img
            src={mockupImg}
            alt="Mobile Mockup"
            className="w-full max-w-sm mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MobileAppSection;
