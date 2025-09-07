import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 

const SecureAccessNote = () => {
  return (
    <motion.section
      className="w-full py-10 px-6 bg-blue-50"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto bg-white/80 rounded-lg shadow-md p-6 text-center backdrop-blur-md">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          🔒 Note: Secure Access Required
        </h3>

        <p className="text-md sm:text-lg text-gray-700 mb-6">
          Video consultation is available only to <strong>logged-in patients</strong> with confirmed appointments.
        </p>

        <Link to="/login">
          <motion.button
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Login to Access Video Consultation
          </motion.button>
        </Link>
      </div>
    </motion.section>
  );
};

export default SecureAccessNote;
