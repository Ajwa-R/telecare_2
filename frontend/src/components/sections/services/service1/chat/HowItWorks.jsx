import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaSearch, FaCalendarAlt, FaComments } from 'react-icons/fa';

const steps = [
  { icon: <FaUser className="text-4xl text-indigo-600" />, text: 'Sign up or login' },
  { icon: <FaSearch className="text-4xl text-indigo-600" />, text: 'Search for specialist' },
  { icon: <FaCalendarAlt className="text-4xl text-indigo-600" />, text: 'Start the chat session' },
  { icon: <FaComments className="text-4xl text-indigo-600" />, text: 'Get real-time support' },
];

const HowItWorks = () => {
  return (
    <section className="w-full bg-white py-10 px-6">
      <div className="max-w-6xl mx-auto text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-900">How it Works</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center p-4"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-3">{step.icon}</div>
            <p className="text-md font-medium text-gray-800">{step.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
