import React from 'react';

const AppointmentNotice = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 mt-10">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <p className="text-sm text-gray-700 text-center md:text-left">
          <span className="font-semibold text-indigo-800">Note:</span> Appointment confirmation depends on doctor availability. In case of emergency, please use 24/7 Chat or Emergency Services.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition duration-200 text-sm">
          Book Appointment Now
        </button>
      </div>
    </section>
  );
};

export default AppointmentNotice;
