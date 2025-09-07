import { useEffect, useState } from "react";
import Navbar from '../../components/common/Navbar';
import DoctorCategories from "../../components/landingPage/home/DoctorCategories";
import ConditionCategorySection from "../../components/landingPage/home/ConditionCategorySection";
import TestimonialsSection from "../../components/landingPage/home/TestimonialsSection";
import { motion } from "framer-motion";
import phoneGroup from "../../assets/phone-group.png";
const Home = () => {
  const [text, setText] = useState("");
  const fullText = "TeleCare — Healing Powered by Technology";
  const subText = "We connect patients and doctors for smarter, faster care";

  // Typing animation
  useEffect(() => {
    let current = 0;
    const typeInterval = setInterval(() => {
      setText(fullText.slice(0, current + 1));
      current++;
      if (current === fullText.length) clearInterval(typeInterval);
    }, 60);
    return () => clearInterval(typeInterval);
  }, []);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 text-white pt-[90px]">
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-2 items-center px-10 pt-16">
        {/* Left Text */}
        <div className="text-left space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-bold"
          >
            {text}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-lg text-white/90"
          >
            {subText}
          </motion.p>
        </div>

        {/* Right: Phone mockup group */}
        <div className="w-full overflow-hidden flex justify-end items-start">
          <motion.img
            src={phoneGroup}
            alt="TeleCare App Preview"
            className="max-h-[450px] w-auto object-contain drop-shadow-2xl"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
    <DoctorCategories/>
    <ConditionCategorySection/>
    <TestimonialsSection/>
    </>
  );
};

export default Home;

