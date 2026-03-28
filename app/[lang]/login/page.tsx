import { redirect, notFound } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { isLocale, type Locale } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/auth";

type Props = {
  params: Promise<{ lang: string }>;
};

/* Strona logowania admina */
export default async function LoginPage({ params }: Props) {
  /* Pobranie języka z URL */
  const { lang } = await params;

  /* Blokada dla nieprawidłowego locale */
  if (!isLocale(lang)) {
    notFound();
  }

  /* Sprawdzenie aktualnie zalogowanego użytkownika */
  const profile = await getCurrentProfile();

  /* Jeśli user jest już adminem, przerzucamy go do panelu */
  if (profile?.role === "admin") {
    redirect(`/${lang}/admin`);
  }

  /* W przeciwnym razie pokazujemy formularz logowania */
  return <LoginForm lang={lang as Locale} />;
}
