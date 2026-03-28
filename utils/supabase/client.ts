// Tworzy klienta Supabase po stronie przeglądarki.
// Używaj tego w komponentach klienckich ("use client").

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase env variables");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
