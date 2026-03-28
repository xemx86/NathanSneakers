"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Locale } from "@/lib/i18n";
import { ProductRow } from "@/types/store";
import { RotatingProductImage } from "@/components/rotating-product-image";

type LatestProductsCarouselProps = {
  products: ProductRow[];
  lang: Locale;
  ui: {
    badge: string;
    title: string;
    button: string;
    empty: string;
  };
};

export function LatestProductsCarousel({
  products,
  lang,
  ui,
}: LatestProductsCarouselProps) {
  const items = useMemo(() => products.slice(0, 5), [products]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) {
    return (
      <div className="hero-stage__card hero-stage__card--dark">
        <div className="eyebrow">{ui.badge}</div>
        <strong>{ui.title}</strong>
        <span>{ui.empty}</span>
      </div>
    );
  }

  const activeProduct = items[activeIndex];

  return (
    <div className="hero-stage__card hero-stage__card--dark">
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <div className="eyebrow">{ui.badge}</div>

          <strong>{ui.title}</strong>

          <span>
            {activeProduct.brand} · {activeProduct.name}
          </span>

     

          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 5,
              alignItems: "center",
            }}
          >
            {items.map((_, index) => (
              <span
                key={index}
                style={{
                  width: index === activeIndex ? 96 : 12,
height: 12,
                  borderRadius: 999,
                  background:
                    index === activeIndex
                      ? "#b37543"
                      : "rgba(255,255,255,0.28)",
                  transition: "all 0.25s ease",
                  display: "inline-block",
                }}
              />
            ))}
          </div>
        </div>

        <Link

  href={`/${lang}/produkt/${activeProduct.slug}`}
  style={{
    display: "block",
    flex: "0 0 340px",
    width: "340px",
    textDecoration: "none",
  }}
>
  <div
    style={{
      width: "100%",
      aspectRatio: "4 / 3",
      borderRadius: 24,
      overflow: "hidden",
      background: "rgba(255,255,255,0.08)",
    }}
  >
        
            <RotatingProductImage
              key={activeProduct.id}
              name={activeProduct.name}
              imageUrl={activeProduct.image_url ?? null}
              imageUrls={activeProduct.image_urls ?? []}
              intervalMs={1000}
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
