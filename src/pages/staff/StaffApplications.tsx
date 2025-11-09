import React, { useState } from "react";

const StaffApplications = () => {
  const [applications] = useState([
    { id: 1, citizen: "John Doe", type: "Resident Certificate", status: "Pending" },
    { id: 2, citizen: "Jane Smith", type: "Business Permit", status: "Approved" },
    { id: 3, citizen: "Ali Mohamed", type: "Event Permit", status: "Pending" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-700 to-cyan-600 text-white p-6 md:p-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Applications</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-white/30">
              <th className="p-3">#</th>
              <th className="p-3">Citizen</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id} className="border-b border-white/10 hover:bg-white/10">
                <td className="p-3">{a.id}</td>
                <td className="p-3">{a.citizen}</td>
                <td className="p-3">{a.type}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3 text-right">
                  <button className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-lg text-sm font-semibold">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffApplications;

