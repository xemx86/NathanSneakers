export type ProductSizeSystem = "men" | "women" | "kids" | "men_women";

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description?: string | null;

  /* Główne zdjęcie produktu */
  image_url?: string | null;

  /* Dodatkowe zdjęcia produktu */
  image_urls?: string[] | null;

  category?: string | null;
  color?: string | null;
  material?: string | null;

  price: number;
  sale_price?: number | null;

  /* Główna lista rozmiarów */
  sizes?: string[] | null;

  /* Opcjonalne osobne rozmiary */
  sizes_men?: string[] | null;
  sizes_women?: string[] | null;

  is_featured: boolean;
  is_active: boolean;

  created_at?: string | null;
  updated_at?: string | null;

  /* System rozmiarowy produktu */
  size_system?: ProductSizeSystem | null;
};

export type ProfileRow = {
  id: string;
  email: string;
  role: "admin" | "customer";
};