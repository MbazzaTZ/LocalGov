import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Universal Supabase Client Setup
 * Works in both local dev and Vercel production.
 * - Uses environment variables safely.
 * - Enables session persistence.
 * - Includes optional admin client for setup.
 * - Auto-seeds demo accounts (only in DEV mode).
 */

// -----------------------------------------------------------------------------
// 🏗️ Base Environment Configuration
// -----------------------------------------------------------------------------
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://maqykrdqtipvmowpamgm.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcXlrcmRxdGlwdm1vd3BhbWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODQ1MjUsImV4cCI6MjA3ODI2MDUyNX0.tIIjiur9kDZJcp7eTU3cokBpxLnIbYAgpdCUivSAfAE";

const SUPABASE_SERVICE_ROLE_KEY =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcXlrcmRxdGlwdm1vd3BhbWdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY4NDUyNSwiZXhwIjoyMDc4MjYwNTI1fQ.1UIqKa-2TaWQSIGeZeo6MK4cJBE9LF7cNeo3bFQLWCs";

// -----------------------------------------------------------------------------
// 🟢 Public Client (Frontend use)
// -----------------------------------------------------------------------------
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // ✅ Keeps user logged in between reloads
    autoRefreshToken: true, // ✅ Refreshes tokens automatically
    detectSessionInUrl: true, // ✅ Important for OAuth / redirects in Vercel
  },
});

// -----------------------------------------------------------------------------
// 🟣 Admin Client (Backend or Seeding only)
// -----------------------------------------------------------------------------
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

console.log("✅ Supabase client initialized successfully:", SUPABASE_URL);

// -----------------------------------------------------------------------------
// 🧩 Auto-Seed Demo Accounts (DEV only)
// -----------------------------------------------------------------------------
export const ensureDemoAccounts = async () => {
  // Run only in dev or local environment
  if (!import.meta.env.DEV) return;

  const demoAccounts = [
    {
      email: "admin@localgov.co.tz",
      password: "LocalGov@123",
      role: "Admin",
    },
    {
      email: "district@localgov.co.tz",
      password: "LocalGov@123",
      role: "District",
    },
    {
      email: "ward@localgov.co.tz",
      password: "LocalGov@123",
      role: "Ward",
    },
    {
      email: "staff@localgov.co.tz",
      password: "LocalGov@123",
      role: "Staff",
    },
  ];

  for (const acc of demoAccounts) {
    try {
      const { data: existing } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("email", acc.email)
        .single();

      if (existing) {
        console.log(`✅ ${acc.role} (${acc.email}) already exists`);
        continue;
      }

      console.log(`🆕 Creating demo account: ${acc.email}`);
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: { role: acc.role, is_verified: true },
      });

      if (userError) {
        console.error(`❌ Failed to create demo user ${acc.email}:`, userError.message);
        continue;
      }

      const userId = userData?.user?.id;
      if (!userId) continue;

      const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email: acc.email,
        full_name: `${acc.role} User`,
        role: acc.role,
        is_verified: true,
        must_change_password: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error(`⚠️ Profile insert failed for ${acc.email}:`, profileError.message);
        continue;
      }

      console.log(`✅ ${acc.role} demo account ready: ${acc.email}`);
    } catch (err: any) {
      console.error(`⚠️ Error seeding ${acc.email}:`, err.message);
    }
  }

  console.log("🎉 Demo account seeding complete!");
};
