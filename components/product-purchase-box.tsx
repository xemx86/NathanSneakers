"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
import { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    image_url: string | null;
    sizes: string[];
    price: number;
    sale_price: number | null;
  };
};

const ui = {
  en: {
    chooseSize: "Choose size",
    addToCart: "Add to cart",
    addedToCart: "Added to cart",
    goToCart: "Go to cart",
  },
  es: {
    chooseSize: "Elegir talla",
    addToCart: "Añadir al carrito",
    addedToCart: "Añadido al carrito",
    goToCart: "Ir al carrito",
  },
};

export function ProductPurchaseBox({ product, lang }: Props) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [added, setAdded] = useState(false);
  const t = ui[lang];

  const activePrice = useMemo(
    () => product.sale_price ?? product.price,
    [product.price, product.sale_price]
  );

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      imageUrl: product.image_url,
      size: selectedSize || undefined,
      price: activePrice,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="purchase-box">
      <div className="price-row">
        <span className="price">{formatPrice(activePrice)}</span>
        {product.sale_price ? (
          <span className="price--old">{formatPrice(product.price)}</span>
        ) : null}
      </div>

      {product.sizes.length > 0 ? (
        <div className="size-picker">
          <div className="size-picker__label">{t.chooseSize}</div>
          <div className="size-row">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={selectedSize === size ? "size-pill size-pill--active" : "size-pill"}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="inline-actions inline-actions--stretch">
        <button className="button" type="button" onClick={handleAdd}>
          {added ? t.addedToCart : t.addToCart}
        </button>

        <Link className="button-secondary" href={`/${lang}/koszyk`}>
          {t.goToCart}
        </Link>
      </div>
    </div>
  );
}