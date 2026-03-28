import { promises as fs } from "fs";
import path from "path";
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

  /* Filtr odbiorcy produktu: men / women / kids / unisex */
  audience?: string;

  /* Typ sortowania */
  sort?: string;
};

/* Ścieżka do lokalnego pliku z produktami */
const productsFilePath = path.join(process.cwd(), "data", "products.json");

/* Odczyt wszystkich produktów z pliku JSON */
export async function readProductsFile(): Promise<ProductRow[]> {
  try {
    /* Wczytanie pliku */
    const file = await fs.readFile(productsFilePath, "utf-8");

    /* Parsowanie JSON */
    const data = JSON.parse(file);

    /* Zwracamy tablicę produktów albo pustą tablicę */
    return Array.isArray(data) ? (data as ProductRow[]) : [];
  } catch {
    /* Jeśli plik nie istnieje albo JSON jest uszkodzony */
    return [];
  }
}

/* Zapis wszystkich produktów do pliku JSON */
export async function writeProductsFile(products: ProductRow[]): Promise<void> {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), "utf-8");
}

/* Główna funkcja pobierająca listę produktów z filtrami */
export async function listProducts(options: ListOptions = {}): Promise<ProductRow[]> {
  /* Na start pobieramy tylko aktywne produkty */
  let products = (await readProductsFile()).filter((product) => product.is_active);

  /* Filtr tylko dla produktów wyróżnionych */
  if (options.featuredOnly) {
    products = products.filter((product) => product.is_featured);
  }

  /* Wyszukiwanie tekstowe po nazwie, marce i opisie */
  if (options.search) {
    const search = options.search.toLowerCase();

    products = products.filter((product) =>
      [product.name, product.brand, product.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    );
  }

  /* Filtrowanie po kategorii */
  if (options.category) {
    products = products.filter((product) => product.category === options.category);
  }

  /* Filtrowanie po kolorze */
  if (options.color) {
    products = products.filter((product) => product.color === options.color);
  }

  /* Filtrowanie po materiale */
  if (options.material) {
    products = products.filter((product) => product.material === options.material);
  }

  /* Filtrowanie po odbiorcy produktu */
  if (options.audience) {
    products = products.filter((product) => product.audience === options.audience);
  }

  /* Sortowanie produktów */
  switch (options.sort) {
    case "price_asc":
      /* Cena rosnąco */
      products = [...products].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;

    case "price_desc":
      /* Cena malejąco */
      products = [...products].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;

    case "name_asc":
      /* Nazwa alfabetycznie */
      products = [...products].sort((a, b) => a.name.localeCompare(b.name));
      break;

    default:
      /* Domyślnie: najnowsze produkty pierwsze */
      products = [...products].sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      );
      break;
  }

  /* Ograniczenie liczby wyników */
  if (options.limit) {
    products = products.slice(0, options.limit);
  }

  return products;
}

/* Pobranie jednego produktu po slug */
export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const products = await readProductsFile();
  return products.find((item) => item.slug === slug && item.is_active) ?? null;
}

/* Pobranie danych do filtrów */
export async function listTaxonomy() {
  /* Pobieramy większą pulę produktów */
  const products = await listProducts({ limit: 500 });

  /* Unikalne kategorie */
  const categories = [...new Set(products.map((item) => item.category).filter(Boolean))].sort();

  /* Unikalne kolory */
  const colors = [...new Set(products.map((item) => item.color).filter(Boolean))].sort();

  /* Unikalne materiały */
  const materials = [...new Set(products.map((item) => item.material).filter(Boolean))].sort();

  return { categories, colors, materials };
}