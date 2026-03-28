"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { createClient } from "@supabase/supabase-js";

const ui = {
  en: {
    badge: "Login",
    title: "Login",
    info: "Sign in with your admin account to access the admin panel.",
    email: "Email",
    password: "Password",
    button: "Sign in",
    loading: "Signing in...",
  },
  es: {
    badge: "Login",
    title: "Login",
    info: "Inicia sesión con tu cuenta de administrador para acceder al panel de administración.",
    email: "Correo electrónico",
    password: "Contraseña",
    button: "Iniciar sesión",
    loading: "Iniciando sesión...",
  },
};

export function LoginForm({ lang }: { lang: Locale }) {
  /* Router do przekierowania po poprawnym logowaniu */
  const router = useRouter();

  /* Teksty UI zależne od języka */
  const t = ui[lang];

  /* Stan formularza */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Stan ładowania i błędu */
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    /* Blokujemy standardowe przeładowanie formularza */
    e.preventDefault();

    /* Czyścimy stary błąd i ustawiamy loading */
    setLoading(true);
    setErrorMessage("");

    try {
      /* Pobranie konfiguracji Supabase z env */
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

      /* Tworzymy klienta Supabase po stronie przeglądarki */
      const supabase = createClient(supabaseUrl, supabaseKey);

      /* Próba logowania mailem i hasłem */
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      /* Jeśli Supabase zwrócił błąd, pokaż jego treść */
      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      /* Po poprawnym logowaniu przechodzimy do panelu admina */
      router.push(`/${lang}/admin`);
      router.refresh();
    } catch (error) {
      /* Fallback na nieprzewidziane wyjątki */
      setErrorMessage(
        error instanceof Error ? error.message : "Unexpected login error."
      );
      setLoading(false);
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-badge">{t.badge}</div>
        <h1 className="auth-title">{t.title}</h1>
        <p className="auth-subtitle">{t.info}</p>

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="auth-label">
            {t.email}
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            {t.password}
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? t.loading : t.button}
          </button>
        </form>
      </div>
    </section>
  );
}
