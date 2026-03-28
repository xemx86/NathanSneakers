"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { createClient } from "@/supabase/client";

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

  /* Teksty zależne od języka */
  const t = ui[lang];

  /* Stan pól formularza */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Stan logowania i błędu */
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    /* Blokujemy przeładowanie strony */
    e.preventDefault();

    /* Czyścimy stary błąd i ustawiamy loading */
    setLoading(true);
    setErrorMessage("");

    try {
      /* Tworzymy klienta Supabase po stronie przeglądarki */
      const supabase = createClient();

      /* Próba logowania użytkownika */
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      /* Jeśli Supabase zwrócił błąd, pokazujemy dokładny komunikat */
      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      /* Dodatkowy bezpiecznik */
      if (!data.session) {
        setErrorMessage("No session returned from Supabase.");
        setLoading(false);
        return;
      }

      /* Po poprawnym logowaniu przechodzimy do panelu admina */
      router.push(`/${lang}/admin`);
      router.refresh();
    } catch (error) {
      /* Obsługa nieprzewidzianych błędów */
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
