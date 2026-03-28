import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { lang } = await params;

  // Tworzymy klienta Supabase po stronie serwera
  const supabase = await createClient();

  // Pobieramy aktualnego użytkownika
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jeśli użytkownik już jest zalogowany, nie pokazujemy formularza
  if (user) {
    redirect(`/${lang}/admin`);
  }

  // Jeśli nie jest zalogowany, pokazujemy tylko prosty ekran logowania
  return <LoginForm lang={lang} />;
}
