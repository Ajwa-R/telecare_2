import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: "📝",
    title: "Fill your details",
    description: "Basic info, symptoms & preferred date",
  },
  {
    icon: "🔍",
    title: "Choose doctor",
    description: "Browse profiles, availability & expertise",
  },
  {
    icon: "📅",
    title: "Book appointment",
    description: "Instant confirmation via app/email",
  },
];

const HowItWorkAPP = () => {
  return (
    <section className="w-full py-10 px-6 bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-2">
          How it Works
        </h2>
        <p className="text-gray-700">Follow these 3 simple steps</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/80 shadow-md rounded-lg p-6 flex flex-col items-center text-center backdrop-blur"
          >
            <div className="text-4xl mb-3">{step.icon}</div>
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorkAPP;
