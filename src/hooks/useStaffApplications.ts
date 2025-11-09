import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useStaffApplications(staffDistrict: string, staffWard?: string) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);

    let query = supabase.from("applications").select("*").order("submitted_at", { ascending: false });

    if (staffDistrict) query = query.eq("district", staffDistrict);
    if (staffWard) query = query.eq("ward", staffWard);

    const { data, error } = await query;
    if (error) console.error("❌ Fetch error:", error.message);

    setApplications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();

    // Live sync
    const channel = supabase
      .channel("applications")
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, fetchApplications)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [staffDistrict, staffWard]);

  return { applications, loading, refetch: fetchApplications };
}
