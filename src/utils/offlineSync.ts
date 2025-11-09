import { supabase } from "@/lib/supabaseClient";

export async function syncOfflineReports(profileId: string) {
  const offlineData = localStorage.getItem("offlineReports");
  if (!offlineData) return;

  const reports = JSON.parse(offlineData);
  for (const report of reports) {
    await supabase.from("staff_reports").insert([
      {
        staff_id: profileId,
        ...report,
        synced: true,
      },
    ]);
  }

  localStorage.removeItem("offlineReports");
  console.log("✅ Offline reports synced to Supabase");
}
