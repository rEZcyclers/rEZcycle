import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLIC_KEY) {
  throw new Error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLIC_KEY in your .env file.",
  );
}

// supabase account for testing
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
