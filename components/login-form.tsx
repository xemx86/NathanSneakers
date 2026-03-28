"use client";

import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";

const ui = {
  en: {
    login: "Admin access",
    info: "Local mode without Supabase authentication.",
    button: "Go to admin panel",
  },
  es: {
    login: "Acceso admin",
    info: "Modo local sin autenticación de Supabase.",
    button: "Ir al panel de admin",
  },
};

export function LoginForm({ lang }: { lang: Locale }) {
  const router = useRouter();
  const t = ui[lang];

  function onGoAdmin() {
    router.push(`/${lang}/admin`);
    router.refresh();
  }

  return (
    <div className="admin-form">
      <div className="field">
        <p>{t.info}</p>
      </div>

      <button className="button" type="button" onClick={onGoAdmin}>
        {t.button}
      </button>
    </div>
  );
}