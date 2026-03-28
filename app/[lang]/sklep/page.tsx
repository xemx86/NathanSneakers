import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { listProducts, listTaxonomy } from "@/lib/products";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  color?: string;
  material?: string;
  audience?: string;
  sort?: string;
}>;

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: SearchParams;
}) {
  /* Pobranie aktualnego języka */
  const { lang } = await params;

  /* Pobranie słownika tłumaczeń */
  const dict = await getDictionary(lang);

  /* Pobranie parametrów z URL */
  const paramsQuery = await searchParams;

  /* Pobranie produktów z uwzględnieniem filtrów */
  const products = await listProducts({
    search: paramsQuery.q,
    category: paramsQuery.category,
    color: paramsQuery.color,
    material: paramsQuery.material,
    size_system: paramsQuery.audience,
    sort: paramsQuery.sort,
  });

  /* Pobranie danych do filtrów */
  const taxonomy = await listTaxonomy();

  return (
    <div className="container store-page">
      {/* Nagłówek strony sklepu */}
      <section className="store-heading panel store-heading--premium">
        <div>
          {/* Mała pigułka nad tytułem */}
          <div className="eyebrow">{dict.shop.collection}</div>

          {/* Premium tytuł sekcji sklepu */}
          <h1 className="store-heading__title store-heading__title--premium">
            <span className="store-heading__title-main">
              {dict.shop.title}
            </span>
          </h1>

          {/* Opis strony sklepu */}
          <p className="store-heading__description">
            {dict.shop.description}
          </p>
        </div>

        {/* Licznik produktów */}
        <div className="store-heading__meta">
          <strong>{products.length}</strong>
          <span>{dict.shop.products}</span>
        </div>
      </section>

      <div className="store-layout">
        {/* Panel filtrów */}
        <ProductFilters
          lang={lang}
          categories={taxonomy.categories}
          colors={taxonomy.colors}
          materials={taxonomy.materials}
          current={{
            q: paramsQuery.q ?? "",
            category: paramsQuery.category ?? "",
            color: paramsQuery.color ?? "",
            material: paramsQuery.material ?? "",
            audience: paramsQuery.audience ?? "",
            sort: paramsQuery.sort ?? "newest",
          }}
        />

        {/* Lista produktów */}
        <section>
          <div className="toolbar">
            <div>
              <h3 className="store-listing__title">
                <span className="store-listing__title-accent">
                  {lang === "es" ? "Modelos" : "Selected"}
                </span>{" "}
                <span>{lang === "es" ? "seleccionados" : "models"}</span>
              </h3>

              <div className="toolbar__meta">{dict.shop.listingMeta}</div>
            </div>
          </div>

          <ProductGrid products={products} lang={lang} />
        </section>
      </div>
    </div>
  );
}
