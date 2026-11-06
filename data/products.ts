export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  rating: number;
  stock: number;
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 14 M3",
    price: 1999,
    originalPrice: 2199,
    category: "Laptops",
    description: "Apple M3 chip, 16GB Unified Memory, 512GB SSD Storage, Liquid Retina XDR display.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60",
    rating: 4.9,
    stock: 12,
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    price: 1199,
    originalPrice: 1299,
    category: "Smartphones",
    description: "Titanium design, A17 Pro chip, 48MP Main camera, 5x Telephoto, USB-C.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    stock: 25,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 348,
    originalPrice: 399,
    category: "Audio",
    description: "Industry Leading Noise Canceling Wireless Headphones with 2 processors and 8 microphones.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
    rating: 4.7,
    stock: 30,
  },
  {
    id: 4,
    name: "iPad Air 11-inch M2",
    price: 599,
    originalPrice: 649,
    category: "Tablets",
    description: "Liquid Retina display, M2 processor, landscape front camera, ultra-fast Wi-Fi 6E.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60",
    rating: 4.6,
    stock: 18,
  },
  {
    id: 5,
    name: "Apple Watch Series 9",
    price: 399,
    originalPrice: 429,
    category: "Wearables",
    description: "Powerful S9 SiP, double tap gesture, brighter display, faster on-device Siri.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60",
    rating: 4.5,
    stock: 40,
  },
  {
    id: 6,
    name: "Dell UltraSharp 27 4K",
    price: 549,
    originalPrice: 620,
    category: "Monitors",
    description: "IPS Black technology with 2000:1 contrast ratio, 4K resolution, 98% DCI-P3 color gamut.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60",
    rating: 4.8,
    stock: 15,
  },
];

