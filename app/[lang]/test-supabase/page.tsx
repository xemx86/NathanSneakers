import { createClient } from "@/utils/supabase/server";

type Product = {
  id: string;
  name: string;
  brand: string;
  slug: string;
  price: number;
  sale_price: number | null;
  size_system: "men" | "women" | "kids" | "men_women" | null;
};

export default async function TestSupabasePage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, brand, slug, price, sale_price, size_system")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>Supabase products test</h1>
        <p>Błąd: {error.message}</p>
      </main>
    );
  }

  const products = (data ?? []) as Product[];

  return (
    <main style={{ padding: "24px" }}>
      <h1>Supabase products test</h1>

      {products.length === 0 ? (
        <p>Brak produktów w tabeli products.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id} style={{ marginBottom: "12px" }}>
              <strong>{product.brand}</strong> — {product.name} — ${product.sale_price ?? product.price} — {product.size_system ?? "n/a"}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}