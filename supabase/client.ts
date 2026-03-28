import { createBrowserClient } from "@supabase/ssr";

/* Tworzymy klienta Supabase po stronie przeglądarki */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
