import React from "react";
import { useStaffApplications } from "@/hooks/useStaffApplications";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171"];

export default function StaffAnalytics({ district, ward }: { district: string; ward?: string }) {
  const { applications } = useStaffApplications(district, ward);

  const data = [
    { name: "Approved", value: applications.filter((a) => a.status === "Approved").length },
    { name: "Pending", value: applications.filter((a) => a.status === "Pending").length },
    { name: "Rejected", value: applications.filter((a) => a.status === "Rejected").length },
  ];

  return (
    <div className="bg-white/10 p-6 rounded-2xl shadow-lg mt-10">
      <h3 className="text-xl font-semibold mb-4 text-center">📈 My Performance Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
