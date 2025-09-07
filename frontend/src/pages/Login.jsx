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

















// import { useNavigate, useLocation, Link } from "react-router-dom"; //.............
// import { GoogleLogin } from "@react-oauth/google";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
// import sideimg from "../assets/sideimg.png";
// import api from "../services/api";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "../slices/authSlice";
// import socket from "../lib/socket";

// const Login = () => {
//   const dispatch = useDispatch();
//   // const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);

//   // const toggleForm = () => setIsLogin(!isLogin);
//   const togglePassword = () => setShowPassword(!showPassword);
//   //...
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const redirect = params.get("redirect"); // e.g. "/?postReview=1"
//   //...

//   const navigate = useNavigate(); //....
//   //hendlesubmit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {//axious // api function use
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       console.log(data);

//       if (!res.ok) {
//         if (res.status === 403)
//           return alert("Your account is pending admin approval.");
//         return alert(data?.message || "Login failed");
//       }

//       if (res.ok) {
//         const user = {
//           _id: data._id,
//           name: data.name,
//           email: data.email,
//           role: data.role,
//           isVerified: data.isVerified,
//         };

//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(user)); // optional

//         dispatch(
//           setCredentials({
//             user,
//             token: data.token,
//           })
//         );

//         //  tell socket about the token and reconnect so server sees auth
//         socket.auth = { token: data.token };
//         socket.disconnect().connect();
//         // 1) if login was triggered by a redirect, go there first
//         if (redirect) {
//           return navigate(redirect, { replace: true });
//         }
//         // 2) otherwise, normal role-based landing
//         if (user.role === "admin")
//           return navigate("/admin/dashboard", { replace: true });
//         if (user.role === "doctor") {
//           if (user.isVerified)
//             return navigate("/doctor/dashboard", { replace: true });
//           alert("Your are not approved by admin.");
//           return;
//         }
//         return navigate("/dashboard", { replace: true });
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center px-4 py-10">
//       <div className="bg-white rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl overflow-hidden">
//         {/*Left Side*/}
//         <div className="bg-blue-50 flex flex-col items-center justify-center p-10">
//           <img src={sideimg} alt="Doctor" className="w-64 mb-4" />
//           {/* <h2 className="text-xl font-bold text-blue-600">Your Health is Our Priority</h2> */}
//         </div>

//         {/* Right Side: Form */}
//         <motion.div
//           // key={isLogin ? "login" : "register"}
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="p-10"
//         >
//          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//     Login to Your Account
//  </h2>

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             {/* {!isLogin && (
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500"
//               />
//             )} */}
            
//             <input
//               name="email"
//               type="email"
//               placeholder="Email"
//               className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500"
//             />
//             <div className="relative">
//               <input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 className="border border-gray-300 px-4 py-2 w-full rounded focus:outline-blue-500 pr-10"
//               />
//               <span
//                 onClick={togglePassword}
//                 className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </span>
//             </div>
//             <div className="flex justify-between items-center text-sm text-gray-600">
//               <label className="flex items-center gap-2">
//                 <input type="checkbox" /> Stay signed in
//               </label>
//               <a href="#" className="text-blue-600 hover:underline">
//                 Forgot Password?
//               </a>
//             </div>

//             {/* <button
//               type="submit"
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
//             >
//               {isLogin ? "Login" : "Register"}
//             </button> */}
//             <button
//               type="submit"
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition"
//             >
//               Login
//             </button>
//           </form>

//           {/* Social login */}
//           <div className="w-full flex flex-col items-center my-4 gap-4">
//             <GoogleLogin
//               onSuccess={async (credentialResponse) => {
//                 try {
//                   // 👇 yahin se credential le lo — param ka naam same rehne do
//                   const credential = credentialResponse?.credential;
//                   if (!credential) {
//                     return alert("Google credential not found");
//                   }

//                   // backend ko bhejo
//                   const res = await api.post("/auth/google", { credential });

//                   // backend se { token, user } aana chahiye
//                   const { token, user } = res.data || {};
//                   if (!token || !user) {
//                     return alert("Invalid response from Google login");
//                   }

//                   // ✅ store in localStorage + Redux
//                   localStorage.setItem("token", token);
//                   localStorage.setItem("user", JSON.stringify(user));
//                   dispatch(setCredentials({ user, token }));

//                   // ✅ socket ko fresh token do
//                   socket.auth = { token };
//                   socket.disconnect().connect();

//                   // ✅ redirect param ko respect karo (e.g. /?postReview=1)
//                   if (redirect) return navigate(redirect, { replace: true });

//                   // ✅ role-based landings
//                   if (user.role === "admin") {
//                     return navigate("/admin/dashboard", { replace: true });
//                   }
//                   if (user.role === "doctor") {
//                     return navigate("/doctor/dashboard", { replace: true });
//                   }
//                   return navigate("/dashboard", { replace: true });
//                 } catch (err) {
//                   console.error("Google Login Error:", err);
//                   alert("Google login failed");
//                 }
//               }}
//               onError={() => {
//                 alert("Google login failed");
//               }}
//             />

//             <button className="flex items-center justify-center gap-2 px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition">
//               <FaFacebook className="text-blue-600" /> <span>Facebook</span>
//             </button>
//           </div>

//           {/* <p className="text-center mt-6 text-sm text-gray-600">
//             {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//             <button
//               onClick={toggleForm}
//               className="text-blue-600 font-semibold hover:underline"
//             >
//               {isLogin ? "Register" : "Login"}
//             </button>
//           </p> */}
//           <p className="text-center mt-6 text-sm text-gray-600">
//   Don&apos;t have an account?{" "}
//   <Link to="/register" className="text-blue-600 font-semibold hover:underline">
//     Register
//   </Link>
// </p>

//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Login;
