import React, { useState } from "react";
import { Menu, LogOut, LayoutDashboard, Users, FileText, Map, Settings } from "lucide-react";
import { useStaffAuth } from "@/contexts/staff-AuthContext";

const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, profile } = useStaffAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-64 bg-slate-900/80 backdrop-blur-lg border-r border-slate-700 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Staff Portal</h1>
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          <a href="/staff/dashboard" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </a>
          <a href="/staff/reports" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg">
            <FileText className="w-4 h-4" /> Field Reports
          </a>
          <a href="/staff/locations" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg">
            <Map className="w-4 h-4" /> Geo Tracking
          </a>
          <a href="/staff/users" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg">
            <Users className="w-4 h-4" /> Citizens
          </a>
          <a href="/staff/settings" className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg">
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
        <header className="flex items-center justify-between bg-slate-900/50 backdrop-blur-md p-4 border-b border-slate-700">
          <button
            className="md:hidden text-slate-300"
            onClick={() => setOpen(!open)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">Welcome, {profile?.full_name || "Staff Member"}</h2>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default StaffLayout;

