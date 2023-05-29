import { createClient } from "@supabase/supabase-js";

// rEZcycle supabase
export const supabase = createClient(
  "https://rtgficcuqderxusnmkkh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Z2ZpY2N1cWRlcnh1c25ta2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUwNzI0NjcsImV4cCI6MjAwMDY0ODQ2N30.2L7pCi3tu8PRoDRFeCFvS6KPEIqxLi9OqVcVVv-ZtFk"
);
