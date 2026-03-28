"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useParams, useRouter } from "next/navigation";

export function CheckoutButton() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const lang = typeof params.lang === "string" ? params.lang : "en";

  function handleCheckout() {
    if (items.length === 0) return;

    setLoading(true);
    router.push(`/${lang}/contact`);
  }

  const buttonLabel =
    lang === "es"
      ? "Contactar para pedir"
      : "Contact to order";

  const loadingLabel =
    lang === "es"
      ? "Redirigiendo..."
      : "Redirecting...";

  return (
    <div className="checkout-box">
      <button
        className="button button--wide"
        type="button"
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
      >
        {loading ? loadingLabel : buttonLabel}
      </button>
    </div>
  );
}