export interface Product {
  id: number;
  name: string;
  reference?: string;
  description?: string;
  price: number;
  salePrice: number | null;
  discountPercent: number | null;
  onSale: boolean;
  sizes: string[];
  stock: number;
  artKey: string;
  collectionId: number | null;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  jpTag?: string;
  description?: string;
  artKey: string;
}

export const COLLECTIONS: Collection[] = [
  {
    id: 1,
    name: 'Zenin Clan',
    slug: 'zenin-clan',
    jpTag: '壱・弐・参',
    description: 'Line-art pulled straight from the Zenin arcs — domain expansions rendered in thread.',
    artKey: 'domain',
  },
  {
    id: 2,
    name: 'Hunter Archive',
    slug: 'hunter-archive',
    jpTag: '狩人',
    description: 'Nen-marked graphics for the ones still chasing the exam.',
    artKey: 'web',
  },
  {
    id: 3,
    name: 'Black Moon Originals',
    slug: 'black-moon-originals',
    jpTag: '黒月',
    description: 'House-original graphics that don\'t borrow from anyone\'s arc but ours.',
    artKey: 'moon',
  },
];

const RAW_PRODUCTS: Omit<Product, 'salePrice' | 'discountPercent' | 'onSale'>[] = [
  {
    id: 1,
    name: 'Hot Zenin Tee',
    reference: 'Jujutsu Kaisen',
    description:
      'Screen-printed heavyweight cotton tee, line-art built from the Zenin clan arc. Relaxed, boxy fit with a dropped shoulder.',
    price: 38,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 120,
    artKey: 'claw',
    collectionId: 1,
  },
  {
    id: 2,
    name: 'Domain Bloom Tee',
    reference: 'Jujutsu Kaisen',
    description: 'Domain expansion graphic, puff-print accents on heavyweight cotton for a raised, textured finish.',
    price: 38,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 80,
    artKey: 'domain',
    collectionId: 1,
  },
  {
    id: 3,
    name: 'Curse Word Longsleeve',
    reference: 'Jujutsu Kaisen',
    description: 'Long-sleeve tee with sleeve-print detailing, built for layering under the hoodie.',
    price: 44,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 45,
    artKey: 'flame',
    collectionId: 1,
  },
  {
    id: 4,
    name: 'Hisoka Web Tee',
    reference: 'Hunter × Hunter',
    description: 'Web-marked line-art, screen printed in water-based ink for a soft hand-feel.',
    price: 36,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 60,
    artKey: 'web',
    collectionId: 2,
  },
  {
    id: 5,
    name: 'Gon Freecss Tee',
    reference: 'Hunter × Hunter',
    description: 'Minimal linework tribute, relaxed boxy cut with a ribbed collar.',
    price: 36,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 60,
    artKey: 'bolt',
    collectionId: 2,
  },
  {
    id: 6,
    name: 'Nen Eye Tee',
    reference: 'Hunter × Hunter',
    description: 'Single line-art eye graphic, centered chest print on a heavyweight tee.',
    price: 36,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    artKey: 'eye',
    collectionId: 2,
  },
  {
    id: 7,
    name: 'Black Moon Hoodie',
    reference: 'RANDOM Original',
    description: '380gsm fleece hoodie with moon-glow embroidery on the chest and a back-print climber graphic.',
    price: 68,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 40,
    artKey: 'moon',
    collectionId: 3,
  },
  {
    id: 8,
    name: 'Black Moon Tee',
    reference: 'Kurotsuki Original',
    description: 'The house graphic. Moon-glow print on heavyweight cotton, true to size.',
    price: 34,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 90,
    artKey: 'moon',
    collectionId: 3,
  },
];

const SALE_MAP: Record<number, number> = {
  1: 20, // Hot Zenin Tee — 20% off
  4: 15, // Hisoka Web Tee — 15% off
  8: 25, // Black Moon Tee — 25% off
};

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => {
  const discountPercent = SALE_MAP[p.id] ?? null;
  const onSale = discountPercent !== null;
  const salePrice = onSale ? +(p.price * (1 - discountPercent! / 100)).toFixed(2) : null;
  return { ...p, discountPercent, onSale, salePrice };
});

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  const col = getCollectionBySlug(slug);
  if (!col) return [];
  return PRODUCTS.filter((p) => p.collectionId === col.id);
}

export function getCollectionProductCount(collectionId: number): number {
  return PRODUCTS.filter((p) => p.collectionId === collectionId).length;
}

export function getOnSaleProducts(): Product[] {
  return PRODUCTS.filter((p) => p.onSale);
}
