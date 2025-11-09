import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <footer className="bg-gray-100 text-gray-700 py-4 mt-8 border-t">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 space-y-2 sm:space-y-0">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Tanzania Digital Gateway
      </p>
      <div className="flex space-x-4 text-sm">
        <Link to="/about" className="hover:text-green-700">
          About Us
        </Link>
        <Link to="/contact" className="hover:text-green-700">
          Contact Us
        </Link>
        <Link to="/info" className="hover:text-green-700">
          Info Center
        </Link>
        <Link to="/faq" className="hover:text-green-700">
          FAQ
        </Link>
        {/* ✅ New Admin Nav */}
        <Link to="/admin-login" className="hover:text-green-700 font-medium">
          Admin
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
