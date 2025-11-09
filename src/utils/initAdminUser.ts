import { createClient } from "@supabase/supabase-js";

/**
 * ✅ Production-Safe Supabase Client
 * Reads URL and keys from environment variables.
 * Keeps secrets secure for Vercel deployment.
 */

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://ubpopiltillvjncpzdqu.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicG9waWx0aWxsdmpuY3B6ZHF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTU4MTQsImV4cCI6MjA3ODE3MTgxNH0.I4PwXBfQnustdhMPPH3X9ZaIZ7mSjEhqYPHr14IPgCk";

const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // optional but required for admin creation

// ✅ Public client for user-facing actions
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

console.log("✅ Supabase initialized successfully:", SUPABASE_URL);

// --------------------------------------------------------------------------
// 🧩 Auto-Admin Creation (One-Time Setup)
// --------------------------------------------------------------------------

// Run only in dev or first-time initialization (avoid re-running in production)
if (import.meta.env.DEV && SUPABASE_SERVICE_ROLE_KEY) {
  ensureAdminUser();
}

/**
 * ✅ Ensures the default admin exists (for first-time setup)
 * Creates admin user automatically if not found.
 */
async function ensureAdminUser() {
  console.log("🧩 Checking for default admin user...");

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const adminEmail = "admin@localgov.co.tz";
    const defaultPassword = "LocalGov@123";

    // Step 1: List users
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
    if (fetchError) {
      console.error("❌ Failed to fetch users:", fetchError.message);
      return;
    }

    const adminExists = users?.users?.some((u) => u.email === adminEmail);
    if (adminExists) {
      console.log("✅ Admin already exists, skipping creation.");
      return;
    }

    // Step 2: Create admin user
    const { data: newAdmin, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: { role: "Admin", must_change_password: true },
    });

    if (createError) {
      console.error("❌ Failed to create admin:", createError.message);
      return;
    }

    const adminId = newAdmin?.user?.id;
    if (!adminId) {
      console.error("⚠️ Admin ID missing after creation.");
      return;
    }

    // Step 3: Ensure admin profile exists
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: adminId,
      email: adminEmail,
      is_admin: true,
      is_verified: true,
      must_change_password: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (profileError) {
      console.error("⚠️ Failed to insert admin profile:", profileError.message);
      return;
    }

    console.log("✅ Default Admin created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", defaultPassword);
  } catch (err) {
    console.error("❌ Admin creation error:", err);
  }
}
