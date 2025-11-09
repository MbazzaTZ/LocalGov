import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Stats = {
  totalCitizens: number;
  totalStaff: number;
  totalApplications: number;
  pendingApplications: number;
};

export function useAdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalCitizens: 0,
    totalStaff: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });

  const loadStats = async () => {
    const [{ count: citizens }, { count: staff }, { count: apps }, { count: pending }] =
      await Promise.all([
        supabase.from("profiles").select("*", { count: "exact" }).eq("role", "Citizen"),
        supabase.from("profiles").select("*", { count: "exact" }).neq("role", "Citizen"),
        supabase.from("applications").select("*", { count: "exact" }),
        supabase.from("applications").select("*", { count: "exact" }).eq("status", "Pending"),
      ]);

    setStats({
      totalCitizens: citizens || 0,
      totalStaff: staff || 0,
      totalApplications: apps || 0,
      pendingApplications: pending || 0,
    });
  };

  useEffect(() => {
    loadStats();

    // 🔁 Realtime listener for changes
    const channels = [
      supabase.channel("profiles").on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, loadStats),
      supabase.channel("applications").on("postgres_changes", { event: "*", schema: "public", table: "applications" }, loadStats),
    ];

    channels.forEach((ch) => ch.subscribe());

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, []);

  return stats;
}
