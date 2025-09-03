import React from 'react';
import bgImage from '../../../../../assets/background.png';
import { motion } from 'framer-motion';

const MentalDisorders = () => {
  const disorders = [
    "Anxiety Disorders",
    "Depressive Disorders",
    "Obsessive-Compulsive Disorder (OCD)",
    "Post-Traumatic Stress Disorder (PTSD)",
    "Bipolar Disorder",
    "Schizophrenia",
    "Personality Disorders",
    "Eating Disorders",
    "Substance Use Disorders",
    "Neurodevelopmental Disorders",
    "Emotional Struggles (Non-disorder based)",
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 md:px-10 mt-2">
      <div
        className="rounded-[10px] overflow-hidden bg-cover bg-center flex items-center justify-center min-h-[590px]"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="relative z-10 max-w-xl w-full text-center p-6 md:p-10 bg-white/60 rounded-xl shadow-xl backdrop-blur-sm">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Mental Health Disorders
          </motion.h2>

          <ul className="space-y-2 text-gray-800 text-sm sm:text-base">
            {disorders.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                • {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MentalDisorders;
