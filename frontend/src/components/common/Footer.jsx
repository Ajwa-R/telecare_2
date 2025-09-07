// src/components/common/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import logo from "../../assets/logo.png";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-white border-t">
      {/* Top */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="TeleCare" className="h-9 w-auto" />
            <span className="text-xl font-semibold">TeleCare</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Smart healthcare: book appointments, chat securely, and join video
            consults — all in one place.
          </p>
          <div className="mt-4 flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="size-4" />
            <span className="text-sm">
              HIPAA-style privacy mindset • Secure by design
            </span>
          </div>
        </div>

        {/* Company */}
        <div>
          <div className="text-base font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link to="/" className="hover:text-emerald-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-emerald-700">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-emerald-700">
                Services
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-emerald-700">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-emerald-700">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Patient */}
        <div>
          <div className="text-base font-semibold mb-3">For Patients</div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link to="/patient/dashboard" className="hover:text-emerald-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/patient/dashboard?tab=appointments"
                className="hover:text-emerald-700"
              >
                Book Appointment
              </Link>
            </li>
            <li>
              <Link
                to="/patient/dashboard?tab=video"
                className="hover:text-emerald-700"
              >
                Video Call
              </Link>
            </li>
            <li>
              <Link
                to="/patient/dashboard?tab=history"
                className="hover:text-emerald-700"
              >
                Medical History
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-base font-semibold mb-3">Contact</div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              <a
                href="mailto:support@telecare.local"
                className="hover:text-emerald-700"
              >
                support@telecare.local
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" />
              <a href="tel:+920000000000" className="hover:text-emerald-700">
                +92 00 000 0000
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="size-4 mt-1" />
              <span>Lahore, Pakistan</span>
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="hover:opacity-80">
              <Facebook className="size-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:opacity-80">
              <Twitter className="size-5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-80">
              <Instagram className="size-5" />
            </a>
            <a href="#" aria-label="Github" className="hover:opacity-80">
              <Github className="size-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-sm text-gray-600 flex flex-col gap-3 sm:flex-row items-center justify-between">
          <p>© {year} TeleCare. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <HeartPulse className="size-4 text-emerald-700" />
            <span>Care that connects you.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
