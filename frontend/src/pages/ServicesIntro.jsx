import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import serviceVideo from "../assets/service1.mp4";
import ServiceCardsSection from "../components/sections/services/service1/ServiceCardsSection";
import AdvancedFeaturesSection from "../components/sections/services/service2/AdvancedFeaturesSection";
import AdditionalBenefitsSection from "../components/sections/services/service3/AdditionalBenefitsSection";
const ServicesIntro = () => {
  const scrollToSection = () => {
    const target = document.getElementById("our-services");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* ✅ Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover z-0"
        >
          <source src={serviceVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🖤 Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* ✨ Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-wide mb-4">
            Our Services
          </h1>
          <p className="text-md md:text-lg text-white/80">
            Explore what TeleCare offers for your health.
          </p>

          <button onClick={scrollToSection} className="mt-10 animate-bounce">
            <FaChevronDown className="text-3xl hover:text-blue-300 transition duration-300" />
          </button>
        </motion.div>
      </section>
      <div id="our-services">
        <ServiceCardsSection />
        <AdvancedFeaturesSection />
        <AdditionalBenefitsSection />
      </div>
    </>
  );
};

export default ServicesIntro;
