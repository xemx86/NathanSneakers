insert into public.products
(name, slug, brand, description, image_url, category, color, material, price, sale_price, sizes, is_featured)
values
(
  'Barefoot Terra',
  'barefoot-terra',
  'KickRush',
  'Minimalistyczne barefooty do codziennego noszenia.',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  'Barefoot',
  'Czarny',
  'Skóra naturalna',
  459.00,
  399.00,
  '{"39","40","41","42","43"}',
  true
),
(
  'Urban Flow',
  'urban-flow',
  'KickRush',
  'Nowoczesny model lifestyle pod miejski outfit.',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
  'Lifestyle',
  'Beżowy',
  'Zamsz',
  399.00,
  null,
  '{"37","38","39","40"}',
  true
),
(
  'Street Pulse',
  'street-pulse',
  'KickRush',
  'Sneaker w dynamicznym stylu z grubszą podeszwą.',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80',
  'Streetwear',
  'Biały',
  'Mesh',
  499.00,
  449.00,
  '{"40","41","42","43","44"}',
  false
);
