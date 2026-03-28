export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  description?: string;
  image_url?: string | null;
  image_urls?: string[] | null;
  category?: string;
  color?: string;
  material?: string;
  price: number;
  sale_price?: number | null;
  sizes?: string[] | null;

  /* Dodatkowe rozmiary męskie */
  sizes_men?: string[] | null;

  /* Dodatkowe rozmiary damskie */
  sizes_women?: string[] | null;

  is_featured?: boolean;
  is_active?: boolean;
  created_at?: string;

  /* Dla kogo jest produkt */
  audience?: "men" | "women" | "kids" | "unisex";

  /* Jak interpretować rozmiary */
  size_system?: "men" | "women" | "kids" | "unisex" | "men_women";
};

export type ProfileRow = {
  id: string;
  email: string;
  role: "admin" | "customer";
};