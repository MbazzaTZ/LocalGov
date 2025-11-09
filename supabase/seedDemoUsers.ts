/**
 * 🧩 seedDemoUsers.ts
 * -----------------------------------------------------
 * Run this script manually (or via API route) to
 * create default admin, district, ward, and staff accounts.
 *
 * ⚠️ Uses Service Role Key — DO NOT import in frontend.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const demoAccounts = [
  {
    email: "admin@localgov.co.tz",
    password: "LocalGov@123",
    role: "Admin",
    full_name: "System Administrator",
    district: "National HQ",
    ward: null,
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
    full_name: "Local Staff Member",
    district: "Ilala",
    ward: "Kariakoo",
    is_admin: false,
  },
];

async function seedUsers() {
  console.log("🚀 Starting demo user seeding...");

  for (const acc of demoAccounts) {
    try {
      const { data: existing, error: checkErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", acc.email)
        .single();

      if (existing) {
        console.log(`✅ ${acc.role} already exists: ${acc.email}`);
        continue;
      }

      console.log(`🧩 Creating ${acc.role} account: ${acc.email}`);

      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: {
          role: acc.role,
          is_verified: true,
        },
      });

      if (createErr) {
        console.error(`❌ Failed to create ${acc.role}:`, createErr.message);
        continue;
      }

      const userId = newUser.user?.id;
      if (!userId) continue;

      const { error: profileErr } = await supabase.from("profiles").upsert({
        id: userId,
        email: acc.email,
        full_name: acc.full_name,
        role: acc.role,
        district: acc.district,
        ward: acc.ward,
        is_admin: acc.is_admin,
        is_verified: true,
        must_change_password: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      if (profileErr) {
        console.error(`⚠️ Failed to create profile for ${acc.role}:`, profileErr.message);
      } else {
        console.log(`✅ ${acc.role} seeded successfully: ${acc.email}`);
      }
    } catch (err: any) {
      console.error(`❌ Unexpected error for ${acc.role}:`, err.message);
    }
  }

  console.log("🎉 Seeding complete!");
}

seedUsers();

