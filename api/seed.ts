import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", "admin@localgov.co.tz")
    .maybeSingle();

  if (existing) {
    return res.status(200).json({ message: "Already seeded" });
  }

  // You can reuse logic from the file above
  res.status(200).json({ message: "Seeding started..." });
}

