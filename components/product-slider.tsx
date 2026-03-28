"use client";

// Import hooków React do memoizacji danych, referencji DOM i stanu aktywnego slajdu
import { useMemo, useRef, useState } from "react";

// Import komponentu obracającego zdjęcia produktu
import { RotatingProductImage } from "@/components/rotating-product-image";

// Import funkcji do formatowania ceny
import { formatPrice } from "@/lib/utils";

// Import typu języka
import type { Locale } from "@/lib/i18n";

// Import typu produktu ze store
import type { ProductRow } from "@/types/store";

// Import linku z obsługą kliknięć produktu
import { ProductClickLink } from "@/components/product-click-link";

// Typ propsów dla slidera
type Props = {
  products: ProductRow[];
  lang: Locale;
  title?: string; // 👈 DODAJ TO
};

// Zwraca pierwszy element z tablicy rozmiarów albo null
function getFirstSize(sizes?: string[] | null) {
  return Array.isArray(sizes) && sizes.length > 0 ? sizes[0] : null;
}

// Sprawdza, czy produkt ma jakikolwiek rozmiar do pokazania w badge
function shouldShowSizeBadge(product: ProductRow) {
  return Boolean(
    getFirstSize(product.sizes) ||
      getFirstSize(product.sizes_men) ||
      getFirstSize(product.sizes_women)
  );
}

// Buduje tekst badge z rozmiarem zależnie od systemu rozmiarowego produktu
function getSizeBadgeText(product: ProductRow, lang: Locale) {
  const firstSize = getFirstSize(product.sizes);
  const firstMenSize = getFirstSize(product.sizes_men);
  const firstWomenSize = getFirstSize(product.sizes_women);

  if (product.size_system === "men") {
    return lang === "es"
      ? `Hombre ${firstSize ?? ""}`
      : `Men ${firstSize ?? ""}`;
  }

  if (product.size_system === "women") {
    return lang === "es"
      ? `Mujer ${firstSize ?? ""}`
      : `Women ${firstSize ?? ""}`;
  }

  if (product.size_system === "kids") {
    return lang === "es"
      ? `Niños ${firstSize ?? ""}`
      : `Kids ${firstSize ?? ""}`;
  }

  if (product.size_system === "men_women") {
    return lang === "es"
      ? `H ${firstMenSize ?? "-"} / M ${firstWomenSize ?? "-"}`
      : `M ${firstMenSize ?? "-"} / W ${firstWomenSize ?? "-"}`;
  }

  return lang === "es"
    ? `Talla ${firstSize ?? ""}`
    : `Size ${firstSize ?? ""}`;
}

function getAudienceLabel(sizeSystem: ProductRow["size_system"], lang: Locale) {
  if (sizeSystem === "men") {
    return lang === "es" ? "Hombre" : "Men";
  }

  if (sizeSystem === "women") {
    return lang === "es" ? "Mujer" : "Women";
  }

  if (sizeSystem === "kids") {
    return lang === "es" ? "Niños" : "Kids";
  }

  if (sizeSystem === "men_women") {
    return lang === "es" ? "Unisex" : "Unisex";
  }

  return "";
}

// Główny komponent slidera produktów
export function ProductSlider({
  products,
  lang,
}: Props) {
  // Ref do tracka slidera, żeby móc przewijać programowo
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Aktualnie aktywny slajd dla dolnych indicatorów
  const [activeIndex, setActiveIndex] = useState(0);

  // Zabezpieczenie, żeby zawsze pracować na tablicy
  const validProducts = useMemo(() => products ?? [], [products]);

  // Przewija slider do konkretnego indeksu
  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll<HTMLElement>(".slider-slide");
    if (!slides.length) return;

    // Zapętlenie indeksu w lewo/prawo
    const clampedIndex =
      index < 0 ? slides.length - 1 : index >= slides.length ? 0 : index;

    const target = slides[clampedIndex];
    if (!target) return;

    // Wyliczamy pozycję docelowego slajdu względem tracka
    const left = target.offsetLeft - track.offsetLeft;

    // Płynne przewinięcie
    track.scrollTo({
      left,
      behavior: "smooth",
    });

    // Aktualizacja aktywnego slajdu
    setActiveIndex(clampedIndex);
  }

  // Aktualizuje aktywny indeks podczas ręcznego scrollowania
  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(
      track.querySelectorAll<HTMLElement>(".slider-slide")
    );

    if (!slides.length) return;

    const trackLeft = track.getBoundingClientRect().left;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    // Szukamy slajdu najbliżej lewej krawędzi tracka
    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }

  // Jeśli nie ma produktów, nie renderujemy slidera
  if (!validProducts.length) return null;

  // Tytuł główny slidera
  const headingMain = titleMain ?? (lang === "es" ? "Nuevas" : "New");

  // Druga część tytułu slidera
  const headingAccent =
    titleAccent ?? (lang === "es" ? "Llegadas" : "Arrivals");

  return (
    <section className="slider-section slider-section--luxe">
      <div className="slider-header slider-header--luxe">
        <h2
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            textAlign: "center",
            margin: 0,
            textTransform: "none",
          }}
        >
          <span style={{ color: "#b37543" }}>{headingMain}</span>{" "}
          <span style={{ color: "#060101" }}>{headingAccent}</span>
        </h2>
      </div>

      <div className="slider-shell slider-shell--luxe">
        <div className="slider-track" ref={trackRef} onScroll={handleScroll}>
          {validProducts.map((product, index) => {
            // Czy pokazać badge z rozmiarem
            const showSizeBadge = shouldShowSizeBadge(product);

            // Tekst badge z rozmiarem
            const sizeBadgeText = getSizeBadgeText(product, lang);

            // Tekst badge z grupą docelową
            const audienceLabel = getAudienceLabel(product.audience, lang);

            return (
              <div
                className="slider-slide"
                key={`${product.id}-${product.slug ?? index}`}
              >
                <article className="slider-card slider-card--luxe">
                  <div className="slider-card__media slider-card__media--luxe">
                    <ProductClickLink
                      href={`/${lang}/produkt/${product.slug}`}
                      slug={product.slug}
                      className="slider-card__image slider-card__image--luxe"
                    >
                      <RotatingProductImage
                        name={product.name}
                        imageUrl={product.image_url}
                        imageUrls={product.image_urls ?? []}
                        intervalMs={2000}
                      />
                    </ProductClickLink>

                    {showSizeBadge && (
                      <div className="slider-card__size-badge">
                        {sizeBadgeText}
                      </div>
                    )}
                  </div>

                  <div className="slider-card__body slider-card__body--luxe">
                    <div className="slider-card__meta">
                      <div className="slider-card__badges">
                        <div className="slider-card__badge">
                          {lang === "es" ? "Nuevo" : "New"}
                        </div>

                        <div className="slider-card__badge slider-card__badge--soft">
                          {audienceLabel}
                        </div>
                      </div>

                      <ProductClickLink
                        href={`/${lang}/produkt/${product.slug}`}
                        slug={product.slug}
                        className="slider-card__title slider-card__title--luxe"
                      >
                        {product.name}
                      </ProductClickLink>

                      <div className="slider-card__price slider-card__price--luxe">
                        {formatPrice(product.sale_price ?? product.price)}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dolna nawigacja slidera w formie kapsułek */}
      <div
        className="slider-dots-wrap"
        aria-label={
          lang === "es" ? "Navegación del slider" : "Slider navigation"
        }
      >
        {validProducts.map((product, index) => {
          // Sprawdzamy, czy dany slajd jest aktualnie aktywny
          const isActive = index === activeIndex;

          return (
            <button
              key={`${product.id}-dot-${index}`}
              type="button"
              aria-label={`${
                lang === "es" ? "Ir al slide" : "Go to slide"
              } ${index + 1}`}
              aria-pressed={isActive}
              className={`slider-dot ${isActive ? "slider-dot--active" : ""}`}
              onClick={() => scrollToIndex(index)}
            />
          );
        })}
      </div>
    </section>
  );
}
