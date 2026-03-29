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
    askOnWhatsapp: "Ask on WhatsApp",
  },
  es: {
    chooseSize: "Elegir talla",
    addToCart: "Añadir al carrito",
    addedToCart: "Añadido al carrito",
    goToCart: "Ir al carrito",
    askOnWhatsapp: "Preguntar por WhatsApp",
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

  function handleWhatsApp() {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    const productUrl = `${baseUrl}/${lang}/produkt/${product.slug}`;

    const message =
      lang === "es"
        ? `Hola, estoy interesado en este producto:%0A${product.name}%0ATalla: ${
            selectedSize || "No seleccionada"
          }%0APrecio: ${formatPrice(activePrice)}%0AEnlace: ${productUrl}%0A%0A¿Sigue disponible?`
        : `Hi, I'm interested in this product:%0A${product.name}%0ASize: ${
            selectedSize || "Not selected"
          }%0APrice: ${formatPrice(activePrice)}%0ALink: ${productUrl}%0A%0AIs it still available?`;

    const phone = "19563562096";
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          className="button-secondary"
          onClick={handleWhatsApp}
          style={{ width: "100%" }}
        >
          {t.askOnWhatsapp}
        </button>
      </div>
    </div>
  );
}
