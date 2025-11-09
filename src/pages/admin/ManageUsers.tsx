import React, { useState } from "react";
import { toast } from "sonner";

const ManageUsers = () => {
  const [users] = useState([
    { id: 1, name: "John Citizen", email: "john@citizen.com", role: "Citizen" },
    { id: 2, name: "Jane Staff", email: "jane@localgov.co.tz", role: "Staff" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white p-6 md:p-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-white/30">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/10 hover:bg-white/10 transition">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => toast.success(`Reset email sent to ${u.email}`)}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-lg text-sm font-semibold"
                  >
                    Reset Password
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

export default ManageUsers;
