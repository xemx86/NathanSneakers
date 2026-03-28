import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

export async function AuthStatus({ lang }: { lang: Locale }) {
  const profile = await getCurrentProfile();
  const dict = await getDictionary(lang);

  if (!profile) {
    return <Link href={`/${lang}/login`}>{dict.nav.login}</Link>;
  }

  return (
    <>
      <span className="footer-muted">{profile.email}</span>
      <SignOutButton lang={lang} label={dict.nav.logout} />
    </>
  );
}