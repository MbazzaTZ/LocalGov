import { createClient } from "@supabase/supabase-js";

// ✅ Environment variables from .env.local
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables.");
  throw new Error("Supabase URL or Key missing in .env.local file.");
}

// ✅ Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("✅ Supabase initialized successfully:", supabaseUrl);
