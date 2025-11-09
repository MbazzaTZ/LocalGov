import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * ✅ Real-time Application Sync Hook
 * Automatically updates application data when Supabase emits changes.
 *
 * @param setApplications - State setter from the dashboard (useState)
 * @param role - Current user's role (Admin, District, Ward, Staff, etc.)
 * @param district - District filter (if applicable)
 * @param ward - Ward filter (if applicable)
 */
export const useApplicationSync = (
  setApplications: (apps: any[]) => void,
  role: string | null = null,
  district: string | null = null,
  ward: string | null = null
) => {
  const [applications, setLocalApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let filterQuery = supabase.from("applications").select("*");

    // ✅ Apply role-based filters
    if (role === "District" && district) {
      filterQuery = filterQuery.eq("district", district);
    } else if (role === "Ward" && ward) {
      filterQuery = filterQuery.eq("ward", ward);
    } else if (role === "Staff" && ward) {
      filterQuery = filterQuery.eq("ward", ward);
    }

    const fetchInitialData = async () => {
      setLoading(true);
      const { data, error } = await filterQuery.order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching applications:", error);
      } else {
        setApplications(data || []);
        setLocalApps(data || []);
      }
      setLoading(false);
    };

    fetchInitialData();

    // ✅ Subscribe to real-time updates
    const channel = supabase
      .channel("applications_sync_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        async (payload) => {
          // console.log("📡 Realtime update:", payload);

          // Fetch latest data (could optimize with diff merging)
          const { data } = await filterQuery.order("created_at", { ascending: false });

          setApplications(data || []);
          setLocalApps(data || []);
        }
      )
      .subscribe();

    // ✅ Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [role, district, ward, setApplications]);

  return { applications, loading };
};

export default useApplicationSync;
