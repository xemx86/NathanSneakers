import { ProductRow } from "@/types/store";

export const productsData: ProductRow[] = [
  {
    id: "1",
    name: "Nike Air Max",
    slug: "nike-air-max",
    brand: "Nike",
    description: "Sample product description",
    image_url: "/images/nike-air-max.jpg",
    image_urls: ["/images/nike-air-max.jpg"],
    category: "Shoes",
    color: "Black",
    material: "Leather",
    price: 499,
    sale_price: null,
    sizes: ["40", "41", "42", "43"],
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
  }
];