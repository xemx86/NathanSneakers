"use client";

/* Komponent wysyła request po wejściu na stronę,
   żeby zwiększyć licznik wyświetleń */

import { useEffect } from "react";

export function PageViewTracker() {
  useEffect(() => {
    /* Funkcja wysyła request do API */
    async function trackView() {
      try {
        await fetch("/api/track-view", {
          method: "POST",
        });
      } catch (error) {
        console.error("Błąd wysyłania view:", error);
      }
    }

    /* Wywołujemy trackowanie po załadowaniu komponentu */
    trackView();
  }, []);

  /* Ten komponent nic nie renderuje */
  return null;
}