// src/pages/Login.jsx (adjust path if your file sits elsewhere)
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import sideimg from "../assets/sideimg.png";
import { useDispatch } from "react-redux";
import { login, googleLogin } from "../slices/authSlice";
import socket from "../lib/socket";

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    try {
      const user = await dispatch(login({ email, password })).unwrap();

      // (Optional) Socket connect — cookies will be sent automatically
      try { if (!socket.connected) socket.connect(); } catch {}

      if (redirect) return navigate(redirect, { replace: true });
      if (user.role === "admin")  return navigate("/admin/dashboard", { replace: true });
      if (user.role === "doctor") {
        if (user.isVerified) return navigate("/doctor/dashboard", { replace: true });
        alert("You are not approved by admin."); return;
      }
      return navigate("/dashboard", { replace: true });
    } catch (err) {
      if (String(err.message || "").includes("pending")) {
        return alert("Your account is pending admin approval.");
      }
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl overflow-hidden">
        <div className="bg-blue-50 flex flex-col items-center justify-center p-10">
          <img src={sideimg} alt="Doctor" className="w-64 mb-4" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500 pr-10"
              />
              <span
                onClick={togglePassword}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Stay signed in
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
            >
              Login
            </button>
          </form>

          {/* Google login */}
          <div className="w-full flex flex-col items-center my-4 gap-4">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const credential = credentialResponse?.credential;
                  const user = await dispatch(googleLogin({ credential })).unwrap();
                  try { if (!socket.connected) socket.connect(); } catch {}
                  if (redirect) return navigate(redirect, { replace: true });
                  if (user.role === "admin")  return navigate("/admin/dashboard", { replace: true });
                  if (user.role === "doctor") return navigate("/doctor/dashboard", { replace: true });
                  return navigate("/dashboard", { replace: true });
                } catch (err) {
                  alert(err.message || "Google login failed");
                }
              }}
              onError={() => alert("Google login failed")}
            />
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition">
              <FaFacebook className="text-blue-600" /> <span>Facebook</span>
            </button>
          </div>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;