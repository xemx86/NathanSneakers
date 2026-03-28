import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { ProfileRow } from "@/types/store";

/* Pobiera aktualnie zalogowany profil użytkownika z Supabase */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  /* Pobranie cookies z aktualnego requestu */
  const cookieStore = await cookies();

  /* Pobranie danych środowiskowych Supabase */
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  /* Jeśli brakuje envów, nie próbujemy robić auth */
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  /* Tworzymy serwerowego klienta Supabase */
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      /* Odczyt wszystkich cookies potrzebnych do sesji */
      getAll() {
        return cookieStore.getAll();
      },

      /* W tym helperze tylko odczytujemy sesję, więc nic nie zapisujemy */
      setAll() {
        /* Intencjonalnie puste */
      },
    },
  });

  /* Pobranie aktualnie zalogowanego użytkownika z Supabase Auth */
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  /* Jeśli nie ma użytkownika albo wystąpił błąd, zwracamy null */
  if (userError || !user) {
    return null;
  }

  /* Szukamy profilu użytkownika w tabeli profiles po id z auth.users */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  /* Jeśli profil nie istnieje albo zapytanie się wywaliło, zwracamy null */
  if (profileError || !profile) {
    return null;
  }

  /* Zwracamy gotowy profil */
  return profile as ProfileRow;
}
