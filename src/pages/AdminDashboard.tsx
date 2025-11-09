import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart3,
  RefreshCcw,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
  Activity,
  ShieldCheck,
  Download,
  Filter,
  Clock,
} from "lucide-react";
// ➕ NEW IMPORTS for the Modal (assuming these UI components exist)
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
// ➕ END NEW IMPORTS
import { useAuditSync } from "@/hooks/useAuditSync";
import { useApplicationSync } from "@/hooks/useApplicationSync"; // ✅ ADDED
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // ➕ NEW STATE for Modal Handling
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<string>("");
  const [actionNotes, setActionNotes] = useState<string>("");
  // ➕ END NEW STATE

  // ✅ Real-time audit sync
  useAuditSync(setAuditLogs);

  // ✅ NEW: Real-time live application sync
  const { applications: liveApplications, loading: liveLoading } = useApplicationSync(
    setApplications,
    profile?.role || "Admin",
    profile?.district || null,
    profile?.ward || null
  );

  useEffect(() => {
    if (liveApplications && liveApplications.length > 0) {
      setApplications(liveApplications);
    }
  }, [liveApplications]);

  // ✅ Latest audit indicator
  const latestAudit = auditLogs?.[0] || null;

  // ✅ Filter logs based on selected role
  useEffect(() => {
    if (filterRole === "all") {
      setFilteredLogs(auditLogs);
    } else {
      setFilteredLogs(auditLogs.filter((log) => log.role === filterRole));
    }
  }, [auditLogs, filterRole]);

  // ✅ Fetching Applications (kept as fallback)
  const fetchApps = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApplications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // 📝 MODIFIED: confirmAdminAction (unchanged, only syncs automatically)
  const confirmAdminAction = async () => {
    if (!currentAppId || !currentAction) return;

    const { error: updateError } = await supabase
      .from("applications")
      .update({ status: currentAction })
      .eq("id", currentAppId);

    if (updateError) {
      console.error("Error updating application status:", updateError);
      return;
    }

    const { error: auditError } = await supabase.from("application_audit").insert([
      {
        app_id: currentAppId,
        admin_id: user?.id,
        role: profile?.role || "Admin",
        district: profile?.district || null,
        ward: profile?.ward || null,
        action: currentAction,
        notes:
          actionNotes.trim() ||
          `Action: ${currentAction}. No specific notes provided.`,
        timestamp: new Date(),
      },
    ]);

    if (auditError) console.error("Error logging audit trail:", auditError);

    setIsDialogOpen(false);
    setCurrentAppId(null);
    setCurrentAction("");
    setActionNotes("");

    fetchApps();
  };

  // ➕ NEW: Function to open the dialog
  const openActionDialog = (appId: string, action: string, defaultNote: string) => {
    setCurrentAppId(appId);
    setCurrentAction(action);
    setActionNotes(defaultNote);
    setIsDialogOpen(true);
  };

  // ✅ Download CSV (unchanged)
  const downloadAuditLogs = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      auditLogs
        .map((log) =>
          [
            log.id,
            log.timestamp,
            log.role,
            log.action,
            log.app_id,
            `"${log.notes.replace(/"/g, '""')}"`,
          ].join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_log_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-foreground">
          Admin Dashboard
        </h1>

        {/* 🧾 Live Audit Indicator */}
        {latestAudit && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-muted/30 rounded-lg border border-border/40 shadow-sm">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Last Action:</span>{" "}
              {latestAudit.action} by{" "}
              <span className="font-medium text-primary">
                {latestAudit.role || "Admin"}
              </span>{" "}
              •{" "}
              {formatDistanceToNow(new Date(latestAudit.timestamp), {
                addSuffix: true,
              })}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <BarChart3 className="w-6 h-6 mx-auto text-primary" />
            <p className="text-sm mt-2 text-muted-foreground">Applications</p>
            <h2 className="text-2xl font-bold">{applications.length}</h2>
          </Card>
          <Card className="p-4 text-center">
            <Activity className="w-6 h-6 mx-auto text-yellow-600" />
            <p className="text-sm mt-2 text-muted-foreground">Active Users</p>
            <h2 className="text-2xl font-bold">24</h2>
          </Card>
          <Card className="p-4 text-center">
            <RefreshCcw className="w-6 h-6 mx-auto text-green-600" />
            <p className="text-sm mt-2 text-muted-foreground">Status</p>
            <Badge className="bg-green-100 text-green-700">
              {liveLoading ? "Syncing..." : "Live"}
            </Badge>
          </Card>
          <Card className="p-4 text-center">
            <ShieldCheck className="w-6 h-6 mx-auto text-blue-600" />
            <p className="text-sm mt-2 text-muted-foreground">Audit Health</p>
            <Badge className="bg-blue-100 text-blue-700">OK</Badge>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Active Applications
            </h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="p-3">Applicant</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">{a.user_id}</td>
                      <td className="p-3">{a.service_name}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            a.status === "Approved"
                              ? "default"
                              : a.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            a.status === "Approved"
                              ? "bg-green-500 hover:bg-green-500"
                              : a.status === "Rejected"
                              ? "bg-red-500 hover:bg-red-500"
                              : "bg-yellow-500 hover:bg-yellow-500"
                          }
                        >
                          {a.status}
                        </Badge>
                      </td>
                      <td className="p-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            openActionDialog(a.id, "Approved", "Application approved.")
                          }
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            openActionDialog(a.id, "Rejected", "Application rejected.")
                          }
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            openActionDialog(
                              a.id,
                              "Escalated",
                              "Escalated for further review at the District level."
                            )
                          }
                        >
                          <ArrowUpCircle className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          <Card className="p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Live Audit Trail
            </h2>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-muted/40">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="District Staff">District Staff</option>
                  <option value="Ward Staff">Ward Staff</option>
                  <option value="Staff">Staff</option>
                </select>
                <Filter className="w-4 h-4 text-muted-foreground" />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={downloadAuditLogs}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download CSV
              </Button>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-2 text-sm">
              {filteredLogs.length === 0 && (
                <p className="text-muted-foreground">
                  No audit entries found for this role.
                </p>
              )}
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border-b pb-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.notes} — {new Date(log.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600">
                      {log.role} • {log.district || "—"} / {log.ward || "—"}
                    </p>
                  </div>
                  <Badge variant="outline">{log.admin_id}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ➕ NEW: Confirmation/Notes Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Action: {currentAction}</DialogTitle>
            <DialogDescription>
              Please add a note to justify the <b>{currentAction}</b> action. This note
              will be recorded in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="notes"
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Enter your notes here..."
              className="col-span-4"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAdminAction}
              disabled={!currentAction || !currentAppId}
              className={
                currentAction === "Rejected"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-primary hover:bg-primary/90"
              }
            >
              Confirm {currentAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
