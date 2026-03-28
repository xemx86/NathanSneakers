"use client";

/* Komponent zapisuje wejście na stronę konkretnego produktu */

import { useEffect } from "react";

type Props = {
  /* Slug produktu */
  slug: string;
};

export function ProductViewTracker({ slug }: Props) {
  useEffect(() => {
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
        console.error("Błąd trackowania produktu:", error);
      }
    }

    if (slug) {
      trackProductView();
    }
  }, [slug]);

  return null;
}