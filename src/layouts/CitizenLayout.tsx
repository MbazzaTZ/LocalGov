import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  User,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { toast } from "sonner";

/**
 * 🌍 CitizenLayout
 * Shared layout for all citizen pages — includes sidebar + topbar.
 */
const CitizenLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { profile, signOut } = useCitizenAuth();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Services",
      icon: FileText,
      path: "/services",
    },
    {
      name: "My Applications",
      icon: Settings,
      path: "/applications",
    },
    {
      name: "Payments",
      icon: Wallet,
      path: "/payments",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const handleLogout = async () => {
    await signOut();
    toast.info("You’ve been logged out.");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
      {/* 🧭 Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 p-5 space-y-6">
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 cursor-pointer mb-8"
        >
          <img
            src="https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png"
            alt="Tanzania"
            className="w-8 h-8"
          />
          <h1 className="text-xl font-semibold text-yellow-300">SmartGov TZ</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/20 ${
                window.location.pathname === item.path ? "bg-white/20" : ""
              }`}
            >
              <item.icon className="w-5 h-5 text-yellow-300" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600/60 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 🧱 Main Content */}
      <div className="flex-1 flex flex-col">
        {/* 🌟 Topbar */}
        <header className="flex items-center justify-between bg-white/10 backdrop-blur-xl border-b border-white/20 p-4 sticky top-0 z-40">
          <div>
            <h2 className="text-lg font-semibold">
              Hi, {profile?.full_name || "Citizen"} 👋
            </h2>
            <p className="text-white/70 text-sm">{profile?.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => toast.info("Notifications coming soon!")}
              className="relative p-2 hover:bg-white/10 rounded-full transition"
            >
              <Bell className="w-5 h-5 text-yellow-300" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* 📦 Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
};

export default CitizenLayout;
