import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { conditionIconMap } from "../../../data/conditionIconMapper";
import { allConditions } from "../../../data/conditionsData";


const conditions = allConditions.map(c => c.name);


const ConditionCategorySection = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleConditions = showAll ? allConditions : allConditions.slice(0, 6);

  return (
    <section
      className="relative py-12 px-4 sm:px-6 lg:px-12 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #99dbff, #7a91af)",
        position: "relative",
      }}
    >
      {/* Animated Dots */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.2), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.15), transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.1), transparent 60%)
          `,
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold w-full text-center text-gray-800">
          Search by Condition
        </h2>
        <div className="w-full flex justify-end">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="text-emerald-600 font-medium hover:underline text-sm flex items-center gap-1"
          >
            👁 {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center z-10 relative">
        {visibleConditions.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white shadow-md rounded-xl px-6 py-8 w-full max-w-xs flex flex-col items-center text-center hover:shadow-lg transition"
          >
            {item.icon}
            <h3 className="mt-4 text-md font-semibold text-gray-700">{item.name}</h3>
          </motion.div>
        ))}
      </div>

      {/* Popup Modal View All */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-lg overflow-y-auto relative p-6"
            >
              <button
                className="absolute top-3 right-3 text-xl text-gray-600 hover:text-red-500"
                onClick={() => setShowAll(false)}
              >
                <FaTimes />
              </button>
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Search by Condition</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                {allConditions.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03 }}
    className="bg-white shadow-md rounded-xl px-6 py-8 w-full max-w-xs flex flex-col items-center text-center hover:shadow-lg transition"
  >
    {conditionIconMap[item.name]}
    <h3 className="mt-4 text-md font-semibold text-gray-700">{item.name}</h3>
  </motion.div>
))}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ConditionCategorySection;
