import { notFound } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { isLocale, type Locale } from "@/lib/i18n";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <LoginForm lang={lang as Locale} />;
}
