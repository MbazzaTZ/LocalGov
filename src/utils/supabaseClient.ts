import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Supabase Client with Auto Demo Account Creation
 * Automatically ensures Admin, District, Ward, and Staff demo accounts exist.
 */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://ubpopiltillvjncpzdqu.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicG9waWx0aWxsdmpuY3B6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTU4MTQsImV4cCI6MjA3ODE3MTgxNH0.I4PwXBfQnustdhMPPH3X9ZaIZ7mSjEhqYPHr14IPgCk";

const SUPABASE_SERVICE_ROLE_KEY =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  "YOUR_SERVICE_ROLE_KEY_HERE";

// ✅ Safe public Supabase client for app use
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

console.log("✅ Supabase initialized successfully:", SUPABASE_URL);

// --------------------------------------------------------------------------
// 🧩 AUTO-DEMO ACCOUNTS CONFIGURATION
// --------------------------------------------------------------------------

/**
 * Hardcoded default demo accounts.
 * Use this for development, demos, and first-time deployment.
 */
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
// 🧠 Auto-Create Logic
// --------------------------------------------------------------------------

/**
 * Creates or verifies existence of demo users and profiles.
 */
async function ensureDemoAccounts() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ Skipping demo account creation — missing SERVICE_ROLE_KEY.");
    return;
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Fetch existing users
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error("❌ Failed to list Supabase users:", listError.message);
      return;
    }

    for (const account of demoAccounts) {
      const exists = users?.users?.some((u) => u.email === account.email);

      if (exists) {
        console.log(`✅ ${account.role} already exists: ${account.email}`);
        continue;
      }

      console.log(`🧩 Creating ${account.role} account: ${account.email}`);

      // Step 1 — Create user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          role: account.role,
          district: account.district,
          ward: account.ward,
          full_name: account.full_name,
          is_admin: account.is_admin,
          is_verified: true,
        },
      });

      if (createError) {
        console.error(`❌ Error creating ${account.role}:`, createError.message);
        continue;
      }

      const userId = newUser?.user?.id;
      if (!userId) {
        console.warn(`⚠️ Missing user ID for ${account.role}`);
        continue;
      }

      // Step 2 — Insert or update profile record
      const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email: account.email,
        full_name: account.full_name,
        role: account.role,
        district: account.district,
        ward: account.ward,
        is_admin: account.is_admin,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      if (profileError) {
        console.error(`⚠️ Failed to insert profile for ${account.role}:`, profileError.message);
        continue;
      }

      console.log(`✅ ${account.role} created successfully: ${account.email}`);
    }

    console.log("🎉 All demo accounts verified/created successfully!");
  } catch (err) {
    console.error("❌ Error during demo account setup:", err);
  }
}

// --------------------------------------------------------------------------
// 🔄 Auto-run setup in Development mode only
// --------------------------------------------------------------------------

if (import.meta.env.DEV) {
  ensureDemoAccounts();
}
