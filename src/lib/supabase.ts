import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * True once real Supabase credentials have been provided via
 * VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY (see .env.example).
 *
 * The rest of the app checks this flag instead of assuming the client is
 * usable, so the site can still build and render (including this Phase 1
 * auth UI) before a real Supabase project is wired up.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.error(
    "[LifeLens] Supabase is not configured. Set VITE_SUPABASE_URL and " +
      "VITE_SUPABASE_PUBLISHABLE_KEY in .env.local (see .env.example). " +
      "Authentication will not work until this is set.",
  );
}

// Only the browser-safe URL + publishable ("anon") key are ever used here.
// The service-role / secret key must never be imported into frontend code.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabasePublishableKey || "placeholder-anon-key",
);
