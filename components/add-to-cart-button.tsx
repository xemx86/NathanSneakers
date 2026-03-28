"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { ProductRow } from "@/types/store";
import { Locale } from "@/lib/i18n";

const ui = {
  en: {
    addToCart: "Add to cart",
    added: "Added",
  },
  es: {
    addToCart: "Añadir al carrito",
    added: "Añadido",
  },
};

export function AddToCartButton({
  product,
  lang,
}: {
  product: ProductRow;
  lang: Locale;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const t = ui[lang];

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      imageUrl: product.image_url,
      size: product.sizes?.[0] || undefined,
      price: product.sale_price ?? product.price,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button type="button" className="button-secondary" onClick={handleAdd}>
      {added ? t.added : t.addToCart}
    </button>
  );
}