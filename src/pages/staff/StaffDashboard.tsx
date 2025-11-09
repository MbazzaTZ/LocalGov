import React, { useEffect, useState } from "react";
import { useStaffAuth } from "@/contexts/staff-AuthContext";
import { toast } from "sonner";

const StaffDashboard = () => {
  const { profile, signOut, refreshProfile } = useStaffAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
  });

  useEffect(() => {
    refreshProfile();

    // Mock data for now — replace with real queries later
    setStats({ totalApplications: 38, pending: 6, approved: 32 });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-700 to-cyan-600 text-white p-6 md:p-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-2">
          Welcome, {profile?.full_name || "Staff"} 👋
        </h2>
        <p className="text-white/80 mb-8">
          Role: {profile?.role || "Staff"} | District: {profile?.district || "N/A"}
        </p>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/20 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-4xl font-bold text-yellow-300">{stats.totalApplications}</h3>
            <p className="text-sm uppercase mt-2 text-white/70">Total Applications</p>
          </div>
          <div className="bg-white/20 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-4xl font-bold text-orange-300">{stats.pending}</h3>
            <p className="text-sm uppercase mt-2 text-white/70">Pending</p>
          </div>
          <div className="bg-white/20 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-4xl font-bold text-green-300">{stats.approved}</h3>
            <p className="text-sm uppercase mt-2 text-white/70">Approved</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 space-x-4 text-center">
          <button
            onClick={() => (window.location.href = "/applications")}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold"
          >
            View Applications
          </button>
          <button
            onClick={() => (window.location.href = "/reports")}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-semibold"
          >
            Generate Reports
          </button>
          <button
            onClick={signOut}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

