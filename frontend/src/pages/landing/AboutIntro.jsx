import { FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import aboutVideo from '../../assets/about-bg.mp4'
import MissionSection from '../../components/landingPage/about/MissionSection';
import HowItWorksSection from '../../components/landingPage/about/HowItWorksSection';
import WhyChooseUsSection from "../../components/landingPage/about/WhyChooseUsSection"
const AboutIntro = () => {
  const scrollToSection = () => {
    const target = document.getElementById('mission');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
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
        <source src={aboutVideo} type="video/mp4" />
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
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide mb-4">About Us</h1>
        <p className="text-md md:text-lg text-white/80">Discover how TeleCare helps you.</p>

        <button onClick={scrollToSection} className="mt-10 animate-bounce">
          <FaChevronDown className="text-3xl hover:text-blue-300 transition duration-300" />
        </button>
      </motion.div>
    </section>

    
      <div id="mission">
        <MissionSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="why-choose-us">
        <WhyChooseUsSection />
      </div>
      </>
  );
};

export default AboutIntro;
