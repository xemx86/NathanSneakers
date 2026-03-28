"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Locale } from "@/lib/i18n";

const ui = {
  en: {
    cart: "Cart",
  },
  es: {
    cart: "Carrito",
  },
};

export function CartLink({ lang }: { lang: Locale }) {
  const { itemCount } = useCart();
  const t = ui[lang];

  return (
    <Link href={`/${lang}/koszyk`} className="cart-link">
      {t.cart}
      <span>{itemCount}</span>
    </Link>
  );
}