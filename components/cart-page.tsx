"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
import { CheckoutButton } from "@/components/checkout-button";
import { Locale } from "@/lib/i18n";

const ui = {
  en: {
    empty: "Your cart is empty.",
    goShop: "Go to shop",
    andAddProducts: "and add products.",
    remove: "Remove",
    summary: "Summary",
    ready: "Ready for checkout",
    items: "Items",
    shipping: "Shipping",
    calculatedInStripe: "calculated in Stripe",
    total: "Total",
    size: "size",
    checkoutInfo:
      "Checkout works based on current prices fetched from the database, not from localStorage.",
    whatsapp: "Contact on WhatsApp",
    quantity: "Quantity",
    availabilityMessage: "Please let me know if they are available.",
  },
  es: {
    empty: "Tu carrito está vacío.",
    goShop: "Ir a la tienda",
    andAddProducts: "y añade productos.",
    remove: "Eliminar",
    summary: "Resumen",
    ready: "Listo para el checkout",
    items: "Artículos",
    shipping: "Envío",
    calculatedInStripe: "calculado en Stripe",
    total: "Total",
    size: "talla",
    checkoutInfo:
      "El checkout funciona con los precios actuales obtenidos de la base de datos, no de localStorage.",
    whatsapp: "Contactar por WhatsApp",
    quantity: "Cantidad",
    availabilityMessage: "Por favor, avísame si están disponibles.",
  },
};

export function CartPage({ lang }: { lang: Locale }) {
  const { items, subtotal, removeItem, setQuantity } = useCart();
  const t = ui[lang];

  /* Numer WhatsApp sklepu bez znaku + */
  const whatsappNumber = "+19563562096";

  /* Adres strony potrzebny do budowania linków do produktów */
  const siteUrl = "https://nathansneakers.onrender.com";

  /* Budujemy treść wiadomości z całej zawartości koszyka */
  const whatsappMessage = items
    .map((item, index) => {
      return `${index + 1}. ${item.name}
Brand: ${item.brand}
${item.size ? `${t.size}: ${item.size}` : ""}
${t.quantity}: ${item.quantity}
Price: ${formatPrice(item.price * item.quantity)}
Link: ${siteUrl}/${lang}/produkt/${item.slug}`;
    })
    .join("\n\n");

  /* Wstęp wiadomości zależny od języka */
  const intro =
    lang === "es"
      ? "Hola, estoy interesado en estos productos:"
      : "Hello, I'm interested in these products:";

  /* Końcowa treść wiadomości */
  const fullWhatsappMessage = `${intro}\n\n${whatsappMessage}\n\n${t.availabilityMessage}`;

  /* Gotowy link do WhatsApp z zakodowaną wiadomością */
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    fullWhatsappMessage
  )}`;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        {t.empty} <Link href={`/${lang}/sklep`}>{t.goShop}</Link> {t.andAddProducts}
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section className="panel cart-items">
        {items.map((item) => (
          <article className="cart-item" key={`${item.productId}-${item.size || "one"}`}>
            <Link href={`/${lang}/produkt/${item.slug}`} className="cart-item__image">
              <img src={item.imageUrl || "/placeholder-product.svg"} alt={item.name} />
            </Link>

            <div className="cart-item__content">
              <div className="cart-item__head">
                <div>
                  <h3>{item.name}</h3>
                  <div className="footer-muted">
                    {item.brand}
                    {item.size ? ` · ${t.size} ${item.size}` : ""}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  {t.remove}
                </button>
              </div>

              <div className="cart-item__footer">
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1, item.size)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1, item.size)}
                  >
                    +
                  </button>
                </div>

                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="panel cart-summary cart-summary--premium">
        {/* Mały badge nad tytułem */}
        <div className="eyebrow cart-summary__eyebrow">{t.summary}</div>

        {/* Premium tytuł sekcji summary */}
        <h2 className="cart-summary__title">
          <span className="cart-summary__title-main">
            {lang === "es" ? "Listo" : "Ready"}
          </span>
          <br />
          <span className="cart-summary__title-accent">
            {lang === "es" ? "para el checkout" : "for checkout"}
          </span>
        </h2>

        {/* Wiersz: wartość produktów */}
        <div className="summary-row">
          <span>{t.items}</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>

        {/* Wiersz: wysyłka */}
        <div className="summary-row">
          <span>{t.shipping}</span>
          <strong>{t.calculatedInStripe}</strong>
        </div>

        {/* Wiersz: suma końcowa */}
        <div className="summary-row summary-row--total">
          <span>{t.total}</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>

        {/* Przycisk checkout */}
        <CheckoutButton />

        {/* Przycisk kontaktu przez WhatsApp z gotową treścią koszyka */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-secondary"
          style={{ marginTop: 12, width: "100%", textAlign: "center" }}
        >
          {t.whatsapp}
        </a>

        {/* Opis pod przyciskiem */}
        <p className="footer-muted cart-summary__note" style={{ marginTop: 14 }}>
          {t.checkoutInfo}
        </p>
      </aside>
    </div>
  );
}
