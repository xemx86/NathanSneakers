import { ProductSlider } from "@/components/product-slider";
import Link from "next/link";
import { listProducts } from "@/lib/products";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

const drops = [
  "Barefoot Premium",
  "Limited dropy",
  "Soft materials",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const products = await listProducts({ limit: 12 });
  const latestProduct = products[0] ?? null;

  const latestUi =
    lang === "es"
      ? {
          badge: "NUEVO",
          title: "Recién añadido",
          text: latestProduct
            ? `${latestProduct.brand} · ${latestProduct.name}`
            : "Descubre los modelos añadidos recientemente.",
          button: "Ver producto",
        }
      : {
          badge: "NEW IN",
          title: "New arrival",
          text: latestProduct
            ? `${latestProduct.brand} · ${latestProduct.name}`
            : "Sprawdź ostatnio dodane modele.",
          button: "See product",
        };

  return (
    <>
      <section className="hero hero--luxe">
        <div className="container hero__grid hero__grid--luxe">
          <div className="hero-copy">
            <div className="hero-badge">{dict.home.badge}</div>

            <h1>
              {dict.home.title.split(dict.home.titleAccent)[0]}
              <span>{dict.home.titleAccent}</span>
              {dict.home.title.split(dict.home.titleAccent)[1]}
            </h1>

            <p>{dict.home.description}</p>

            <div className="inline-actions">
              <Link className="button" href={`/${lang}/sklep`}>
                {dict.home.viewCollection}
              </Link>

              <Link className="button-secondary" href={`/${lang}/admin`}>
                {dict.home.manageProducts}
              </Link>
            </div>

            <div className="chip-row">
              {drops.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-stage panel">
            <div className="hero-stage__card hero-stage__card--dark">
              <div className="eyebrow">{latestUi.badge}</div>
              <strong>{latestUi.title}</strong>
              <span>{latestUi.text}</span>

              {latestProduct ? (
                <Link
                  href={`/${lang}/produkt/${latestProduct.slug}`}
                  className="button-secondary"
                  style={{ marginTop: 16, width: "fit-content" }}
                >
                  {latestUi.button}
                </Link>
              ) : null}
            </div>

            <div className="hero-stage__orb" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ProductSlider
            products={products}
            lang={lang}
            title={lang === "es" ? "Nuevos productos" : "New Arrivals"}
          />
        </div>
      </section>
    </>
  );
}
