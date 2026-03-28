import { LoginForm } from "@/components/login-form";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container login-page">
      <div className="login-card status-card">
        <div className="eyebrow">{dict.auth.title}</div>
        <h1 style={{ marginTop: 10, marginBottom: 12 }}>{dict.auth.title}</h1>
        <p className="footer-muted">{dict.auth.description}</p>
        <LoginForm lang={lang} />
      </div>
    </div>
  );
}