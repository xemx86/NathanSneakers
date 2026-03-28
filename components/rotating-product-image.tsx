"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  name: string;
  imageUrl: string | null;
  imageUrls: string[] | null;
  intervalMs?: number;
};

export function RotatingProductImage({
  name,
  imageUrl,
  imageUrls,
  intervalMs = 2500,
}: Props) {
  const images = useMemo(() => {
    const merged = [
      imageUrl,
      ...(imageUrls ?? []),
    ]
      .map((item) => (item ?? "").trim())
      .filter(Boolean);

    const unique = Array.from(new Set(merged));

    return unique.length ? unique : ["/placeholder-product.svg"];
  }, [imageUrl, imageUrls]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [images, intervalMs]);

  return (
    <img
      key={images[index]}
      src={images[index]}
      alt={name}
      className="rotating-image"
    />
  );
}