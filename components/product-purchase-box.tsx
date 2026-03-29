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
    copiedMessage: "Message copied. Paste it into WhatsApp.",
    copyFailed: "Copy failed. Copy the message manually below.",
    messageLabel: "Message for seller",
  },
  es: {
    chooseSize: "Elegir talla",
    addToCart: "Añadir al carrito",
    addedToCart: "Añadido al carrito",
    goToCart: "Ir al carrito",
    askOnWhatsapp: "Preguntar por WhatsApp",
    copiedMessage: "Mensaje copiado. Pégalo en WhatsApp.",
    copyFailed: "No se pudo copiar. Copia el mensaje manualmente abajo.",
    messageLabel: "Mensaje para el vendedor",
  },
};

export function ProductPurchaseBox({ product, lang }: Props) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [added, setAdded] = useState(false);
  const [notice, setNotice] = useState("");
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

  async function handleWhatsApp() {
    const baseUrl = window.location.origin;
    const productUrl = `${baseUrl}/${lang}/produkt/${product.slug}`;

    const message =
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

    try {
      await navigator.clipboard.writeText(message);
      setNotice(t.copiedMessage);
    } catch {
      setNotice(t.copyFailed);
    }

    window.open("https://wa.me/19563562096", "_blank", "noopener,noreferrer");
  }

  const previewMessage =
    lang === "es"
      ? `Hola, estoy interesado en este producto:
${product.name}
Talla: ${selectedSize || "No seleccionada"}
Precio: ${formatPrice(activePrice)}
Enlace: ${typeof window !== "undefined" ? `${window.location.origin}/${lang}/produkt/${product.slug}` : `/${lang}/produkt/${product.slug}`}

¿Sigue disponible?`
      : `Hi, I'm interested in this product:
${product.name}
Size: ${selectedSize || "Not selected"}
Price: ${formatPrice(activePrice)}
Link: ${typeof window !== "undefined" ? `${window.location.origin}/${lang}/produkt/${product.slug}` : `/${lang}/produkt/${product.slug}`}

Is it still available?`;

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

      {notice ? (
        <p style={{ marginTop: 10, fontSize: 14 }}>{notice}</p>
      ) : null}

      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
          {t.messageLabel}
        </div>
        <textarea
          readOnly
          value={previewMessage}
          style={{
            width: "100%",
            minHeight: 140,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #d0d0d0",
            resize: "vertical",
            fontFamily: "inherit",
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
}
