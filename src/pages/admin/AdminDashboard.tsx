import React, { useEffect } from "react";
import { useAdminAuth } from "@/contexts/admin-AuthContext";
import { useAdminStats } from "@/hooks/useAdminStats";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { profile, signOut, refreshProfile } = useAdminAuth();
  const stats = useAdminStats();

  useEffect(() => {
    refreshProfile();
  }, []);

  const chartData = [
    { name: "Citizens", value: stats.totalCitizens },
    { name: "Staff", value: stats.totalStaff },
    { name: "Applications", value: stats.totalApplications },
    { name: "Pending", value: stats.pendingApplications },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white p-6 md:p-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-2">
          Welcome, {profile?.full_name || "Admin"} 👑
        </h2>
        <p className="text-white/80 mb-8">System Administrator Dashboard</p>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/20 rounded-xl p-6 text-center">
            <h3 className="text-4xl font-bold text-yellow-300">{stats.totalCitizens}</h3>
            <p className="mt-2 text-sm uppercase">Citizens</p>
          </div>
          <div className="bg-white/20 rounded-xl p-6 text-center">
            <h3 className="text-4xl font-bold text-orange-300">{stats.totalStaff}</h3>
            <p className="mt-2 text-sm uppercase">Staff</p>
          </div>
          <div className="bg-white/20 rounded-xl p-6 text-center">
            <h3 className="text-4xl font-bold text-green-300">{stats.totalApplications}</h3>
            <p className="mt-2 text-sm uppercase">Applications</p>
          </div>
          <div className="bg-white/20 rounded-xl p-6 text-center">
            <h3 className="text-4xl font-bold text-red-300">{stats.pendingApplications}</h3>
            <p className="mt-2 text-sm uppercase">Pending</p>
          </div>
        </div>

        {/* Recharts Visualization */}
        <div className="bg-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">System Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="value" fill="#38bdf8" radius={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actions */}
        <div className="mt-10 text-center space-x-4">
          <button
            onClick={() => (window.location.href = "/admin/users")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
          >
            Manage Users
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
