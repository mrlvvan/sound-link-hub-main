import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase: не заданы VITE_SUPABASE_URL или VITE_SUPABASE_ANON_KEY. Проверь .env и перезапусти npm run dev"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
