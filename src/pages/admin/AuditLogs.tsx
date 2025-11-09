import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const loadLogs = async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });
      setLogs(data || []);
    };

    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white p-6 md:p-10">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">System Audit Logs</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-white/30">
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-white/10 hover:bg-white/10 transition">
                  <td className="p-3">{log.role}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">{log.details || "-"}</td>
                  <td className="p-3 text-sm text-white/70">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
