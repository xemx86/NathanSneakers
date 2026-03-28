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

/* Pobranie wszystkich produktów z Supabase */
export async function readProductsFile(): Promise<ProductRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase readProductsFile error:", error.message);
    return [];
  }

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
  const supabase = await createClient();

  let query = supabase.from("products").select("*").eq("is_active", true);

  if (options.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.color) {
    query = query.eq("color", options.color);
  }

  if (options.material) {
    query = query.eq("material", options.material);
  }

  if (options.sizeSystem) {
    query = query.eq("size_system", options.sizeSystem);
  }

  /* Obsługa search i q jako aliasów */
  const rawSearch = options.search ?? options.q ?? "";
  const normalizedSearch = rawSearch.trim();

  if (normalizedSearch) {
    query = query.or(
      `name.ilike.%${normalizedSearch}%,brand.ilike.%${normalizedSearch}%,description.ilike.%${normalizedSearch}%`
    );
  }

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

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase listProducts error:", error.message);
    return [];
  }

  return (data ?? []) as ProductRow[];
}

/* Pobranie jednego produktu po slug */
export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Supabase getProductBySlug error:", error.message);
    return null;
  }

  return (data as ProductRow | null) ?? null;
}

/* Pobranie danych do filtrów */
export async function listTaxonomy() {
  const products = await listProducts({ limit: 500 });

  const categories = [
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ].sort() as string[];

  const colors = [
    ...new Set(products.map((item) => item.color).filter(Boolean)),
  ].sort() as string[];

  const materials = [
    ...new Set(products.map((item) => item.material).filter(Boolean)),
  ].sort() as string[];

  const sizeSystems = [
    ...new Set(products.map((item) => item.size_system).filter(Boolean)),
  ].sort() as string[];

  return { categories, colors, materials, sizeSystems };
}
