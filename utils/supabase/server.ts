<<<<<<< HEAD
// Tworzy klienta Supabase po stronie serwera.
// Używaj tego w Server Components, Server Actions i route handlers.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // To może polecieć w Server Component i wtedy jest OK.
          // Middleware zajmie się odświeżaniem sesji.
        }
      },
    },
  });
=======
// Klient Supabase do użycia po stronie serwera.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in environment variables."
  );
}

export async function createClient() {
  const cookieStore = await cookies();

  console.log("SERVER URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("SERVER KEY:", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // W Server Components ustawianie cookies może być zablokowane.
          // To jest OK, bo middleware odświeża sesję.
        }
      },
    },
  });
>>>>>>> c5b2a6c (Add Supabase integration and products setup)
}