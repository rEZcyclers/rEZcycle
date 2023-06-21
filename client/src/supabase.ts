import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL ="https://rtgficcuqderxusnmkkh.supabase.co"
// Supabase Public API Key, so it's fine for everyone to see
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Z2ZpY2N1cWRlcnh1c25ta2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUwNzI0NjcsImV4cCI6MjAwMDY0ODQ2N30.2L7pCi3tu8PRoDRFeCFvS6KPEIqxLi9OqVcVVv-ZtFk";

// supabase account for testing
export const supabase = createClient(SUPABASE_URL,SUPABASE_KEY);
