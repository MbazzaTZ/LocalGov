import React, { useState } from "react";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
  Database,
  Activity,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/admin-AuthContext";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, profile } = useAdminAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-64 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          <a href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </a>
          <a href="/admin/users" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg">
            <Users className="w-4 h-4" /> Manage Users
          </a>
          <a href="/admin/logs" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg">
            <Activity className="w-4 h-4" /> Activity Logs
          </a>
          <a href="/admin/database" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg">
            <Database className="w-4 h-4" /> Data Management
          </a>
          <a href="/admin/settings" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg">
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
        <header className="flex items-center justify-between bg-gray-900/50 backdrop-blur-md p-4 border-b border-gray-700">
          <button
            className="md:hidden text-gray-300"
            onClick={() => setOpen(!open)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold">
            Admin: {profile?.full_name || "Administrator"}
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

