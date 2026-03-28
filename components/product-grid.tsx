import { ProductCard } from "@/components/product-card";
import type { ProductRow } from "@/types/store";
import type { Locale } from "@/lib/i18n";

type Props = {
  products: ProductRow[];
  lang: Locale;
  isAdmin?: boolean; // informacja, czy user jest adminem
};

export function ProductGrid({ products, lang, isAdmin = false }: Props) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          lang={lang}
          isAdmin={isAdmin} // przekazujemy dalej do karty
        />
      ))}
    </div>
  );
}
