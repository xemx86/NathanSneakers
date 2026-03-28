import Link from "next/link";
import { ProductRow } from "@/types/store";
import { Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

/* Typ propsów dla pojedynczej karty produktu */
type Props = {
  product: ProductRow;
  lang: Locale;
};

/* 
  Funkcja pomocnicza:
  zwraca etykietę grupy docelowej produktu
*/
function getAudienceLabel(audience: ProductRow["size_system"], lang: Locale) {
  if (audience === "men") {
    return lang === "es" ? "Hombre" : "Men";
  }

  if (audience === "women") {
    return lang === "es" ? "Mujer" : "Women";
  }

  if (audience === "kids") {
    return lang === "es" ? "Niños" : "Kids";
  }

  return "Unisex";
}

/* 
  Funkcja pomocnicza:
  buduje listę rozmiarów do pokazania na karcie produktu
*/
function getDisplaySizes(product: ProductRow, lang: Locale) {
  /* Zwykłe rozmiary */
  const sizes = product.sizes ?? [];

  /* Rozmiary dla systemu męskiego */
  const menSizes = product.sizes_men ?? [];

  /* Rozmiary dla systemu damskiego */
  const womenSizes = product.sizes_women ?? [];

  /*
    Jeśli produkt ma system "men_women",
    pokazujemy oba zestawy rozmiarów
  */
  if (product.size_system === "men_women") {
    const menPills = menSizes.slice(0, 2).map((size) =>
      lang === "es" ? `H ${size}` : `M ${size}`
    );

    const womenPills = womenSizes.slice(0, 2).map((size) =>
      lang === "es" ? `M ${size}` : `W ${size}`
    );

    return [...menPills, ...womenPills];
  }

  /*
    Dla zwykłych produktów pokazujemy
    standardowe rozmiary z pola sizes
  */
  return sizes.slice(0, 4);
}

/* Główny komponent pojedynczej karty produktu */
export function ProductCard({ product, lang }: Props) {
  /* Pobieramy listę rozmiarów do wyświetlenia */
  const displaySizes = getDisplaySizes(product, lang);

  /* Pobieramy etykietę grupy docelowej */
  const audienceLabel = getAudienceLabel(product.size_system, lang);

  return (
    <article className="product-card">
      {/* Klikalne zdjęcie produktu */}
      <Link
        href={`/${lang}/produkt/${product.slug}`}
        className="product-card__image"
      >
        <img
          src={product.image_url ?? "/placeholder-product.svg"}
          alt={product.name}
        />
      </Link>

      {/* Dolna część karty produktu */}
      <div className="product-card__body">
        {/* Rząd badge */}
        <div className="product-card__badges">
          <span className="product-card__badge">
            {lang === "es" ? "Nuevo" : "New"}
          </span>

          <span className="product-card__badge product-card__badge--soft">
            {audienceLabel}
          </span>
        </div>

        {/* Nazwa produktu */}
        <Link
          href={`/${lang}/produkt/${product.slug}`}
          className="product-card__title"
        >
          {product.name}
        </Link>

        {/* Marka produktu */}
        <div className="product-card__brand">
          {product.brand || "KickRush"}
        </div>

        {/* Cena produktu */}
        <div className="product-card__price">
          {product.sale_price ? (
            <>
              {/* Cena promocyjna */}
              <span className="price price--sale">
                {formatPrice(product.sale_price)}
              </span>

              {/* Stara cena */}
              <span className="price price--old">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            /* Standardowa cena */
            <span className="price">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Rozmiary produktu */}
        {displaySizes.length > 0 ? (
          <div className="size-row">
            {displaySizes.map((size) => (
              <span className="size-pill" key={size}>
                {size}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
