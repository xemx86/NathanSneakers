"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();

  const pathWithoutLang =
    pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "";

  return (
    <div style={{ display: "inline-flex", gap: 8 }}>
      <Link href={`/en${pathWithoutLang || ""}`}>EN</Link>
      <Link href={`/es${pathWithoutLang || ""}`}>ES</Link>
    </div>
  );
}