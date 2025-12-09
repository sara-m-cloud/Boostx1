import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;

export const getsupabase = () => {
  if (!supabaseClient) {
    if (!process.env.SUPABASE_URL) {
      throw new Error("SUPABASE_URL is missing");
    }

    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  return supabaseClient;
};
