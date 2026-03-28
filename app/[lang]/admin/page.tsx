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
    products.find((product) => product.id === editId) ?? undefined;

  /* Tryb formularza:
     - update, jeśli znaleźliśmy produkt do edycji
     - create, jeśli otwieramy pusty formularz dodawania */
  const formMode = productToEdit ? "update" : "create";

  return (
    <div className="container">
      {/* Link powrotu do sklepu */}
      <div style={{ marginBottom: 20 }}>
        <Link href={`/${lang}/sklep`} className="button-secondary">
          {lang === "es" ? "Volver a la tienda" : "Back to shop"}
        </Link>
      </div>

      {/* Formularz:
          - key wymusza odświeżenie komponentu przy zmianie produktu
          - mode decyduje czy dodajemy czy edytujemy
          - product przekazuje konkretny produkt do edycji */}
      <ProductAdminForm
        key={productToEdit?.id ?? "create-product"}
        mode={formMode}
        product={productToEdit}
      />

      {/* Lista produktów w panelu admina */}
      <div style={{ marginTop: 32 }}>
    /* Lista produktów w panelu admina */
<ProductAdminList products={products} />
      </div>
    </div>
  );
}
