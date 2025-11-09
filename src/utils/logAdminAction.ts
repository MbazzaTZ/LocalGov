import { supabase } from "@/lib/supabaseClient";

export async function logAdminAction(userId: string, role: string, action: string, details?: string) {
  try {
    await supabase.from("audit_logs").insert([
      {
        user_id: userId,
        role,
        action,
        details,
      },
    ]);
  } catch (err) {
    console.error("❌ Failed to log admin action:", err);
  }
}
