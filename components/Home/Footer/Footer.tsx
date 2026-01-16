"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-400 text-white px-10 py-10 md:py-12 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start">
        {/* Logo */}
        <div className="flex items-center mb-6 md:mb-0">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/image/Adobe Express - file.png"
              alt="Logo"
              className="h-12 w-auto"
            />
          </a>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="uppercase text-sm font-medium">Follow us</span>
          <div className="flex gap-3 mt-2">
            <a
              href="#"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:opacity-90 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-black hover:opacity-90 transition"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="mt-8 border-t border-white/30 pt-4 text-center text-sm md:text-base">
        <a href="#" className="hover:underline mx-2">
          Privacy
        </a>
        <span>|</span>
        <a href="#" className="hover:underline mx-2">
          Term & Condition
        </a>
      </div>
    </footer>
  );
};

export default Footer;
