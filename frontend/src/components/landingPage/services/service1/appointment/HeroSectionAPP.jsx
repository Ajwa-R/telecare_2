import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import appointmentImg from '../../../../../assets/appointment-mockup.png';
import HowItWorkAPP from './HowItWorkAPP';
import AppointmentNotice from './AppointmentNotice';

const HeroSectionAPP = () => {
  const fullText = "Appointment System";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 60); // typing speed
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <section className="w-full py-16 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-200">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* === Left Info Block === */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-gray-800"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
            🗓️ <span>{displayText}</span>
          </h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3"
          >
            Easily Book or Reschedule Appointments
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="text-md sm:text-lg text-gray-700"
          >
            Manage your medical visits with ease. Our appointment system lets you choose your preferred time, get reminders, and reschedule if needed — all in one place.
          </motion.p>
        </motion.div>

        {/* === Right Image Block === */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={appointmentImg}
            alt="Appointment system mockup"
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>
    </section>
    <HowItWorkAPP/>
    <AppointmentNotice/>
    </>
  );
};

export default HeroSectionAPP;
