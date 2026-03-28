import { ProductGallery } from "@/components/product-gallery";
import { ProductSlider } from "@/components/product-slider";
import Link from "next/link";
import { listProducts } from "@/lib/products";
import { PageViewTracker } from "@/components/page-view-tracker";
//import { ProductCard } from "@/components/product-card";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";
import { LatestProductsCarousel } from "@/components/latest-products-carousel";
const drops = [
  "Barefoot Premium",
  "Limited dropy",
  "Soft materials",
// 
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
 const { lang } = await params;
const dict = await getDictionary(lang);
const products = await listProducts({ limit: 12 });
const latestProducts = [...products]
  .sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime()
  )
  .slice(0, 5);

const latestUi =
  lang === "es"
    ? {
        badge: "NUEVO",
        title: "Recién añadido",
        button: "Ver producto",
        empty: "Descubre los modelos añadidos recientemente.",
      }
    : {
        badge: "NEW IN",
        title: "New arrival",
        button: "See product",
        empty: "Check the latest added models.",
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
  <LatestProductsCarousel
    products={latestProducts}
    lang={lang}
    ui={latestUi}
  />

  <div className="hero-stage__orb" aria-hidden="true" />
</div>

            <div className="hero-stage__orb" aria-hidden="true" />
          </div>
      
      </section>

<section className="section">
  <div className="container">
<ProductSlider
  products={products}
  lang={lang}
  titleMain={dict.home.sliderTitleMain}
  titleAccent={dict.home.sliderTitleAccent}
/>
  </div>
</section>
    </>
  );
}
