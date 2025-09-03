import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaUserMd, FaBrain, FaComments, FaCalendarAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
// import Service1Page from './Service1Page.jsx';

const services = [
  {
    icon: <FaUserMd className="text-4xl text-blue-500 mb-4" />,
    title: "Talk to a Doctor",
    description:
      "Instantly consult certified doctors anytime, from anywhere. Discuss symptoms and get expert medical advice on the spot.",
    route: "talk-to-doctor",
  },
  {
    icon: <FaBrain className="text-4xl text-blue-500 mb-4" />,
    title: "Mental Health Support",
    description:
      "Get expert guidance from licensed psychologists and therapists. Talk freely and privately about stress, anxiety, or depression.",
    route: "mental-health",
  },
  {
    icon: <FaComments className="text-4xl text-blue-500 mb-4" />,
    title: "24/7 Emergency Chat",
    description:
      "Access urgent medical help anytime through real-time chat. Connect with a responder in seconds — no waiting needed.",
    route: "emergency-chat",
  },
  {
    icon: <FaCalendarAlt className="text-4xl text-blue-500 mb-4" />,
    title: "Appointment System",
    description:
      "Book, manage, or reschedule appointments with ease. Choose your preferred doctor and get instant confirmation.",
    route: "appointment-system",
  },
];

const ServiceCardsSection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <>
      <section className="py-20 bg-white" id="services">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Our Core Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {services.map((service, index) => (
              
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-blue-50 hover:bg-blue-100 transition-all duration-300 shadow-md rounded-xl px-6 py-8 flex flex-col justify-between items-center text-center"
                style={{
                  minHeight: "360px",
                  maxWidth: "260px",
                  margin: "0 auto",
                }}
              >
                {service.icon}

                {/* 👇 Title as Link now 👇 */}
                <Link
                  to={`/services/${service.route}`}
                  className="text-lg font-semibold text-blue-700 hover:underline"
                >
                  {service.title}
                </Link>

                <p className="text-sm text-gray-700 mt-2">
                  {service.description}
                </p>

                <button
                  onClick={() => navigate(`/services/${service.route}`)}
                  className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-md transition"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <Service1Page/> */}
    </>
  );
};

export default ServiceCardsSection;
