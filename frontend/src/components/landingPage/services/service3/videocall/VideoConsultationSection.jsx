import React from 'react';
import { motion } from 'framer-motion';
import videoImage from '../../../../../assets/video-call-image.png'; 
import VideoBenefitsSection from './VideoBenefitsSection';
import SecureAccessNote from './SecureAccessNote';

const typingContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const typingText = {
  hidden: { opacity: 0, y: `0.25em` },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
};

const headingText = "See your doctor, from anywhere.";

const VideoHeroSection = () => {
  return (
    <>
    <section className="w-full py-25 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* === Left Column: Animated Text === */}
        <div>
          {/* Actual Typing Animation for Heading */}
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-4 flex flex-wrap"
            variants={typingContainer}
            initial="hidden"
            animate="visible"
          >
            {headingText.split("").map((char, idx) => (
              <motion.span key={idx} variants={typingText}>
                {char}
              </motion.span>
            ))}
          </motion.h2>

          {/* Paragraph Animation */}
          <motion.p
            className="text-gray-800 text-md sm:text-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              delay: 1.2,
            }}
          >
            TeleCare lets you consult with licensed doctors through secure video calls — no long waits, no crowded clinics.
            Simply book an appointment, and at your scheduled time, connect face-to-face with your chosen specialist from the comfort of your home.
          </motion.p>
        </div>

        {/* === Right Column: Animated Image === */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 1.4,
          }}
        >
          <img
            src={videoImage}
            alt="Video Consultation Preview"
            className="w-full max-w-md rounded-lg shadow-md"
          />
        </motion.div>
      </div>
    </section>
    <VideoBenefitsSection/>
    <SecureAccessNote/>
    </>
  );
};

export default VideoHeroSection;
