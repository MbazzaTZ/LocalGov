import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Single Supabase Client (Universal)
 * Works in both development (localhost) and production (Vercel).
 * Automatically uses environment variables and logs initialization.
 */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://maqykrdqtipvmowpamgm.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcXlrcmRxdGlwdm1vd3BhbWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODQ1MjUsImV4cCI6MjA3ODI2MDUyNX0.tIIjiur9kDZJcp7eTU3cokBpxLnIbYAgpdCUivSAfAE";

const SUPABASE_SERVICE_ROLE_KEY =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcXlrcmRxdGlwdm1vd3BhbWdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY4NDUyNSwiZXhwIjoyMDc4MjYwNTI1fQ.1UIqKa-2TaWQSIGeZeo6MK4cJBE9LF7cNeo3bFQLWCs";

// 🟢 Public client for frontend
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// 🟣 Admin client (used only during seeding or local development)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

console.log("✅ Supabase client initialized:", SUPABASE_URL);

/**
 * 🧩 Auto-Seed Demo Accounts (only in DEV)
 * Runs automatically only in development to create default accounts
 * (Admin, District, Ward, Staff) if they don’t exist.
 */
export const ensureDemoAccounts = async () => {
  if (!import.meta.env.DEV) return;

  const demoAccounts = [
    { email: "admin@localgov.co.tz", password: "LocalGov@123", role: "Admin" },
    { email: "district@localgov.co.tz", password: "LocalGov@123", role: "District" },
    { email: "ward@localgov.co.tz", password: "LocalGov@123", role: "Ward" },
    { email: "staff@localgov.co.tz", password: "LocalGov@123", role: "Staff" },
  ];

  for (const acc of demoAccounts) {
    const { data: userCheck } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("email", acc.email)
      .single();

    if (!userCheck) {
      console.log(`🆕 Creating demo account: ${acc.email}`);
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: { role: acc.role, is_verified: true },
      });

      if (userError) {
        console.error("❌ Failed to create demo user:", userError.message);
        continue;
      }

      const userId = userData?.user?.id;
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email: acc.email,
        full_name: `${acc.role} User`,
        role: acc.role,
        is_verified: true,
        must_change_password: true,
      });
    }
  }

  console.log("✅ Demo accounts verified/created successfully");
};
