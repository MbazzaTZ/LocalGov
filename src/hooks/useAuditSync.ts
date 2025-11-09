import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * ✅ useAuditSync Hook (Upgraded)
 * Keeps audit logs synchronized in real-time from Supabase.
 * Supports role, district, and ward filters, and pushes updates to dashboards.
 *
 * @param setExternalLogs optional setter for dashboard state
 * @param roleFilter optional user role (Admin, Ward, District, etc.)
 * @param districtFilter optional district scope
 * @param wardFilter optional ward scope
 * @returns { auditLogs, loading, error }
 */
export const useAuditSync = (
  setExternalLogs?: (logs: any[]) => void,
  roleFilter?: string,
  districtFilter?: string,
  wardFilter?: string
) => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch logs initially with filters
  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("application_audit")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);

      if (roleFilter) query = query.eq("role", roleFilter);
      if (districtFilter) query = query.eq("district", districtFilter);
      if (wardFilter) query = query.eq("ward", wardFilter);

      const { data, error } = await query;
      if (error) throw error;

      setAuditLogs(data || []);
      if (setExternalLogs) setExternalLogs(data || []);
    } catch (err: any) {
      console.error("❌ Error fetching audit logs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Real-time subscription for new audit entries
  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel("realtime:application_audit")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "application_audit" },
        (payload) => {
          const newLog = payload.new || payload.record;
          if (!newLog) return;

          // Apply filter logic dynamically
          if (
            (roleFilter && newLog.role !== roleFilter) ||
            (districtFilter && newLog.district !== districtFilter) ||
            (wardFilter && newLog.ward !== wardFilter)
          ) {
            return;
          }

          setAuditLogs((prev) => {
            const updated = [newLog, ...prev];
            if (setExternalLogs) setExternalLogs(updated);
            return updated;
          });
        }
      )
      .subscribe((status) =>
        console.log("📡 Supabase Audit Channel:", status)
      );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roleFilter, districtFilter, wardFilter]);

  return { auditLogs, loading, error };
};

// ✅ FIX: Add default export to match App.tsx import
export default useAuditSync;
