"use client";

/* Komponent zapisuje wejście na stronę konkretnego produktu.
   Po załadowaniu strony wysyła request do API z slug produktu. */

import { useEffect } from "react";

/* Typ propsów komponentu */
type Props = {
  /* Slug produktu, który chcemy zliczać */
  slug: string;
};

export function ProductViewTracker({ slug }: Props) {
  useEffect(() => {
    /* Funkcja wysyła request do endpointu API */
    async function trackProductView() {
      try {
        await fetch("/api/track-product-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });
      } catch (error) {
        /* Błąd tylko logujemy — nie chcemy psuć strony przez analytics */
        console.error("Błąd trackowania produktu:", error);
      }
    }

    /* Jeżeli slug istnieje, wysyłamy zapis wyświetlenia */
    if (slug) {
      trackProductView();
    }
  }, [slug]);

  /* Komponent nic nie renderuje */
  return null;
}