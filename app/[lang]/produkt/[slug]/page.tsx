import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { ProductPurchaseBox } from "@/components/product-purchase-box";
import { ProductGallery } from "@/components/product-gallery";
import { Locale } from "@/lib/i18n";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  /* Pobranie języka i slug produktu */
  const { lang, slug } = await params;

  /* Pobranie produktu po slug */
  const product = await getProductBySlug(slug);

  /* Jeśli produktu nie ma, pokazujemy 404 */
  if (!product) {
    notFound();
  }

  /* Tekst audience */
  const audienceLabel =
    product.audience === "men"
      ? lang === "es"
        ? "Hombre"
        : "Men"
      : product.audience === "women"
      ? lang === "es"
        ? "Mujer"
        : "Women"
      : product.audience === "kids"
      ? lang === "es"
        ? "Niños"
        : "Kids"
      : lang === "es"
      ? "Unisex"
      : "Unisex";

  /* Tekst systemu rozmiarowego */
  const sizeSystemLabel =
    product.size_system === "men"
      ? lang === "es"
        ? " de hombre"
        : "Men "
      : product.size_system === "women"
      ? lang === "es"
        ? " de mujer"
        : "Women "
      : product.size_system === "kids"
      ? lang === "es"
        ? " infantiles"
        : "Kids "
      : product.size_system === "men_women"
      ? lang === "es"
        ? " de hombre y mujer"
        : "Men & Women "
      : lang === "es"
      ? " unisex"
      : "Unisex ";

  return (
    <div className="container product-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link href={`/${lang}`}>Start</Link> /{" "}
        <Link href={`/${lang}/sklep`}>Sklep</Link> / {product.name}
      </div>

      {/* Główny układ strony produktu */}
      <div className="product-page__grid">
        {/* Galeria produktu */}
        <ProductGallery
          name={product.name}
          imageUrl={product.image_url}
          imageUrls={product.image_urls ?? []}
        />

        {/* Prawa kolumna z informacjami */}
        <article className="product-info panel">
          {/* Górne meta badge */}
          <div className="product-info__meta">
            <span className="badge">{product.category}</span>
            <span className="badge">{product.brand}</span>
            <span className="badge">{product.material}</span>
          </div>

          {/* Nazwa produktu */}
          <h1>{product.name}</h1>

          {/* Opis produktu */}
          <p>{product.description || "Brak opisu produktu."}</p>

          {/* Główne tagi produktu */}
          <div className="tag-row">
            <span className="tag">Color: {product.color}</span>
         
            <span className="tag">Sizing: {sizeSystemLabel}</span>

            {product.is_featured ? (
              <span className="tag tag--accent">Wyróżniony</span>
            ) : null}
          </div>

          {/* Dodatkowe informacje o rozmiarach tylko dla men_women */}
          {product.size_system === "men_women" && (
            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              {Array.isArray(product.sizes_men) && product.sizes_men.length > 0 ? (
                <div className="tag-row">
                  <span className="tag">
                    {lang === "es" ? "Talla hombre:" : "Men size:"}{" "}
                    {product.sizes_men.join(", ")}
                  </span>
                </div>
              ) : null}

              {Array.isArray(product.sizes_women) &&
              product.sizes_women.length > 0 ? (
                <div className="tag-row">
                  <span className="tag">
                    {lang === "es" ? "Talla mujer:" : "Women size:"}{" "}
                    {product.sizes_women.join(", ")}
                  </span>
                </div>
              ) : null}
            </div>
          )}

          {/* Box zakupu */}
          <ProductPurchaseBox
            lang={lang}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              image_url: product.image_url,
              sizes: product.sizes ?? [],
              price: product.price,
              sale_price: product.sale_price,
            }}
          />
        </article>
      </div>
    </div>
  );
}