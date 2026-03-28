"use client";

import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";

export function SignOutButton({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const router = useRouter();

  function handleSignOut() {
    /* Lokalny logout – tylko odświeżenie aplikacji */
    router.refresh();
    router.push(`/${lang}`);
  }

  return (
    <button type="button" onClick={handleSignOut}>
      {label}
    </button>
  );
}