import React from "react";
import "./MentalIntro.css";
import { motion } from "framer-motion";
import MentalDisorders from "./MentalDisorders";
import MentalHelpSection from "./MentalHelpSection";

const MentalIntro = () => {
  return (
    <>
      <section className="w-full mt-30 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-blue-100 py-12 text-center rounded-md shadow-sm max-w-5xl mx-auto"
        >
          <p className="text-sm font-semibold text-gray-700 mb-2">
            259+ Doctors Available
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Mental Health Support
          </h1>
        </motion.div>
      </section>

      <MentalDisorders />
      <MentalHelpSection />
    </>
  );
};

export default MentalIntro;
