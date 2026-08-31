import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) || (typeof globalThis !== "undefined" && globalThis.process?.env?.VITE_SUPABASE_URL) || "https://omswfwxrurikthzqfrho.supabase.co";
const supabaseAnonKey = (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) || (typeof globalThis !== "undefined" && globalThis.process?.env?.VITE_SUPABASE_ANON_KEY) || "sb_publishable_GGkASiC_xjy1FTpGblzqGg_xQmzV3Zm";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
