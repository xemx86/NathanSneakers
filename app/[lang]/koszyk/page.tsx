import { CartPage } from "@/components/cart-page";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

export default async function CartRoutePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container cart-page-shell">
      <div className="section__header">
        <div>
          <div className="eyebrow">{dict.nav.cart}</div>
          <h1>{dict.cart.title}</h1>
          <p>{dict.cart.subtitle}</p>
        </div>
      </div>

      <CartPage lang={lang} />
    </div>
  );
}