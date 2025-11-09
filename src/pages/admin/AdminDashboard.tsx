import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/contexts/admin-AuthContext";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { profile, signOut, refreshProfile } = useAdminAuth();
  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalStaff: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    refreshProfile();

    // Example demo data
    setStats({
      totalCitizens: 1800,
      totalStaff: 120,
      totalApplications: 945,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white p-6 md:p-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-2">
          Welcome, {profile?.full_name || "Admin"} 👑
        </h2>
        <p className="text-white/80 mb-8">System Administrator Panel</p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/20 rounded-xl p-6 text-center">
            <h3 className="text-4xl font-bold text-yellow-300">{stats.totalCitizens}</h3>
            <p className="mt-2 text-sm uppercase">Registered Citizens</p>
          </div>
          <div className="bg-white/20 rounded-xl p-6 text-center">
            <h3 className="text-4xl font-bold text-orange-300">{stats.totalStaff}</h3>
            <p className="mt-2 text-sm uppercase">Staff Members</p>
          </div>
          <div className="bg-white/20 rounded-xl p-6 text-center">
            <h3 className="text-4xl font-bold text-green-300">{stats.totalApplications}</h3>
            <p className="mt-2 text-sm uppercase">Applications Processed</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 text-center space-x-4">
          <button
            onClick={() => (window.location.href = "/admin/users")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
          >
            Manage Users
          </button>
          <button
            onClick={() => (window.location.href = "/admin/applications")}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold"
          >
            View Applications
          </button>
          <button
            onClick={() => (window.location.href = "/admin/settings")}
            className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-semibold"
          >
            System Settings
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

export default AdminDashboard;

