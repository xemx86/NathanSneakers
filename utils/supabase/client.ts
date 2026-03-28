<<<<<<< HEAD
// Tworzy klienta Supabase po stronie przeglądarki.
// Używaj tego w komponentach klienckich ("use client").

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
=======
// Tworzy klienta Supabase po stronie przeglądarki.
// Używaj tego w komponentach klienckich ("use client").

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
>>>>>>> c5b2a6c (Add Supabase integration and products setup)
}