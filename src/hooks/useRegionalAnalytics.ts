import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type RegionalStats = {
  district: string;
  totalApplications: number;
  approved: number;
  pending: number;
  rejected: number;
};

type StaffPerformance = {
  staffName: string;
  district: string;
  handledApplications: number;
  approvals: number;
};

export function useRegionalAnalytics() {
  const [districtStats, setDistrictStats] = useState<RegionalStats[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);

      // 🔹 Fetch Applications per District
      const { data: districts } = await supabase
        .from("applications")
        .select("district, status")
        .not("district", "is", null);

      const districtMap: Record<string, RegionalStats> = {};
      districts?.forEach((app) => {
        const d = app.district || "Unknown";
        if (!districtMap[d]) {
          districtMap[d] = { district: d, totalApplications: 0, approved: 0, pending: 0, rejected: 0 };
        }
        districtMap[d].totalApplications++;
        if (app.status === "Approved") districtMap[d].approved++;
        if (app.status === "Pending") districtMap[d].pending++;
        if (app.status === "Rejected") districtMap[d].rejected++;
      });

      setDistrictStats(Object.values(districtMap));

      // 🔹 Staff Performance (based on applications handled)
      const { data: staffApps } = await supabase
        .from("applications")
        .select("approved_by, district, status, profiles(full_name)")
        .neq("approved_by", null);

      const staffMap: Record<string, StaffPerformance> = {};
      staffApps?.forEach((app) => {
        const staff = app.profiles?.full_name || "Unknown";
        if (!staffMap[staff]) {
          staffMap[staff] = {
            staffName: staff,
            district: app.district || "Unknown",
            handledApplications: 0,
            approvals: 0,
          };
        }
        staffMap[staff].handledApplications++;
        if (app.status === "Approved") staffMap[staff].approvals++;
      });

      setStaffPerformance(Object.values(staffMap));
      setLoading(false);
    };

    loadAnalytics();

    // 🔁 Realtime updates
    const channel = supabase
      .channel("regional_analytics")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        loadAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { districtStats, staffPerformance, loading };
}
