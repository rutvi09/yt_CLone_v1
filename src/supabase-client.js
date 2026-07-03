import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://avllucfgjningxrdrxql.supabase.co";
const supabaseKey = "sb_publishable_hyPGsqt4Q2MtQh6_66ZgDA_jWVnGB40";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);