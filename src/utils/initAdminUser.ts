import { createClient } from "@supabase/supabase-js";

// ⚠️ Use your service_role key (not anon key)
const supabaseAdmin = createClient(
  "https://ubpopiltillvjncpzdqu.supabase.co",
  "YOUR_SERVICE_ROLE_KEY"
);

/**
 * ✅ Automatically ensures the admin account exists.
 * Run once at startup (or manually in terminal).
 */
export async function ensureAdminUser() {
  const adminEmail = "admin@localgov.co.tz";
  const defaultPassword = "LocalGov@123";

  // Step 1: Check if admin exists
  const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
  if (fetchError) {
    console.error("❌ Error fetching users:", fetchError.message);
    return;
  }

  const adminExists = users?.users?.some((u) => u.email === adminEmail);
  if (adminExists) {
    console.log("✅ Admin already exists. Skipping creation.");
    return;
  }

  // Step 2: Create new admin
  const { data: newAdmin, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: defaultPassword,
    email_confirm: true,
    user_metadata: { role: "Admin" },
  });

  if (createError) {
    console.error("❌ Failed to create admin:", createError.message);
    return;
  }

  const adminId = newAdmin.user.id;

  // Step 3: Insert into profiles
  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: adminId,
    email: adminEmail,
    is_admin: true,
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  if (profileError) {
    console.error("⚠️ Failed to insert admin profile:", profileError.message);
  }

  console.log("✅ Default Admin created successfully:");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${defaultPassword}`);
}

