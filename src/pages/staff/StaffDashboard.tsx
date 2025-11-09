import React, { useEffect } from "react";
import { useStaffAuth } from "@/contexts/staff-AuthContext";
import { useStaffApplications } from "@/hooks/useStaffApplications";
import { logAdminAction } from "@/utils/logAdminAction";
import { toast } from "sonner";

const StaffDashboard = () => {
  const { profile } = useStaffAuth();
  const { applications, loading, refetch } = useStaffApplications(profile?.district!, profile?.ward);

  useEffect(() => {
    refetch();
  }, []);

  const handleDecision = async (appId: string, decision: string, note?: string) => {
    const { error } = await supabase
      .from("applications")
      .update({
        decision,
        decision_note: note || "",
        handled_by: profile?.id,
        handled_at: new Date(),
        status: decision === "Approved" ? "Approved" : decision === "Rejected" ? "Rejected" : "Pending",
      })
      .eq("id", appId);

    if (error) {
      toast.error("Action failed", { description: error.message });
    } else {
      toast.success(`${decision} successfully recorded.`);
      await logAdminAction(profile?.id!, "Staff", `${decision} Application`, `App ID: ${appId}`);
      refetch();
    }
  };

  if (loading) return <div className="p-10 text-center text-white">Loading applications...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Staff Dashboard</h1>

      <div className="bg-white/10 p-6 rounded-2xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/20 text-left">
              <th className="p-3">Applicant</th>
              <th className="p-3">Service Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Submitted</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-white/10 hover:bg-white/10 transition">
                <td className="p-3">{app.user_name || "Citizen"}</td>
                <td className="p-3">{app.service_type}</td>
                <td className="p-3">{app.status}</td>
                <td className="p-3 text-sm text-white/70">
                  {new Date(app.submitted_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleDecision(app.id, "Approved")}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(app.id, "Rejected")}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDecision(app.id, "Review", "Need more info")}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-sm"
                  >
                    Request Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!applications.length && <p className="text-center text-white/60 mt-4">No applications available.</p>}
      </div>
    </div>
  );
};

export default StaffDashboard;
