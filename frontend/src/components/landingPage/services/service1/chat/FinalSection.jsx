import React from 'react';
import { motion } from 'framer-motion';

const FinalSection = () => {
  return (
    <section className="w-full py-12 px-6 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-200">
      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Start Chat
        </button>
        <button className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition">
          Sign Up
        </button>
      </motion.div>

      {/* Important Note Box */}
      <motion.div
        className="max-w-3xl mx-auto bg-white/80 rounded-lg shadow-md p-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          Important Note
        </h3>
        <p className="text-sm sm:text-base text-gray-700">
          For immediate emergencies, please contact your local emergency services.
        </p>
      </motion.div>
    </section>
  );
};

export default FinalSection;
