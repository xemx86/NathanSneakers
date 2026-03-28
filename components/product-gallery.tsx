"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  name: string;
  imageUrl: string | null;
  imageUrls?: string[] | null;
};

export function ProductGallery({ name, imageUrl, imageUrls }: Props) {
  const images = useMemo(() => {
    const merged = [
      ...(imageUrl ? [imageUrl] : []),
      ...(imageUrls ?? []),
    ]
      .map((item) => item?.trim())
      .filter(Boolean) as string[];

    const unique = Array.from(new Set(merged));
    return unique.length ? unique : ["/placeholder-product.svg"];
  }, [imageUrl, imageUrls]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  function goPrev() {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function goNext() {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  const activeImage = images[activeIndex];

return (
  <div className="product-gallery panel">
    <div className="product-gallery__main">
      {images.length > 1 ? (
        <button
          type="button"
          className="product-gallery__arrow product-gallery__arrow--left"
          onClick={goPrev}
          aria-label="Previous image"
        >
          <svg
            className="product-gallery__arrow-icon product-gallery__arrow-icon--left"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6.66602 16L25.3327 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.334 24L25.334 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.334 8L25.334 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}

      <img src={activeImage} alt={name} />

      {images.length > 1 ? (
        <button
          type="button"
          className="product-gallery__arrow product-gallery__arrow--right"
          onClick={goNext}
          aria-label="Next image"
        >
          <svg
            className="product-gallery__arrow-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6.66602 16L25.3327 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.334 24L25.334 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.334 8L25.334 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
