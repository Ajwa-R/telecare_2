import React from 'react';
import { motion } from 'framer-motion';
import videoGif from '../../../../../assets/video-ui-demo.gif'; 
const benefitList = [
  "One-on-one secure consultation",
  "Real-time interaction with your doctor",
  "Works on mobile and desktop",
  "HIPAA-compliant encrypted connection",
];

const VideoBenefitsSection = () => {
  return (
    <section className="w-full py-1 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* === Left: Bullet List with Animations === */}
        <div>
          <h3 className="text-2xl font-bold text-indigo-800 mb-6">
            🟦 Benefits
          </h3>

          <ul className="space-y-4 text-gray-800 text-md sm:text-lg">
            {benefitList.map((item, idx) => (
              <motion.li
                key={idx}
                className="flex items-start gap-2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * idx }}
              >
                <span className="text-blue-600 text-xl">✔</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* === Right: Animated GIF/Image === */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <img
            src={videoGif}
            alt="Video UI Preview"
            className="w-full max-w-md rounded-md "
          />
        </motion.div>
      </div>
    </section>
  );
};

export default VideoBenefitsSection;
