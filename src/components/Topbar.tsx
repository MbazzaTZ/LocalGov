import React, { useState } from "react";
import {
  Bell,
  UserCircle,
  LogOut,
  Settings,
  Menu,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { useStaffAuth } from "@/contexts/staff-AuthContext";
import { useAdminAuth } from "@/contexts/admin-AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  title?: string;
  onMenuClick?: () => void;
  theme?: "blue" | "gray" | "slate";
}

/* -------------------------------------------------------------------------- */
/* 🌍 Shared Topbar Component                                                  */
/* -------------------------------------------------------------------------- */

const Topbar: React.FC<TopbarProps> = ({ title = "Dashboard", onMenuClick, theme = "blue" }) => {
  const { user: citizenUser, signOut: citizenSignOut, role: citizenRole } = useCitizenAuth();
  const { user: staffUser, signOut: staffSignOut, role: staffRole } = useStaffAuth();
  const { user: adminUser, signOut: adminSignOut, role: adminRole } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine active user
  const activeUser =
    adminUser || staffUser || citizenUser;
  const activeRole =
    adminRole || staffRole || citizenRole || "Guest";
  const handleSignOut =
    adminUser
      ? adminSignOut
      : staffUser
      ? staffSignOut
      : citizenSignOut;

  const bgColor =
    theme === "gray"
      ? "bg-gray-900/70 border-gray-700"
      : theme === "slate"
      ? "bg-slate-900/70 border-slate-700"
      : "bg-blue-900/70 border-blue-700";

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 md:px-6 py-3 border-b backdrop-blur-lg sticky top-0 z-50 shadow-md",
        bgColor
      )}
    >
      {/* Left Section — Menu Button and Title */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-white/80 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-yellow-300" />
          <h1 className="text-lg md:text-xl font-semibold text-white">{title}</h1>
        </div>
      </div>

      {/* Right Section — Notifications and Profile */}
      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => alert("Notifications Coming Soon!")}
          className="relative text-white/80 hover:text-yellow-300"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 text-white hover:text-yellow-300"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <UserCircle className="w-6 h-6" />
            <span className="hidden md:inline capitalize">{activeRole}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg overflow-hidden text-white z-50">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-sm text-gray-200 font-semibold">{activeUser?.email}</p>
                <p className="text-xs text-gray-400 capitalize">{activeRole}</p>
              </div>

              <div className="flex flex-col">
                <button
                  onClick={() => (window.location.href = "/profile")}
                  className="flex items-center gap-2 px-4 py-2 text-left hover:bg-white/10"
                >
                  <ShieldCheck className="w-4 h-4 text-yellow-400" /> Profile
                </button>
                <button
                  onClick={() => (window.location.href = "/settings")}
                  className="flex items-center gap-2 px-4 py-2 text-left hover:bg-white/10"
                >
                  <Settings className="w-4 h-4 text-blue-400" /> Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
