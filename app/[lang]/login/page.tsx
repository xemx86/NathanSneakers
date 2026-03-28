import { redirect, notFound } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { isLocale, type Locale } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/auth";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const profile = await getCurrentProfile();

  // Jeśli user już jest zalogowany, przekieruj do admina
  if (profile) {
    redirect(`/${lang}/admin`);
  }

  // Jeśli nie jest zalogowany, pokaż formularz
  return <LoginForm lang={lang as Locale} />;
}
