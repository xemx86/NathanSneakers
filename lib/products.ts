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

  /* Alias dla wyszukiwania z query params, np. ?q=nike */
  q?: string;

  /* Filtr kategorii */
  category?: string;

  /* Filtr koloru */
  color?: string;

  /* Filtr materiału */
  material?: string;

  /* Filtr systemu rozmiarowego */
  sizeSystem?: string;

  /* Typ sortowania */
  sort?: string;
};

/* Funkcja pomocnicza do normalizacji slug */
function normalizeSlug(value: string): string {
  return decodeURIComponent(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/* Pobranie wszystkich produktów z Supabase */
export async function readProductsFile(): Promise<ProductRow[]> {
  /* Tworzymy klienta Supabase */
  const supabase = await createClient();

  /* Pobieramy wszystkie produkty, najnowsze na górze */
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  /* Obsługa błędu */
  if (error) {
    console.error("Supabase readProductsFile error:", error.message);
    return [];
  }

  /* Zwracamy listę produktów */
  return (data ?? []) as ProductRow[];
}

/* Placeholder po migracji z JSON */
export async function writeProductsFile(_products: ProductRow[]): Promise<void> {
  throw new Error(
    "writeProductsFile is no longer used. Products are now stored in Supabase."
  );
}

/* Główna funkcja pobierająca listę produktów z filtrami */
export async function listProducts(options: ListOptions = {}): Promise<ProductRow[]> {
  /* Tworzymy klienta Supabase */
  const supabase = await createClient();

  /* Bazowe zapytanie - tylko aktywne produkty */
  let query = supabase.from("products").select("*").eq("is_active", true);

  /* Filtr wyróżnionych produktów */
  if (options.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  /* Filtr kategorii */
  if (options.category) {
    query = query.eq("category", options.category);
  }

  /* Filtr koloru */
  if (options.color) {
    query = query.eq("color", options.color);
  }

  /* Filtr materiału */
  if (options.material) {
    query = query.eq("material", options.material);
  }

  /* Filtr systemu rozmiarowego */
  if (options.sizeSystem) {
    query = query.eq("size_system", options.sizeSystem);
  }

  /* Obsługa search i q jako aliasów */
  const rawSearch = options.search ?? options.q ?? "";
  const normalizedSearch = rawSearch.trim();

  /* Jeśli użytkownik wpisał tekst wyszukiwania, filtrujemy po name / brand / description */
  if (normalizedSearch) {
    query = query.or(
      `name.ilike.%${normalizedSearch}%,brand.ilike.%${normalizedSearch}%,description.ilike.%${normalizedSearch}%`
    );
  }

  /* Sortowanie */
  switch (options.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;

    case "price_desc":
      query = query.order("price", { ascending: false });
      break;

    case "name_asc":
      query = query.order("name", { ascending: true });
      break;

    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  /* Limit wyników */
  if (options.limit) {
    query = query.limit(options.limit);
  }

  /* Wykonanie zapytania */
  const { data, error } = await query;

  /* Obsługa błędu */
  if (error) {
    console.error("Supabase listProducts error:", error.message);
    return [];
  }

  /* Zwracamy listę produktów */
  return (data ?? []) as ProductRow[];
}

/* Pobranie jednego produktu po slug */
export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  /* Tworzymy klienta Supabase */
  const supabase = await createClient();

  /* Normalizujemy slug z URL */
  const normalizedSlug = normalizeSlug(slug);

  /* Szukamy aktywnego produktu po slug */
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", normalizedSlug)
    .eq("is_active", true)
    .maybeSingle();

  /* Logi pomocnicze do debugowania */
  console.log("Requested slug:", slug);
  console.log("Normalized slug:", normalizedSlug);
  console.log("Found product:", data);

  /* Obsługa błędu */
  if (error) {
    console.error("Supabase getProductBySlug error:", error.message);
    return null;
  }

  /* Zwracamy produkt lub null */
  return (data as ProductRow | null) ?? null;
}

/* Pobranie danych do filtrów */
export async function listTaxonomy() {
  /* Pobieramy większą pulę aktywnych produktów */
  const products = await listProducts({ limit: 500 });

  /* Lista kategorii */
  const categories = [
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ].sort() as string[];

  /* Lista kolorów */
  const colors = [
    ...new Set(products.map((item) => item.color).filter(Boolean)),
  ].sort() as string[];

  /* Lista materiałów */
  const materials = [
    ...new Set(products.map((item) => item.material).filter(Boolean)),
  ].sort() as string[];

  /* Lista systemów rozmiarowych */
  const sizeSystems = [
    ...new Set(products.map((item) => item.size_system).filter(Boolean)),
  ].sort() as string[];

  /* Zwracamy dane do filtrów */
  return { categories, colors, materials, sizeSystems };
}
