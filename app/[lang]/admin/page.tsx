export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { listProducts } from "@/lib/products";
import { getCurrentProfile } from "@/lib/auth";
import { ProductAdminForm } from "@/components/product-admin-form";
import { ProductAdminList } from "@/components/product-admin-list";
import { Locale } from "@/lib/i18n";

type SearchParams = {
  edit?: string;
};

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<SearchParams>;
}) {
  /* Wyłączamy cache dla tej strony */
  noStore();

  /* Pobranie aktualnego języka */
  const { lang } = await params;

  /* Pobranie parametrów z URL */
  const query = await searchParams;

  /* Sprawdzenie aktualnie zalogowanego użytkownika */
  const profile = await getCurrentProfile();

  /* Jeśli user nie jest adminem, przekierowujemy go */
  if (!profile || profile.role !== "admin") {
    redirect(`/${lang}`);
  }

  /* Pobranie wszystkich produktów */
  const products = await listProducts();

  /* ID produktu przekazane w URL */
  const editId = query.edit ?? "";

  /* Szukamy produktu do edycji */
  const productToEdit =
    products.find((product) => product.id === editId) ?? undefined;

  /* Tryb formularza */
  const formMode = productToEdit ? "update" : "create";

return (
  <div className="container">
    <div style={{ marginBottom: 20 }}>
      <Link href={`/${lang}/sklep`} className="button-secondary">
        {lang === "es" ? "Volver a la tienda" : "Back to shop"}
      </Link>
    </div>

    {/* 🔥 DEBUG — dodaj tutaj */}
    <div
      style={{
        marginBottom: 16,
        padding: 12,
        background: "#111",
        color: "#fff",
        borderRadius: 8,
      }}
    >
      <div>editId: {editId || "brak"}</div>
      <div>matched: {productToEdit?.name ?? "NOT FOUND"}</div>
      <div>mode: {formMode}</div>
    </div>

    {/* FORMULARZ */}
    <ProductAdminForm
      key={productToEdit?.id ?? "create-product"}
      mode={formMode}
      product={productToEdit}
    />

    <div style={{ marginTop: 32 }}>
      <ProductAdminList products={products} />
    </div>
  </div>
);
