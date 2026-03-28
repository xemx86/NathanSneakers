"use client";

/* Link do produktu, który zapisuje kliknięcie tylko raz na sesję.
   Dzięki temu jeden użytkownik nie nabije wielu kliknięć
   na ten sam produkt podczas jednej sesji przeglądarki. */

import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";

type Props = {
  /* Docelowy adres produktu */
  href: string;

  /* Slug produktu */
  slug: string;

  /* Zawartość linku */
  children: ReactNode;

  /* Opcjonalne klasy CSS */
  className?: string;
};

export function ProductClickLink({
  href,
  slug,
  children,
  className,
}: Props) {
  /* Obsługa kliknięcia w link produktu */
  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    try {
      /* Jeżeli slug jest pusty, nic nie robimy */
      if (!slug) return;

      /* Klucz zapisany w sessionStorage dla danego produktu */
      const storageKey = `product-clicked:${slug}`;

      /* Sprawdzamy, czy ten produkt był już kliknięty w tej sesji */
      const alreadyTracked = sessionStorage.getItem(storageKey);

      /* Jeżeli kliknięcie było już zapisane, kończymy */
      if (alreadyTracked === "true") {
        return;
      }

      /* Wysyłamy kliknięcie do API */
      const response = await fetch("/api/track-product-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      /* Jeśli zapis się udał, oznaczamy produkt jako kliknięty w tej sesji */
      if (response.ok) {
        sessionStorage.setItem(storageKey, "true");
      }
    } catch (error) {
      /* Nie blokujemy przejścia do produktu, tylko logujemy błąd */
      console.error("Błąd trackowania kliknięcia produktu:", error);
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}