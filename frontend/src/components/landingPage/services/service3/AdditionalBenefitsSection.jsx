import React, { useEffect } from 'react';
import { FaMobileAlt, FaComments, FaShieldAlt, FaVideo } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate, Link } from 'react-router-dom';

const benefits = [
  {
    icon: <FaMobileAlt className="text-4xl text-blue-500" />,
    title: 'Mobile App',
    description: 'Access all healthcare features on-the-go with our mobile app. Book, consult, and manage your health anytime, anywhere.',
    route: 'mobile-app',
  },
  {
    icon: <FaComments className="text-4xl text-blue-500" />,
    title: 'Chat Support',
    description: 'Instantly get answers to your queries via our live chat team. Friendly support available for technical and service help 24/7.',
    route: 'chat-support',
  },
  {
    icon: <FaVideo className="text-4xl text-blue-500" />,
    title: 'Video Call Consultation',
    description: 'Connect face-to-face with doctors through secure video calls. Get real-time diagnosis, advice, and prescriptions — all remotely.',
    route: 'video-call',
  },
  {
    icon: <FaShieldAlt className="text-4xl text-blue-500" />,
    title: 'Secure Messaging',
    description: 'Communicate privately with doctors using encrypted messaging. Share reports and updates with full confidentiality and trust.',
    route: 'secure-messaging',
  },
];

const AdditionalBenefitsSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="w-full py-16 px-4 bg-white" id="benefits">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Additional Benefits</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              className="bg-blue-50 hover:bg-blue-100 transition p-6 w-64 h-80 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg hover:scale-105"
            >
              {benefit.icon}
              <Link
                to={`/benefits/${benefit.route}`}
                className="mt-4 text-gray-800 font-semibold text-lg hover:underline"
              >
                {benefit.title}
              </Link>
              <p className="mt-2 text-gray-600 text-sm">{benefit.description}</p>
              <button
                onClick={() => navigate(`/benefits/${benefit.route}`)}
                className="mt-auto text-sm text-blue-600 hover:underline cursor-pointer focus:outline-none"
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdditionalBenefitsSection;
