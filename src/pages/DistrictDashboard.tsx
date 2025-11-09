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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuditSync } from "@/hooks/useAuditSync";
import { useApplicationSync } from "@/hooks/useApplicationSync"; // ✅ ADDED
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const DistrictDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAppId, setCurrentAppId] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<string>("");
  const [actionNotes, setActionNotes] = useState<string>("");

  // ✅ Real-time audit + app sync
  useAuditSync(setAuditLogs);
  const { applications: liveApplications, loading: liveLoading } = useApplicationSync(
    setApplications,
    profile?.role || "District",
    profile?.district || null,
    profile?.ward || null
  );

  useEffect(() => {
    if (liveApplications && liveApplications.length > 0) {
      setApplications(liveApplications);
    }
  }, [liveApplications]);

  const latestAudit = auditLogs?.[0] || null;

  useEffect(() => {
    if (filterRole === "all") setFilteredLogs(auditLogs);
    else setFilteredLogs(auditLogs.filter((log) => log.role === filterRole));
  }, [auditLogs, filterRole]);

  const fetchApps = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("district", profile?.district)
      .order("created_at", { ascending: false });
    setApplications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const confirmAction = async () => {
    if (!currentAppId || !currentAction) return;
    await supabase.from("applications").update({ status: currentAction }).eq("id", currentAppId);
    await supabase.from("application_audit").insert([
      {
        app_id: currentAppId,
        admin_id: user?.id,
        role: "District",
        district: profile?.district,
        action: currentAction,
        notes: actionNotes,
        timestamp: new Date(),
      },
    ]);
    setIsDialogOpen(false);
    fetchApps();
  };

  const openDialog = (appId: string, action: string, note: string) => {
    setCurrentAppId(appId);
    setCurrentAction(action);
    setActionNotes(note);
    setIsDialogOpen(true);
  };

  const downloadAuditLogs = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      auditLogs.map((log) =>
        [
          log.id,
          log.timestamp,
          log.role,
          log.action,
          log.app_id,
          `"${log.notes.replace(/"/g, '""')}"`,
        ].join(",")
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `district_audit_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-secondary/5 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-foreground">District Dashboard</h1>

        {latestAudit && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-muted/30 rounded-lg border border-border/40 shadow-sm">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm text-muted-foreground">
              <b>Last Action:</b> {latestAudit.action} by{" "}
              <span className="text-primary">{latestAudit.role}</span> •{" "}
              {formatDistanceToNow(new Date(latestAudit.timestamp), { addSuffix: true })}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <BarChart3 className="w-6 h-6 mx-auto text-primary" />
            <p className="text-sm mt-2">Applications</p>
            <h2 className="text-2xl font-bold">{applications.length}</h2>
          </Card>
          <Card className="p-4 text-center">
            <Activity className="w-6 h-6 mx-auto text-yellow-600" />
            <p className="text-sm mt-2">Audit Logs</p>
            <h2 className="text-2xl font-bold">{auditLogs.length}</h2>
          </Card>
          <Card className="p-4 text-center">
            <RefreshCcw className="w-6 h-6 mx-auto text-green-600" />
            <p className="text-sm mt-2">Status</p>
            <Badge className="bg-green-100 text-green-700">
              {liveLoading ? "Syncing..." : "Live"}
            </Badge>
          </Card>
          <Card className="p-4 text-center">
            <ShieldCheck className="w-6 h-6 mx-auto text-blue-600" />
            <p className="text-sm mt-2">District Health</p>
            <Badge className="bg-blue-100 text-blue-700">OK</Badge>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">District Applications</h2>
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
                        <Badge>{a.status}</Badge>
                      </td>
                      <td className="p-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            openDialog(a.id, "Approved", "Approved by district officer.")
                          }
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            openDialog(a.id, "Rejected", "Rejected at district level.")
                          }
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          <Card className="p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Audit Trail</h2>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-muted/40">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-transparent text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="District">District</option>
                  <option value="Ward">Ward</option>
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
                <Download className="w-4 h-4" /> CSV
              </Button>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-2 text-sm">
              {filteredLogs.length === 0 && (
                <p className="text-muted-foreground">No audit entries found.</p>
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
                  </div>
                  <Badge variant="outline">{log.admin_id}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action: {currentAction}</DialogTitle>
            <DialogDescription>
              Provide a note for this district-level action.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DistrictDashboard;
