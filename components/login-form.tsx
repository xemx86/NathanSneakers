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
    error: "Invalid email or password.",
  },
  es: {
    badge: "Login",
    title: "Login",
    info: "Inicia sesión con tu cuenta de administrador para acceder al panel de administración.",
    email: "Correo electrónico",
    password: "Contraseña",
    button: "Iniciar sesión",
    loading: "Iniciando sesión...",
    error: "Correo o contraseña incorrectos.",
  },
};

export function LoginForm({ lang }: { lang: Locale }) {
  const router = useRouter();
  const t = ui[lang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(t.error);
        setLoading(false);
        return;
      }

      router.push(`/${lang}/admin`);
      router.refresh();
    } catch {
      setError(t.error);
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

          {error ? <p className="auth-error">{error}</p> : null}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? t.loading : t.button}
          </button>
        </form>
      </div>
    </section>
  );
}
