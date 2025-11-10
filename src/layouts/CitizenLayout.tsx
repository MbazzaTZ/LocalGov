import React, { useState } from "react";
import { Home, FileText, CreditCard, Settings, LogOut, Menu } from "lucide-react";
import Topbar from "@/components/Topbar";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";

const CitizenLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useCitizenAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-64 bg-blue-900/70 backdrop-blur-lg border-r border-blue-700 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-blue-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Citizen Portal</h1>
          <button className="md:hidden text-white/70" onClick={() => setOpen(false)}>✕</button>
        </div>

        <nav className="flex flex-col space-y-2 p-4">
          <a href="/citizen/dashboard" className="flex items-center gap-2 p-2 hover:bg-blue-800 rounded-lg">
            <Home className="w-4 h-4" /> Dashboard
          </a>
          <a href="/services" className="flex items-center gap-2 p-2 hover:bg-blue-800 rounded-lg">
            <FileText className="w-4 h-4" /> Services
          </a>
          <a href="/applications" className="flex items-center gap-2 p-2 hover:bg-blue-800 rounded-lg">
            <CreditCard className="w-4 h-4" /> Applications
          </a>
          <a href="/citizen/settings" className="flex items-center gap-2 p-2 hover:bg-blue-800 rounded-lg">
            <Settings className="w-4 h-4" /> Settings
          </a>

          <button
            onClick={signOut}
            className="mt-4 flex items-center gap-2 text-red-400 hover:text-red-500"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar title="Citizen Dashboard" theme="blue" onMenuClick={() => setOpen(!open)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default CitizenLayout;
