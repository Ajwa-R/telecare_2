import React, { useEffect } from 'react';
import about1 from '../../../assets/about1.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MissionSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="w-full px-4 py-16 bg-white">
      <diuv className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left: Text */}
        <div
          className="md:w-1/2 text-center md:text-left"
          data-aos="fade-right"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At <span className="font-semibold">TeleCare</span>, our mission is to make quality healthcare accessible and affordable for everyone.
            Whether you're in a big city or a remote village, you can now consult verified doctors online—from the comfort of your home.
          </p>
        </div>

        {/* Right: Image */}
        <div
          className="md:w-1/2 flex justify-center"
          data-aos="fade-left"
        >
          <img
            src={about1}
            alt="TeleCare Mission"
            className="w-full max-w-md object-contain transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          />
        </div>
      </diuv>
    </section>
  );
};

export default MissionSection;
