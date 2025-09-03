import React, { useEffect } from 'react';
import { FaFolderOpen, FaClinicMedical, FaUtensils, FaUsers } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const features = [
  {
    icon: <FaFolderOpen className="text-4xl text-blue-500 mb-4" />,
    title: 'Medical History',
    description: 'View and manage all your past medical records in one place. Keep prescriptions, reports, and diagnosis securely organized.'
  },
  {
    icon: <FaClinicMedical className="text-4xl text-blue-500 mb-4" />,
    title: 'Nearby Clinics',
    description: 'Quickly find verified clinics and hospitals near your location. Check ratings, timings, and book instant appointments.'
  },
  {
    icon: <FaUtensils className="text-4xl text-blue-500 mb-4" />,
    title: 'Nutrition & Diet Plan',
    description: 'Get personalized diet plans tailored by expert nutritionists. Track your eating habits and stay on a healthy path.'
  },
  {
    icon: <FaUsers className="text-4xl text-blue-500 mb-4" />,
    title: 'Family Subscription',
    description: 'Manage healthcare access for your entire family under one plan. Book consults, track records, and share benefits seamlessly.'
  },
];

const AdvancedFeaturesSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="w-full py-20 px-4 bg-blue-50" id="advanced-features">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Advanced & Optional Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between items-center text-center transition hover:shadow-xl hover:scale-105"
              style={{ minHeight: '360px', maxWidth: '260px', margin: '0 auto' }}
            >
              {feature.icon}
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{feature.description}</p>
              <button className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-md transition">
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeaturesSection;
