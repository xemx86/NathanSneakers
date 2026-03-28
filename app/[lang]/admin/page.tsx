import Link from "next/link";
import { redirect } from "next/navigation";
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

  /* ID produktu przekazane w URL, np. /en/admin?edit=UUID */
  const editId = query.edit ?? "";

  /* Szukamy produktu, który ma zostać otwarty do edycji */
  const productToEdit =
    products.find((product) => product.id === editId) ?? null;

  return (
    <div className="container">
      {/* Formularz dostaje produkt do edycji */}
      <ProductAdminForm
        lang={lang}
        initialProduct={productToEdit}
      />

      {/* Lista produktów w panelu admina */}
      <ProductAdminList products={products} lang={lang} />
    </div>
  );
}
