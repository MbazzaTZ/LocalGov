// api/seed-demo-users.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const demoAccounts = [
    { email: "admin@localgov.co.tz", password: "LocalGov@123", role: "Admin" },
    { email: "district@localgov.co.tz", password: "LocalGov@123", role: "District" },
    { email: "ward@localgov.co.tz", password: "LocalGov@123", role: "Ward" },
    { email: "staff@localgov.co.tz", password: "LocalGov@123", role: "Staff" }
  ];

  try {
    for (const acc of demoAccounts) {
      console.log(`🆕 Seeding ${acc.email}`);

      const { data: existing } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", acc.email)
        .single();

      if (existing) continue;

      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email: acc.email,
          password: acc.password,
          email_confirm: true
        });

      if (createError) {
        console.error("❌ Error creating user:", createError.message);
        continue;
      }

      const userId = newUser?.user?.id;
      if (!userId) continue;

      await supabase.from("profiles").upsert({
        id: userId,
        email: acc.email,
        full_name: `${acc.role} Demo User`,
        role: acc.role,
        district: acc.role === "District" ? "Demo District" : "",
        ward: acc.role === "Ward" ? "Demo Ward" : "",
        must_change_password: true,
        created_at: new Date().toISOString()
      });
    }

    return res.status(200).json({ message: "✅ Demo users created successfully" });
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
