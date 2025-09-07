import React, { useState } from 'react';
import {
  FaUserMd, FaTooth, FaHeartbeat, FaBrain, FaVenus, FaVial,
  FaLungs, FaStethoscope, FaChild, FaEye, FaAccessibleIcon, FaTimes,
  FaMicroscope, FaXRay, FaAppleAlt, FaSyringe, FaProcedures,
  FaWeight, FaHandHoldingMedical, FaCapsules
} from 'react-icons/fa';
import {
  GiStomach, GiKidneys, GiInternalInjury, GiBoneKnife
} from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';

const allCategories = [
  { icon: <FaHeartbeat />, name: "Cardiologist" },
  { icon: <FaUserMd />, name: "Dermatologist" },
  { icon: <FaBrain />, name: "Neurologist" },
  { icon: <FaChild />, name: "Pediatrician" },
  { icon: <FaVenus />, name: "Gynecologist" },
  { icon: <FaAccessibleIcon />, name: "Orthopedic Surgeon" },
  { icon: <FaStethoscope />, name: "General Physician" },
  { icon: <FaTooth />, name: "Dentist" },
  { icon: <FaEye />, name: "Ophthalmologist" },
  { icon: <FaLungs />, name: "Pulmonologist" },
  { icon: <FaVial />, name: "Urologist" },
  { icon: <GiKidneys />, name: "Nephrologist" },
  { icon: <GiStomach />, name: "Gastroenterologist" },
  { icon: <FaSyringe />, name: "Endocrinologist" },
  { icon: <GiInternalInjury />, name: "Rheumatologist" },
  { icon: <FaMicroscope />, name: "Oncologist" },
  { icon: <FaXRay />, name: "Radiologist" },
  { icon: <FaAppleAlt />, name: "Nutritionist" },
  { icon: <FaWeight />, name: "Dietitian" },
  { icon: <FaCapsules />, name: "Pharmacologist" },
  { icon: <FaProcedures />, name: "Surgeon" },
  { icon: <FaHandHoldingMedical />, name: "Anesthesiologist" },
  { icon: <FaBrain />, name: "Psychiatrist" },
  { icon: <GiBoneKnife />, name: "ENT Specialist" },
  { icon: <FaUserMd />, name: "Sexologist" },
];

const DoctorCategorySection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCategories = allCategories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-blue-50 py-12 px-4 sm:px-6 lg:px-12 relative">
      {/* Heading & View All */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 className="text-2xl md:text-3xl font-bold w-full text-center text-gray-800">
          Find the Right Doctor for Your Need
        </h2>
        <div className="w-full flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="text-emerald-600 font-medium hover:underline text-sm flex items-center gap-1"
          >
            👁 View All
          </button>
        </div>
      </div>

      {/* Grid Preview (first 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
        {allCategories.slice(0, 6).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white shadow-md rounded-xl px-6 py-8 w-full max-w-xs flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <div className="text-4xl text-emerald-600 mb-2">
              {item.icon}
            </div>
            <h3 className="text-md font-semibold text-gray-700">{item.name}</h3>
          </motion.div>
        ))}
      </div>

      {/* 🔥 FullScreen Modal */}
      <AnimatePresence>
  {modalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4"
    >
      {/* Modal Box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -50 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-lg overflow-y-auto relative p-6"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-red-500"
          onClick={() => setModalOpen(false)}
        >
          <FaTimes />
        </button>

        {/* Search Input */}
        <div className="mb-6 mt-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search for a doctor category..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center"
        >
          {filteredCategories.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white shadow-md rounded-xl px-6 py-8 w-full max-w-xs flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="text-4xl text-emerald-600 mb-2">{item.icon}</div>
              <h3 className="text-md font-semibold text-gray-700">{item.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </section>
  );
};

export default DoctorCategorySection;
