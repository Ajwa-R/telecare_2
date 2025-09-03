import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import sideimg from "../assets/sideimg.png";
import api from "../services/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    gender: "",
    age: "",
    image: "",
    specialization: "",
    experience: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    const {
      name,
      email,
      password,
      gender,
      age,
      specialization,
      role,
      image,
      experience,
    } = form;
    setAttemptedSubmit(true);

    // Frontend validation before sending request
    if (
      !name ||
      !email ||
      !password ||
      !gender ||
      !age ||
      (role === "doctor" &&
        (!specialization || !form.image || !form.experience))
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("age", age);
    formData.append("role", role);
    if (role === "doctor") {
      formData.append("specialization", specialization);
      formData.append("experience", experience);
      formData.append("image", image); // important!
    }
    try {
      const res = await api.post("auth/register", formData, );
      alert("Registered: " + res.data.user.name);
      window.location.replace("/login?justRegistered=1");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl overflow-hidden">
        {/* Left side image */}
        <div className="bg-blue-50 flex flex-col items-center justify-center p-10">
          <img src={sideimg} alt="Doctor" className="w-64 mb-4" />
          <h2 className="text-xl font-bold text-blue-600">
            Join TeleCare Today
          </h2>
        </div>

        {/* Register form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10 space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Create an Account
          </h2>

          <input
            name="name"
            onChange={handleChange}
            placeholder="Full Name"
            className={`border px-4 py-2 w-full rounded focus:outline-blue-500 ${
              !form.name && attemptedSubmit
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            className={`border px-4 py-2 w-full rounded focus:outline-blue-500 ${
              !form.name && attemptedSubmit
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className={`border px-4 py-2 w-full rounded focus:outline-blue-500 ${
                !form.name && attemptedSubmit
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            <span
              onClick={togglePassword}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <select
            name="role"
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <select
            name="gender"
            onChange={handleChange}
            className={`border px-4 py-2 w-full rounded focus:outline-blue-500 ${
              !form.name && attemptedSubmit
                ? "border-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Age */}
          <input
            type="number"
            name="age"
            onChange={handleChange}
            placeholder="Age"
            className={`border px-4 py-2 w-full rounded focus:outline-blue-500 ${
              !form.name && attemptedSubmit
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {/* Specialization - only for doctor */}
          {form.role === "doctor" && (
            <input
              type="text"
              name="specialization"
              onChange={handleChange}
              placeholder="Specialization (e.g., Dermatologist)"
              className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500"
            />
          )}
          {form.role === "doctor" && (
            <>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                placeholder="upload your image"
                className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500"
              />

              <input
                type="number"
                name="experience"
                onChange={handleChange}
                placeholder="Experience (in years)"
                className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold transition"
          >
            Register
          </button>

          {/* Social login buttons */}
          {/* <div className="flex items-center my-4 gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 border px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition">
              <FaGoogle /> <span>Register with Google</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition">
              <FaFacebook className="text-blue-600" /> <span>Facebook</span>
            </button>
          </div> */}
        </motion.form>
      </div>
    </div>
  );
};

export default Register;
