import React, { useEffect } from 'react';
import about2 from '../../../assets/about2.png'; 
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaCheckCircle } from 'react-icons/fa';

const WhyChooseUsSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const features = [
    'Certified & Experienced Doctors',
    '24/7 Consultation',
    'Private & Secure Conversations',
    'Affordable Rates',
    'Easy Appointment Booking',
    'Multilingual Support',
  ];

  return (
    <section className="w-full bg-white py-16 px-4" id="why-choose-us">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-30">
        {/* ✅ Left: Image */}
        <div className="md:w-1/2" data-aos="fade-right">
          <img
            src={about2}
            alt="Why Choose TeleCare"
            className="w-full max-w-md mx-auto object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* ✅ Right: Feature List */}
        <div className="md:w-1/2" data-aos="fade-left">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us</h2>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700 text-lg">
                <FaCheckCircle className="text-blue-500 mt-1" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
