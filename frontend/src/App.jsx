import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import Home from  "./pages/landing/Home"
import AboutIntro from "./pages/landing/AboutIntro"
import ServicesIntro from "./pages/landing/ServicesIntro";
import Register from './pages/Register';
import Login from "./pages/Login";
import MentalIntro from "./components/landingPage/services/service1/mental/MentalIntro"
import HeroSection from "./components/landingPage/services/service1/chat/HeroSection";
import HeroSectionAPP from "./components/landingPage/services/service1/appointment/HeroSectionAPP";
import VideoConsultationSection from "./components/landingPage/services/service3/videocall/VideoConsultationSection";
import MobileAppSection from "./components/landingPage/services/service3/MobileApp/MobileAppSection";
import SecureMessagingSection from "./components/landingPage/services/service3/secure/SecureMessagingSection";
import ChatSupportSection from "./components/landingPage/services/service3/chatSupport/ChatSupportSection";

import { useSelector, useDispatch } from "react-redux"; //  dispatch add
import { useEffect } from "react";                      //  useEffect add
import { fetchMe } from "@/slices/authSlice";           //  thunk import

import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PrivateRoute from "./components/common/PrivateRoute";
import DoctorList from "./pages/DoctorList";
import AdminDashboard from './pages/admin/AdminDashboard';
import CallPage from "./pages/CallPage";
function App() {

   const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMe());   
  }, [dispatch]);
  // const user = useSelector((state) => state.auth.user);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutIntro />} />
        <Route path="/services" element={<ServicesIntro />} />
        <Route path="/services/mental-health" element={<MentalIntro />} />
        <Route path="/services/emergency-chat" element={<HeroSection />} />
        <Route path="/services/appointment-system" element={<HeroSectionAPP />}/>
        <Route path="/benefits/video-call" element={<VideoConsultationSection />}/>
        <Route path="/benefits/mobile-app" element={<MobileAppSection />} />
        <Route path="/benefits/secure-messaging" element={<SecureMessagingSection />}/>
        <Route path="/benefits/chat-support" element={<ChatSupportSection />} />
      </Route>
        <Route path="/doctors" element={<DoctorList />} />
      {/* patient */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <PatientDashboard />
          </PrivateRoute>
        }
      />
      {/* doctor dashboard */}

      <Route
        path="/doctor/dashboard"
        element={
          <PrivateRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </PrivateRoute>
        }
      />
      <Route
  path="/admin/dashboard"
  element={
    <PrivateRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </PrivateRoute>
  }
/>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/call/:appointmentId" element={<CallRoom />} /> */}
      <Route path="/call/:appointmentId" element={<CallPage />} />
    </Routes>
  );
}

export default App;
