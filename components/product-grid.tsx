import { ProductRow } from "@/types/store";
import { ProductCard } from "@/components/product-card";
import { Locale } from "@/lib/i18n";

export function ProductGrid({
  products,
  lang,
}: {
  products: ProductRow[];
  lang: Locale;
}) {
  /* Komunikat pustej listy zależny od wybranego języka */
  const emptyMessage =
    lang === "es"
      ? "No hay productos para los filtros seleccionados."
      : "No products found for the selected filters.";

  /* Jeżeli nie ma produktów, pokazujemy komunikat */
  if (products.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  /* Standardowy grid produktów */
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} lang={lang} />
      ))}
    </div>
  );
}