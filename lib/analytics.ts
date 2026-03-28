/* Funkcje do lokalnej analityki strony.
   Na razie zapisujemy dane do pliku JSON.
   Później to łatwo zamienimy na Supabase. */

import { promises as fs } from "fs";
import path from "path";

/* Typ danych analytics zapisanych w pliku */
type AnalyticsData = {
  /* Łączna liczba wyświetleń strony */
  totalViews: number;

  /* Liczba wyświetleń konkretnych produktów po slug */
  productViews: Record<string, number>;

  /* Liczba kliknięć konkretnych produktów po slug */
  productClicks: Record<string, number>;
};

/* Ścieżka do pliku analytics */
const analyticsFilePath = path.join(process.cwd(), "data", "analytics.json");

/* Odczyt danych analytics z pliku */
export async function readAnalyticsFile(): Promise<AnalyticsData> {
  try {
    /* Czytamy plik JSON */
    const file = await fs.readFile(analyticsFilePath, "utf-8");

    /* Parsujemy dane */
    const data = JSON.parse(file);

    /* Zwracamy poprawny obiekt */
    return {
      /* Łączna liczba wyświetleń strony */
      totalViews: Number(data?.totalViews ?? 0),

      /* Wyświetlenia produktów po slug */
      productViews:
        data?.productViews && typeof data.productViews === "object"
          ? data.productViews
          : {},

      /* Kliknięcia produktów po slug */
      productClicks:
        data?.productClicks && typeof data.productClicks === "object"
          ? data.productClicks
          : {},
    };
  } catch {
    /* Jeśli plik nie istnieje lub jest uszkodzony, zwracamy domyślne dane */
    return {
      /* Domyślna liczba wyświetleń strony */
      totalViews: 0,

      /* Domyślnie brak wyświetleń produktów */
      productViews: {},

      /* Domyślnie brak kliknięć produktów */
      productClicks: {},
    };
  }
}

/* Zapis danych analytics do pliku */
export async function writeAnalyticsFile(data: AnalyticsData): Promise<void> {
  await fs.writeFile(analyticsFilePath, JSON.stringify(data, null, 2), "utf-8");
}

/* Zwiększenie licznika wszystkich wyświetleń o 1 */
export async function incrementPageViews(): Promise<number> {
  /* Odczyt aktualnych danych */
  const currentData = await readAnalyticsFile();

  /* Zwiększamy licznik */
  const updatedData: AnalyticsData = {
    ...currentData,
    totalViews: currentData.totalViews + 1,
  };

  /* Zapisujemy nowe dane */
  await writeAnalyticsFile(updatedData);

  /* Zwracamy nową wartość licznika */
  return updatedData.totalViews;
}

/* Zwiększenie licznika wyświetleń konkretnego produktu */
export async function incrementProductViews(slug: string): Promise<number> {
  /* Odczyt aktualnych danych */
  const currentData = await readAnalyticsFile();

  /* Aktualna liczba wyświetleń dla danego produktu */
  const currentProductViews = currentData.productViews[slug] ?? 0;

  /* Tworzymy nowy obiekt danych */
  const updatedData: AnalyticsData = {
    ...currentData,
    productViews: {
      ...currentData.productViews,
      [slug]: currentProductViews + 1,
    },
  };

  /* Zapisujemy nowe dane */
  await writeAnalyticsFile(updatedData);

  /* Zwracamy nową liczbę wyświetleń produktu */
  return updatedData.productViews[slug];
}

/* Pobranie łącznej liczby wyświetleń */
export async function getTotalPageViews(): Promise<number> {
  const data = await readAnalyticsFile();
  return data.totalViews;
}

/* Pobranie rankingu najczęściej oglądanych produktów */
export async function getTopViewedProducts(limit = 10) {
  /* Odczyt danych */
  const data = await readAnalyticsFile();

  /* Zamieniamy obiekt productViews na tablicę i sortujemy malejąco */
  return Object.entries(data.productViews)
    .map(([slug, views]) => ({
      slug,
      views,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}
/* Zwiększenie licznika kliknięć konkretnego produktu */
export async function incrementProductClicks(slug: string): Promise<number> {
  /* Odczyt aktualnych danych */
  const currentData = await readAnalyticsFile();

  /* Aktualna liczba kliknięć dla danego produktu */
  const currentProductClicks = currentData.productClicks[slug] ?? 0;

  /* Tworzymy nowy obiekt danych */
  const updatedData: AnalyticsData = {
    ...currentData,
    productClicks: {
      ...currentData.productClicks,
      [slug]: currentProductClicks + 1,
    },
  };

  /* Zapisujemy nowe dane */
  await writeAnalyticsFile(updatedData);

  /* Zwracamy nową liczbę kliknięć produktu */
  return updatedData.productClicks[slug];
}

/* Pobranie rankingu najczęściej klikanych produktów */
export async function getTopClickedProducts(limit = 10) {
  /* Odczyt danych */
  const data = await readAnalyticsFile();

  /* Zamieniamy obiekt productClicks na tablicę i sortujemy malejąco */
  return Object.entries(data.productClicks)
    .map(([slug, clicks]) => ({
      slug,
      clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit);
}