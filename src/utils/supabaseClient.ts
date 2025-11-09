import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Supabase Client with Auto Demo Account Creation
 * Automatically ensures Admin, District, Ward, and Staff demo accounts exist.
 * Safe for production and dev use.
 */

// --------------------------------------------------------------------------
// 🔗 Environment Configuration
// --------------------------------------------------------------------------
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://maqykrdqtipvmowpamgm.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcXlrcmRxdGlwdm1vd3BhbWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODQ1MjUsImV4cCI6MjA3ODI2MDUyNX0.tIIjiur9kDZJcp7eTU3cokBpxLnIbYAgpdCUivSAfAE";

const SUPABASE_SERVICE_ROLE_KEY =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcXlrcmRxdGlwdm1vd3BhbWdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjY4NDUyNSwiZXhwIjoyMDc4MjYwNTI1fQ.1UIqKa-2TaWQSIGeZeo6MK4cJBE9LF7cNeo3bFQLWCs";

// --------------------------------------------------------------------------
// ⚙️ Initialize Public Client
// --------------------------------------------------------------------------
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

console.log("✅ Supabase initialized successfully:", SUPABASE_URL);

// --------------------------------------------------------------------------
// 👥 DEMO ACCOUNTS CONFIGURATION
// --------------------------------------------------------------------------
const demoAccounts = [
  {
    email: "admin@localgov.co.tz",
    password: "LocalGov@123",
    role: "Admin",
    full_name: "System Administrator",
    district: "National",
    ward: "HQ",
    is_admin: true,
  },
  {
    email: "district@localgov.co.tz",
    password: "LocalGov@123",
    role: "District",
    full_name: "District Executive Officer",
    district: "Ilala",
    ward: null,
    is_admin: false,
  },
  {
    email: "ward@localgov.co.tz",
    password: "LocalGov@123",
    role: "Ward",
    full_name: "Ward Executive Officer",
    district: "Ilala",
    ward: "Kariakoo",
    is_admin: false,
  },
  {
    email: "staff@localgov.co.tz",
    password: "LocalGov@123",
    role: "Staff",
    full_name: "Village/Street Staff",
    district: "Ilala",
    ward: "Kariakoo",
    is_admin: false,
  },
];

// --------------------------------------------------------------------------
// 🧠 DEMO ACCOUNT CREATION FUNCTION
// --------------------------------------------------------------------------
async function ensureDemoAccounts() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ Skipping demo account creation — missing SERVICE_ROLE_KEY.");
    return;
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    console.log("🧩 Checking for existing demo users...");
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Failed to list Supabase users:", listError.message);
      return;
    }

    for (const account of demoAccounts) {
      const exists = existingUsers?.users?.some((u) => u.email === account.email);

      if (exists) {
        console.log(`✅ ${account.role} already exists: ${account.email}`);
        continue;
      }

      console.log(`🆕 Seeding demo account: ${account.email}`);

      // Step 1 — Create new auth user
      const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          role: account.role,
          full_name: account.full_name,
          district: account.district,
          ward: account.ward,
          is_admin: account.is_admin,
          is_verified: true,
        },
      });

      if (createError) {
        console.error(`❌ Failed to create demo user ${account.email}:`, createError.message);
        continue;
      }

      const userId = createdUser?.user?.id;
      if (!userId) {
        console.warn(`⚠️ Missing user ID for ${account.role}`);
        continue;
      }

      // Step 2 — Insert profile
      const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email: account.email,
        full_name: account.full_name,
        role: account.role,
        district: account.district,
        ward: account.ward,
        is_admin: account.is_admin,
        is_verified: true,
        must_change_password: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error(
          `⚠️ Failed to insert profile for ${account.email}:`,
          profileError.message
        );
      } else {
        console.log(`✅ Profile created for ${account.role}: ${account.email}`);
      }
    }

    console.log("🎉 All demo accounts verified/created successfully!");
  } catch (err: any) {
    console.error("❌ Error during demo account setup:", err.message);
  }
}

// --------------------------------------------------------------------------
// 🧩 AUTO-SEED CONTROL LOGIC
// --------------------------------------------------------------------------
// ✅ Only run locally (vite dev) or explicitly when VITE_ENV=seed
if (import.meta.env.DEV || import.meta.env.VITE_ENV === "seed") {
  console.log("🚀 Auto-seeding demo accounts (DEV or seed mode)...");
  ensureDemoAccounts();
} else {
  console.log("⏭️ Skipping demo account seeding in production build.");
}
