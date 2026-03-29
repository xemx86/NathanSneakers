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

  /* Aktualna cena - promocyjna jeśli istnieje, w przeciwnym razie regularna */
  const activePrice = useMemo(
    () => product.sale_price ?? product.price,
    [product.price, product.sale_price]
  );

  /* Dodanie produktu do koszyka */
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

  /* Budujemy pełny link do produktu */
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://nathansneakers.onrender.com";

  const productUrl = `${siteUrl}/${lang}/produkt/${product.slug}`;

  /* Treść wiadomości do WhatsApp */
  const whatsappMessage =
    lang === "es"
      ? `Hola, estoy interesado en este producto:
${product.name}
Talla: ${selectedSize || "No seleccionada"}
Precio: ${formatPrice(activePrice)}
Enlace: ${productUrl}

¿Sigue disponible?`
      : `Hi, I'm interested in this product:
${product.name}
Size: ${selectedSize || "Not selected"}
Price: ${formatPrice(activePrice)}
Link: ${productUrl}

Is it still available?`;

  /* Link otwierający WhatsApp z gotową wiadomością */
const whatsappUrl = `https://api.whatsapp.com/send?phone=19563562096&text=${encodeURIComponent(
  whatsappMessage
)}`;

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
                className={
                  selectedSize === size
                    ? "size-pill size-pill--active"
                    : "size-pill"
                }
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
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="button-secondary"
          style={{
            display: "inline-flex",
            width: "100%",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          {t.askOnWhatsapp}
        </a>
      </div>
    </div>
  );
}
