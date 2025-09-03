import React from 'react';
import { motion } from 'framer-motion';
import chatIcon from '../../../../../assets/chat-icon.png';
import chatIllustration from '../../../../../assets/chat-illustration.gif';
import HowItWorks from './HowItWorks';
import FinalSection from './FinalSection';

const HeroSection = () => {
  return (
    <>
    <section className="w-full py-16 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-200">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* === Left Info Block === */}
        <div className="text-gray-800">
          {/* Chat icon animation */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.10 }}
            className="flex items-center mb-2"
          >
            <img src={chatIcon} alt="Chat Icon" className="w-12 h-10" />
          </motion.div>

          {/* Heading animation */}
          <motion.h2
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.10 }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-indigo-900"
          >
            24/7 Emergency Chat
          </motion.h2>

          {/* Paragraph animation */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.14, delay: 0.8 }}
            className="text-md sm:text-lg text-gray-700"
          >
            Get help instantly anytime through real-time messaging with medical responders.
          </motion.p>
        </div>

        {/* === Right Illustration Block === */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.16 }}
        >
          <img
            src={chatIllustration}
            alt="Patient chatting with doctor"
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>
    </section>
    <HowItWorks/>
    <FinalSection/>
    </>
  );
};

export default HeroSection;
