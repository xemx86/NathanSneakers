/* Route do wylogowania użytkownika */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* Wylogowanie użytkownika i przekierowanie na stronę główną */
export async function POST() {
  /* Tworzymy klienta Supabase po stronie serwera */
  const supabase = await createClient();

  /* Wylogowanie */
  await supabase.auth.signOut();

  /* Przekierowanie po wylogowaniu */
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}