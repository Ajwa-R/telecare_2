import React, { useEffect } from 'react';
import { FaUserPlus, FaSearch, FaCalendarAlt, FaVideo } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HowItWorksSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const steps = [
    {
      icon: <FaUserPlus className="text-blue-500 text-4xl mb-3" />,
      title: 'Signup or Login',
    },
    {
      icon: <FaSearch className="text-green-500 text-4xl mb-3" />,
      title: 'Search for Specialist',
    },
    {
      icon: <FaCalendarAlt className="text-purple-500 text-4xl mb-3" />,
      title: 'Book an Appointment',
    },
    {
      icon: <FaVideo className="text-pink-500 text-4xl mb-3" />,
      title: 'Consult via Live Video Call',
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-16 px-4" id="how-it-works">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              data-aos="fade-up"
              className="flex flex-col items-center text-gray-700 transition transform hover:-translate-y-2 hover:shadow-xl p-4 bg-white rounded-lg"
            >
              {step.icon}
              <p className="text-lg font-medium text-center">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
