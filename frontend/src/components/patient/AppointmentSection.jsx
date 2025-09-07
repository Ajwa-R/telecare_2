import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaThermometerHalf,
  FaUserMd,
  FaTimes,
} from "react-icons/fa";
import { allConditions } from "../../data/conditionsData";
import { conditionIconMap } from "../../data/conditionIconMapper";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import api from "../../services/api";

const AppointmentSection = ({ onBook }) => {
 ;
  const user = useSelector((state) => state.auth.user);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allDoctors, setAllDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.get("/doctors");
        setAllDoctors(Array.isArray(list) ? list : []);
        setDoctors(Array.isArray(list) ? list : []);
      } catch {
        setAllDoctors([]);
        setDoctors([]);
      }
    })();
  }, []);

  const handleBook = () => {
    if (!selectedDate || !selectedCondition || !selectedDoctor) {
      alert("Please fill all fields");
      return;
    }

    const appointment = {
      patientId: user?._id,
      doctorId: selectedDoctor._id,
      condition: selectedCondition,
      date: selectedDate,
      time: new Date(selectedDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    onBook(appointment);
  };

  return (
    <>
      <div className="bg-white shadow-md p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div
            onClick={() => setModalType("date")}
            className="cursor-pointer bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-2">
              <FaCalendarAlt className="text-2xl text-gray-700" />
            </div>
            <h3 className="font-semibold text-lg">Date</h3>
            <p className="text-gray-500 text-sm">
              {selectedDate
                ? new Date(selectedDate).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Select Date"}
            </p>
          </div>

          <div
            onClick={() => setModalType("condition")}
            className="cursor-pointer bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-300 mb-2">
              <FaThermometerHalf className="text-2xl text-red-500" />
            </div>
            <h3 className="font-semibold text-lg">Select condition</h3>
            <p className="text-gray-500 text-sm">
              {selectedCondition || "Select condition"}
            </p>
          </div>

          <div
            onClick={() => setModalType("doctor")}
            className="cursor-pointer bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col items-center"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-200 mb-2">
              <FaUserMd className="text-2xl text-blue-700" />
            </div>
            <h3 className="font-semibold text-lg">Select doctor</h3>
            <p className="text-gray-500 text-sm">
              {selectedDoctor?.name || "Select doctor"}
            </p>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={handleBook}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
          >
            Book Appointment
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg relative"
            >
              <button
                onClick={() => setModalType(null)}
                className="absolute top-3 right-3 text-xl text-gray-600 hover:text-red-500"
              >
                <FaTimes />
              </button>

              {modalType === "date" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-center mb-2">
                    Pick a Date & Time
                  </h3>
                  <input
                    type="datetime-local"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setModalType(null);
                    }}
                    className="p-3 border rounded-lg"
                  />
                </div>
              )}

              {modalType === "condition" && (
                <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto mt-4">
                  {allConditions.map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setSelectedCondition(item.name);
                        setModalType(null);
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-4 bg-white rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition"
                    >
                      {conditionIconMap[item.name]}
                      <span className="mt-2 font-semibold text-gray-700 text-sm">
                        {item.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {modalType === "doctor" && (
                <div className="max-h-[70vh] overflow-y-auto p-2">
                  <input
                    type="text"
                    placeholder="Search doctor"
                    className="w-full border px-3 py-2 rounded mb-4"
                    onChange={(e) => {
                      const query = e.target.value.toLowerCase();
                      const filtered = allDoctors.filter((doc) =>
                        (doc?.name || "").toLowerCase().includes(query)
                      );
                      setDoctors(filtered); // doctorset
                    }}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map((doc, index) => (
                      <motion.div
                        key={index}
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setModalType(null);
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center p-4 bg-emerald-50 rounded-lg shadow cursor-pointer hover:shadow-lg"
                      >
                         <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            doc?.name || "Doctor"
                          )}`}
                          alt={doc?.name || "Doctor"}
                          className="w-14 h-14 rounded-full object-cover mr-3"
                        />

                        <div>
                          <p className="font-semibold text-gray-800">
                            {doc.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {doc.specialization}
                          </p>
                          <p className="text-sm text-green-600">
                            🟢 Online &nbsp; {doc.experience} yrs exp
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppointmentSection;
