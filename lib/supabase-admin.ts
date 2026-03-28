/* Klient Supabase tylko po stronie serwera.
   Używamy go do operacji administracyjnych, np. zapisu statystyk. */

import { createClient } from "@supabase/supabase-js";

/* Typ pomocniczy dla zmiennych środowiskowych */
function getEnv(name: string): string {
  const value = process.env[name];

  /* Jeśli brakuje zmiennej, rzucamy czytelny błąd */
  if (!value) {
    throw new Error(`Brakuje zmiennej środowiskowej: ${name}`);
  }

  return value;
}

/* Tworzymy klienta Supabase z kluczem serwisowym */
export function createSupabaseAdmin() {
  return createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}