import React, { useState } from "react";
import m3 from "../../../../../assets/m3.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, UserRoundCheck } from "lucide-react";

const MentalHelpSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      icon: <Lock className="w-5 h-5 text-blue-600" />,
      title: "Is it confidential?",
      content: "Your privacy and confidentiality are our top priorities.",
    },
    {
      icon: <UserRoundCheck className="w-5 h-5 text-blue-600" />,
      title: "Who are the therapists?",
      content: "Our team is composed of licensed, experienced professionals.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* === LEFT COLUMN: TEXT + FAQ === */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-gray-800 text-lg leading-relaxed"
        >
          {/* --- PARAGRAPHS --- */}
          <p className="mb-4">
            <span className="text-black font-medium">Your mental well-being matters.</span><br />
            <span className="font-semibold text-blue-600">TeleCare</span> connects you with licensed psychologists and therapists who can support you through <span className="font-semibold">stress</span>, <span className="font-semibold">anxiety</span>, <span className="font-semibold">depression</span>, and <span className="font-semibold">emotional burnout</span>.
          </p>
          <p className="mb-8">
            Speak openly in secure one-on-one sessions — anytime, anywhere. Whether it’s <span className="font-semibold text-blue-500">academic pressure</span> or <span className="font-semibold text-blue-500">personal challenges</span>, expert help is just a click away.
          </p>

          {/* --- FAQ SECTION --- */}
          <div className="grid sm:grid-cols-1 gap-6">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="cursor-pointer bg-cyan-50 hover:bg-cyan-100 transition rounded-xl p-6 shadow"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    {faq.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800">{faq.title}</h3>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.p
                      className="text-gray-600 mt-3 pl-10 pr-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.content}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* === RIGHT COLUMN: IMAGE === */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={m3}
            alt="TeleCare Mental Support"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MentalHelpSection;
