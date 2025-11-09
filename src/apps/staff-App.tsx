import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabaseClient";
import { useStaffAuth, StaffAuthProvider } from "@/contexts/staff-AuthContext";
import { syncOfflineReports } from "@/utils/offlineSync";
import StaffProtectedRoute from "@/components/staff-ProtectedRoute";

// Pages
import StaffDashboard from "@/pages/staff/StaffDashboard";
import StaffProfile from "@/pages/staff/StaffProfile";
import FieldReport from "@/pages/staff/FieldReport";
import StaffAnalytics from "@/pages/staff/StaffAnalytics";
import MapReports from "@/pages/staff/MapReports";

import { toast } from "sonner";
import { Home, BarChart3, Map, User, FileText, Wifi, WifiOff } from "lucide-react";

// 🧭 Responsive Bottom Navigation for mobile
const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const NavLink = ({ to, icon: Icon, label }: any) => (
    <Link
      to={to}
      className={`flex flex-col items-center text-sm transition ${
        path === to ? "text-cyan-400" : "text-white/70"
      } hover:text-cyan-300`}
    >
      <Icon className="w-6 h-6 mb-1" />
      {label}
    </Link>
  );

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/40 backdrop-blur-lg border-t border-white/10 p-2 flex justify-around z-50">
      <NavLink to="/staff/dashboard" icon={Home} label="Home" />
      <NavLink to="/staff/report" icon={FileText} label="Report" />
      <NavLink to="/staff/map" icon={Map} label="Map" />
      <NavLink to="/staff/analytics" icon={BarChart3} label="Stats" />
      <NavLink to="/staff/profile" icon={User} label="Profile" />
    </nav>
  );
};

// 🧠 Online/Offline Status Banner
const ConnectionStatus = () => {
  const [online, setOnline] = React.useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <div
      className={`fixed top-0 left-0 w-full text-center py-1 text-xs font-medium z-50 ${
        online ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {online ? (
        <span className="flex items-center justify-center gap-1">
          <Wifi className="w-3 h-3" /> Online
        </span>
      ) : (
        <span className="flex items-center justify-center gap-1">
          <WifiOff className="w-3 h-3" /> Offline Mode (Reports will sync later)
        </span>
      )}
    </div>
  );
};

// 🧩 Staff App Main Wrapper
const StaffAppShell = () => {
  const { profile, loading } = useStaffAuth();

  useEffect(() => {
    if (!loading && profile && navigator.onLine) {
      syncOfflineReports(profile.id);
    }
  }, [profile, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-700 text-white">
        Loading your staff workspace...
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white">
      <ConnectionStatus />
      <Routes>
        <Route
          path="/staff/dashboard"
          element={
            <StaffProtectedRoute>
              <StaffDashboard />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <StaffProtectedRoute>
              <StaffProfile />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/report"
          element={
            <StaffProtectedRoute>
              <FieldReport />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/analytics"
          element={
            <StaffProtectedRoute>
              <StaffAnalytics district={profile.district} ward={profile.ward} />
            </StaffProtectedRoute>
          }
        />
        <Route
          path="/staff/map"
          element={
            <StaffProtectedRoute>
              <MapReports />
            </StaffProtectedRoute>
          }
        />
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
      </Routes>

      <BottomNav />
    </div>
  );
};

// 🚀 Main Export
const StaffApp = () => (
  <StaffAuthProvider>
    <Router>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <StaffAppShell />
      </TooltipProvider>
    </Router>
  </StaffAuthProvider>
);

export default StaffApp;
