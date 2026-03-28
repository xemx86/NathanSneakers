import "server-only";

import { createClient } from "@/utils/supabase/server";
import { ProductRow } from "@/types/store";

/* Typ opcji filtrowania listy produktów */
type ListOptions = {
  /* Maksymalna liczba zwracanych produktów */
  limit?: number;

  /* Czy pokazywać tylko wyróżnione produkty */
  featuredOnly?: boolean;

  /* Wyszukiwanie tekstowe */
  search?: string;

  /* Filtr kategorii */
  category?: string;

  /* Filtr koloru */
  color?: string;

  /* Filtr materiału */
  material?: string;

  /* Filtr systemu rozmiarowego: Men / Women / Men & Women */
  sizeSystem?: string;

  /* Typ sortowania */
  sort?: string;
};

/* Pobranie wszystkich produktów z Supabase */
export async function readProductsFile(): Promise<ProductRow[]> {
  /* Tworzymy klienta Supabase po stronie serwera */
  const supabase = await createClient();

  /* Pobieramy wszystkie produkty */
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  /* Jeśli coś poszło nie tak, zwracamy pustą tablicę */
  if (error) {
    console.error("Supabase readProductsFile error:", error.message);
    return [];
  }

  /* Zwracamy dane albo pustą tablicę */
  return (data ?? []) as ProductRow[];
}

/* Tymczasowy placeholder zamiast zapisu do pliku JSON
   Na razie nie zapisujemy do Supabase z tego miejsca */
export async function writeProductsFile(_products: ProductRow[]): Promise<void> {
  throw new Error(
    "writeProductsFile is no longer used. Products are now stored in Supabase."
  );
}

/* Główna funkcja pobierająca listę produktów z filtrami */
export async function listProducts(options: ListOptions = {}): Promise<ProductRow[]> {
  /* Tworzymy klienta Supabase */
  const supabase = await createClient();

  /* Budujemy zapytanie od aktywnych produktów */
  let query = supabase.from("products").select("*").eq("is_active", true);

  /* Filtr tylko dla produktów wyróżnionych */
  if (options.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  /* Filtrowanie po kategorii */
  if (options.category) {
    query = query.eq("category", options.category);
  }

  /* Filtrowanie po kolorze */
  if (options.color) {
    query = query.eq("color", options.color);
  }

  /* Filtrowanie po materiale */
  if (options.material) {
    query = query.eq("material", options.material);
  }

  /* Filtrowanie po systemie rozmiarowym */
  if (options.sizeSystem) {
    query = query.eq("size_system", options.sizeSystem);
  }

  /* Wyszukiwanie tekstowe po nazwie, marce i opisie
     Używamy ilike, żeby działało podobnie do wcześniejszego search */
  if (options.search) {
    const search = options.search.trim();

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`
      );
    }
  }

  /* Sortowanie produktów */
  switch (options.sort) {
    case "price_asc":
      /* Cena rosnąco */
      query = query.order("price", { ascending: true });
      break;

    case "price_desc":
      /* Cena malejąco */
      query = query.order("price", { ascending: false });
      break;

    case "name_asc":
      /* Nazwa alfabetycznie */
      query = query.order("name", { ascending: true });
      break;

    default:
      /* Domyślnie: najnowsze produkty pierwsze */
      query = query.order("created_at", { ascending: false });
      break;
  }

  /* Ograniczenie liczby wyników */
  if (options.limit) {
    query = query.limit(options.limit);
  }

  /* Wykonujemy zapytanie */
  const { data, error } = await query;

  /* Obsługa błędu */
  if (error) {
    console.error("Supabase listProducts error:", error.message);
    return [];
  }

  /* Zwracamy gotową listę produktów */
  return (data ?? []) as ProductRow[];
}

/* Pobranie jednego produktu po slug */
export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  /* Tworzymy klienta Supabase */
  const supabase = await createClient();

  /* Pobieramy pojedynczy aktywny produkt */
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  /* Jeśli błąd lub brak produktu, zwracamy null */
  if (error) {
    console.error("Supabase getProductBySlug error:", error.message);
    return null;
  }

  return (data as ProductRow | null) ?? null;
}

/* Pobranie danych do filtrów */
export async function listTaxonomy() {
  /* Pobieramy większą pulę aktywnych produktów */
  const products = await listProducts({ limit: 500 });

  /* Unikalne kategorie */
  const categories = [
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ].sort() as string[];

  /* Unikalne kolory */
  const colors = [
    ...new Set(products.map((item) => item.color).filter(Boolean)),
  ].sort() as string[];

  /* Unikalne materiały */
  const materials = [
    ...new Set(products.map((item) => item.material).filter(Boolean)),
  ].sort() as string[];

  /* Unikalne systemy rozmiarowe */
  const sizeSystems = [
    ...new Set(products.map((item) => item.size_system).filter(Boolean)),
  ].sort() as string[];

  return { categories, colors, materials, sizeSystems };
}