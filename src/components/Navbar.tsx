import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabaseClient";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // hide until logged in

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="bg-gray-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Tanzania Digital Gateway</h1>
        <ul className="flex space-x-6 items-center">
          <li><Link to="/home" className="hover:text-green-400">Home</Link></li>
          <li><Link to="/services" className="hover:text-green-400">Services</Link></li>
          <li><Link to="/applications" className="hover:text-green-400">My Applications</Link></li>
          <li><Link to="/profile" className="hover:text-green-400">Profile</Link></li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
