import React from "react";
import { useRegionalAnalytics } from "@/hooks/useRegionalAnalytics";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";

const Analytics = () => {
  const { districtStats, staffPerformance, loading } = useRegionalAnalytics();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading analytics...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">📊 Regional Analytics Dashboard</h1>

      {/* District Applications Overview */}
      <div className="bg-white/10 p-6 rounded-2xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">Applications by District</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={districtStats}>
            <XAxis dataKey="district" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="approved" fill="#4ade80" name="Approved" />
            <Bar dataKey="pending" fill="#facc15" name="Pending" />
            <Bar dataKey="rejected" fill="#f87171" name="Rejected" />
          </BarChart>
        </ResponsiveContainer>
      </div>
<button
  onClick={() => exportToCSV(districtStats, "district_analytics.csv")}
  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg mt-6"
>
  Export to CSV
</button>

      {/* Staff Performance Overview */}
      <div className="bg-white/10 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Staff Performance by Approvals</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={staffPerformance}>
            <XAxis dataKey="staffName" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="handledApplications" stroke="#60a5fa" name="Handled" />
            <Line type="monotone" dataKey="approvals" stroke="#22c55e" name="Approved" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
