/* Akcje produktów — zapis, edycja i usuwanie */
"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth";
import { listProducts, writeProductsFile } from "@/lib/products";
import { parseSizes } from "@/lib/utils";
import type { ProductRow } from "@/types/store";

export type ProductActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

/* Sprawdzenie uprawnień admina */
async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    throw new Error("Brak dostępu admina.");
  }

  return profile;
}

/* Czyszczenie dodatkowych URL-i zdjęć */
function parseImageUrls(values: FormDataEntryValue[]) {
  return Array.from(
    new Set(
      values
        .map((item) => String(item).trim())
        .filter(Boolean)
    )
  );
}

/* Budowanie payloadu produktu z formularza */
/* Budowanie payloadu produktu z formularza */
function getProductPayload(formData: FormData) {
  /* Cena promocyjna z formularza */
  const salePriceRaw = String(formData.get("sale_price") || "").trim();

  /* Wszystkie dodatkowe URL-e zdjęć */
  const imageUrlsRaw = formData.getAll("image_urls");

  /* Audience mówi komu produkt jest dedykowany */
  const audienceRaw = String(formData.get("audience") || "unisex").trim();

  /* System rozmiarowy mówi jak interpretować rozmiary */
  const sizeSystemRaw = String(formData.get("size_system") || "unisex").trim();

  /* Dodatkowe rozmiary męskie */
  const sizes_men = parseSizes(String(formData.get("sizes_men") || ""));

  /* Dodatkowe rozmiary damskie */
  const sizes_women = parseSizes(String(formData.get("sizes_women") || ""));

  /* Walidacja audience */
  const audience =
    audienceRaw === "men" ||
    audienceRaw === "women" ||
    audienceRaw === "kids" ||
    audienceRaw === "unisex"
      ? audienceRaw
      : "unisex";

  /* Walidacja systemu rozmiarowego */
/* Walidacja systemu rozmiarowego */
const size_system =
  sizeSystemRaw === "men" ||
  sizeSystemRaw === "women" ||
  sizeSystemRaw === "kids" ||
  sizeSystemRaw === "men_women"
    ? sizeSystemRaw
    : "men";
      

  return {
    /* Podstawowe dane produktu */
    name: String(formData.get("name") || "").trim(),
    slug: String(formData.get("slug") || "").trim().toLowerCase(),
    brand: String(formData.get("brand") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    color: String(formData.get("color") || "").trim(),
    material: String(formData.get("material") || "").trim(),
    description: String(formData.get("description") || "").trim(),

    /* Zdjęcia */
    image_url: String(formData.get("image_url") || "").trim() || null,
    image_urls: parseImageUrls(imageUrlsRaw),

    /* Ceny */
    price: Number(formData.get("price") || 0),
    sale_price: salePriceRaw ? Number(salePriceRaw) : null,

    /* Rozmiary */
    sizes: parseSizes(String(formData.get("sizes") || "")),
    sizes_men,
    sizes_women,

    /* Typ produktu i sposób czytania rozmiarów */
    audience,
    size_system,

    /* Flagi */
    is_featured: formData.get("is_featured") === "on",
  };
}

/* Odświeżenie stron sklepu po zmianach */
function revalidateStorePaths(slug?: string) {
  const paths = [
    "/",
    "/sklep",
    "/admin",
    "/en",
    "/es",
    "/en/sklep",
    "/es/sklep",
    "/en/admin",
    "/es/admin",
  ];

  if (slug) {
    paths.push(`/produkt/${slug}`);
    paths.push(`/en/produkt/${slug}`);
    paths.push(`/es/produkt/${slug}`);
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}

/* Dodanie nowego produktu */
export async function createProductAction(
  _: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    await requireAdmin();
    const payload = getProductPayload(formData);

    if (!payload.name || !payload.slug) {
      return { status: "error", message: "Nazwa i slug są wymagane." };
    }

    const products = await listProducts({ limit: 10000 });

    const slugExists = products.some((item) => item.slug === payload.slug);
    if (slugExists) {
      return { status: "error", message: "Produkt z takim slug już istnieje." };
    }

    const newProduct = {
      id: randomUUID(),
      ...payload,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    await writeProductsFile([newProduct, ...products]);

    revalidateStorePaths(payload.slug);

    return { status: "success", message: "Produkt został dodany." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się dodać produktu.",
    };
  }
}

/* Aktualizacja istniejącego produktu */
export async function updateProductAction(
  _: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    await requireAdmin();
    const id = String(formData.get("id") || "");
    const payload = getProductPayload(formData);

    if (!id) {
      return { status: "error", message: "Brakuje ID produktu." };
    }

    const products = await listProducts({ limit: 10000 });
    const productExists = products.some((item) => item.id === id);

    if (!productExists) {
      return { status: "error", message: "Nie znaleziono produktu." };
    }

    const slugTaken = products.some(
      (item) => item.slug === payload.slug && item.id !== id
    );

    if (slugTaken) {
      return { status: "error", message: "Inny produkt ma już taki slug." };
    }

    const updatedProducts = products.map((item) =>
      item.id === id ? { ...item, ...payload } : item
    );

    await writeProductsFile(updatedProducts);

    revalidateStorePaths(payload.slug);

    return { status: "success", message: "Zmiany zostały zapisane." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się zapisać zmian.",
    };
  }
}

/* Usunięcie produktu */
export async function deleteProductAction(
  _: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    await requireAdmin();
    const id = String(formData.get("id") || "");

    if (!id) {
      return { status: "error", message: "Brakuje ID produktu." };
    }

    const products = await listProducts({ limit: 10000 });
    const filteredProducts = products.filter((item) => item.id !== id);

    await writeProductsFile(filteredProducts);

    revalidateStorePaths();

    return { status: "success", message: "Produkt został usunięty." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się usunąć produktu.",
    };
    
  }
  
}
