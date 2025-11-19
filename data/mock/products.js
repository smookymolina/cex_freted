const BASE_PRODUCTS = [
  {
    name: 'iPhone 14 Pro',
    slug: 'iphone-14-pro',
    image: '/assets/images/products/iphone-14-pro/primary.jpg',
    thumbnail: '/assets/images/products/iphone-14-pro/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 17980,
        originalPrice: 26380,
        stock: 5,
      },
      {
        grade: 'A',
        price: 16580,
        originalPrice: 26380,
        stock: 12,
      },
      {
        grade: 'B',
        price: 14980,
        originalPrice: 26380,
        stock: 20,
      },
    ],
  },
  {
    name: 'iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    image: '/assets/images/products/iphone-16-pro-max/primary.jpg',
    thumbnail: '/assets/images/products/iphone-16-pro-max/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 26980,
        originalPrice: 34980,
        stock: 3,
      },
      {
        grade: 'A',
        price: 25480,
        originalPrice: 34980,
        stock: 7,
      },
      {
        grade: 'B',
        price: 23980,
        originalPrice: 34980,
        stock: 10,
      },
    ],
  },
  {
    name: 'iPhone 16 Pro',
    slug: 'iphone-16-pro',
    image: '/assets/images/products/iphone-16-pro/primary.jpg',
    thumbnail: '/assets/images/products/iphone-16-pro/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 24980,
        originalPrice: 31980,
        stock: 5,
      },
      {
        grade: 'A',
        price: 23480,
        originalPrice: 31980,
        stock: 10,
      },
      {
        grade: 'B',
        price: 21980,
        originalPrice: 31980,
        stock: 12,
      },
    ],
  },
  {
    name: 'iPhone 16',
    slug: 'iphone-16',
    image: '/assets/images/products/iphone-16/primary.jpg',
    thumbnail: '/assets/images/products/iphone-16/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 19980,
        originalPrice: 26980,
        stock: 8,
      },
      {
        grade: 'A',
        price: 18480,
        originalPrice: 26980,
        stock: 15,
      },
      {
        grade: 'B',
        price: 16980,
        originalPrice: 26980,
        stock: 20,
      },
    ],
  },
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    image: '/assets/images/products/iphone-15-pro/primary.jpg',
    thumbnail: '/assets/images/products/iphone-15-pro/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 21980,
        originalPrice: 29980,
        stock: 6,
      },
      {
        grade: 'A',
        price: 20480,
        originalPrice: 29980,
        stock: 12,
      },
      {
        grade: 'B',
        price: 18980,
        originalPrice: 29980,
        stock: 18,
      },
    ],
  },
  {
    name: 'iPhone 15',
    slug: 'iphone-15',
    image: '/assets/images/products/iphone-15/primary.jpg',
    thumbnail: '/assets/images/products/iphone-15/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 16980,
        originalPrice: 23980,
        stock: 10,
      },
      {
        grade: 'A',
        price: 15480,
        originalPrice: 23980,
        stock: 18,
      },
      {
        grade: 'B',
        price: 13980,
        originalPrice: 23980,
        stock: 25,
      },
    ],
  },
  {
    name: 'iPhone 14',
    slug: 'iphone-14',
    image: '/assets/images/products/iphone-14/primary.jpg',
    thumbnail: '/assets/images/products/iphone-14/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 13980,
        originalPrice: 20180,
        stock: 8,
      },
      {
        grade: 'A',
        price: 12580,
        originalPrice: 20180,
        stock: 15,
      },
      {
        grade: 'B',
        price: 10980,
        originalPrice: 20180,
        stock: 25,
      },
    ],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    image: '/assets/images/products/samsung-galaxy-s24-ultra/primary.jpg',
    thumbnail: '/assets/images/products/samsung-galaxy-s24-ultra/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 22980,
        originalPrice: 31980,
        stock: 4,
      },
      {
        grade: 'A',
        price: 21480,
        originalPrice: 31980,
        stock: 9,
      },
      {
        grade: 'B',
        price: 19980,
        originalPrice: 31980,
        stock: 14,
      },
    ],
  },
  {
    name: 'Samsung Galaxy S23',
    slug: 'samsung-galaxy-s23',
    image: '/assets/images/products/samsung-galaxy-s23/primary.jpg',
    thumbnail: '/assets/images/products/samsung-galaxy-s23/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 15980,
        originalPrice: 23980,
        stock: 7,
      },
      {
        grade: 'A',
        price: 14480,
        originalPrice: 23980,
        stock: 18,
      },
    ],
  },
  {
    name: 'Google Pixel 7 Pro',
    slug: 'google-pixel-7-pro',
    image: '/assets/images/products/google-pixel-7-pro/primary.jpg',
    thumbnail: '/assets/images/products/google-pixel-7-pro/thumbnail.jpg',
    category: 'Smartphones',
    variants: [
      {
        grade: 'A+',
        price: 14500,
        originalPrice: 21000,
        stock: 10,
      },
      {
        grade: 'A',
        price: 13000,
        originalPrice: 21000,
        stock: 20,
      },
    ],
  },
  {
    name: 'MacBook Air M2',
    slug: 'macbook-air-m2',
    image: '/assets/images/products/macbook-air-m2/primary.jpg',
    thumbnail: '/assets/images/products/macbook-air-m2/thumbnail.jpg',
    category: 'Laptops',
    variants: [
      {
        grade: 'A',
        price: 22000,
        originalPrice: 30000,
        stock: 15,
      },
      {
        grade: 'B',
        price: 19000,
        originalPrice: 30000,
        stock: 25,
      },
    ],
  },
  {
    name: 'iPad Pro 11-inch',
    slug: 'ipad-pro-11-inch',
    image: '/assets/images/products/ipad-pro-11-inch/primary.jpg',
    thumbnail: '/assets/images/products/ipad-pro-11-inch/thumbnail.jpg',
    category: 'Tablets',
    variants: [
      {
        grade: 'A+',
        price: 16000,
        originalPrice: 22000,
        stock: 10,
      },
    ],
  },
  {
    name: 'PlayStation 5',
    slug: 'playstation-5',
    image: '/assets/images/products/playstation-5/primary.jpg',
    thumbnail: '/assets/images/products/playstation-5/thumbnail.jpg',
    category: 'Consoles',
    variants: [
      {
        grade: 'A',
        price: 9980,
        originalPrice: 13980,
        stock: 10,
      },
      {
        grade: 'B',
        price: 8480,
        originalPrice: 13980,
        stock: 15,
      },
    ],
  },
  {
    name: 'Xbox Series X',
    slug: 'xbox-series-x',
    image: '/assets/images/products/xbox-series-x/primary.jpg',
    thumbnail: '/assets/images/products/xbox-series-x/thumbnail.jpg',
    category: 'Consoles',
    variants: [
      {
        grade: 'A',
        price: 8980,
        originalPrice: 12980,
        stock: 8,
      },
    ],
  },
  {
    name: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    image: '/assets/images/products/nintendo-switch-oled/primary.jpg',
    thumbnail: '/assets/images/products/nintendo-switch-oled/thumbnail.jpg',
    category: 'Consoles',
    variants: [
      {
        grade: 'A+',
        price: 6980,
        originalPrice: 8980,
        stock: 12,
      },
    ],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh-1000xm5',
    image: '/assets/images/products/sony-wh-1000xm5/primary.jpg',
    thumbnail: '/assets/images/products/sony-wh-1000xm5/thumbnail.jpg',
    category: 'Accessories',
    variants: [
      {
        grade: 'A',
        price: 5500,
        originalPrice: 8000,
        stock: 20,
      },
    ],
  },
  {
    name: 'Apple Watch Series 8',
    slug: 'apple-watch-series-8',
    image: '/assets/images/products/apple-watch-series-8/primary.jpg',
    thumbnail: '/assets/images/products/apple-watch-series-8/thumbnail.jpg',
    category: 'Wearables',
    variants: [
      {
        grade: 'A+',
        price: 7500,
        originalPrice: 10000,
        stock: 15,
      },
    ],
  },
  {
    name: 'Dell UltraSharp U2723QE Monitor',
    slug: 'dell-ultrasharp-u2723qe',
    image: '/assets/images/products/dell-ultrasharp-u2723qe/primary.jpg',
    thumbnail: '/assets/images/products/dell-ultrasharp-u2723qe/thumbnail.jpg',
    category: 'Monitors',
    variants: [
      {
        grade: 'A',
        price: 12000,
        originalPrice: 18000,
        stock: 10,
      },
    ],
  },
  {
    name: 'PlayStation 5 Edición Limitada 30 Aniversario',
    slug: 'playstation-5-edicion-limitada-30-aniversario',
    image: '/assets/images/products/playstation-5-30th-anniversary/primary.jpg',
    thumbnail: '/assets/images/products/playstation-5-30th-anniversary/thumbnail.jpg',
    category: 'Consoles',
    variants: [
      {
        grade: 'Nuevo',
        price: 18239,
        originalPrice: 24599,
        stock: 2,
      },
    ],
  },
  {
    name: 'PlayStation 5 Edición Limitada Gold Ghost Of Yotei 1 TB',
    slug: 'playstation-5-gold-ghost-of-yotei',
    image: '/assets/images/products/playstation-5-gold-ghost-of-yotei/primary.jpg',
    thumbnail: '/assets/images/products/playstation-5-gold-ghost-of-yotei/thumbnail.jpg',
    category: 'Consoles',
    variants: [
      {
        grade: 'Nuevo',
        price: 15999,
        originalPrice: 18999,
        stock: 3,
      },
    ],
  },
  {
    name: 'Control Inalámbrico DualSense PlayStation 5 Midnight Black',
    slug: 'dualsense-midnight-black',
    image: '/assets/images/products/dualsense-midnight-black/primary.jpg',
    thumbnail: '/assets/images/products/dualsense-midnight-black/thumbnail.jpg',
    category: 'Accessories',
    variants: [
      {
        grade: 'Nuevo',
        price: 1399,
        originalPrice: 1599,
        stock: 15,
      },
    ],
  },
  {
    name: 'Consola PlayStation 5 Digital 1 TB más Astro Bot y Gran Turismo 7',
    slug: 'playstation-5-digital-astro-bot-gt7',
    image: '/assets/images/products/playstation-5-digital-bundle/primary.jpg',
    thumbnail: '/assets/images/products/playstation-5-digital-bundle/thumbnail.jpg',
    category: 'Consoles',
    variants: [
      {
        grade: 'Nuevo',
        price: 11499,
        originalPrice: 12999,
        stock: 8,
      },
    ],
  },
  {
    name: 'TV Hisense 43 Pulgadas Full HD 43A4NV',
    slug: 'tv-hisense-43-43a4nv',
    image: '/assets/images/products/tv-hisense-43-43a4nv/primary.jpg',
    thumbnail: '/assets/images/products/tv-hisense-43-43a4nv/thumbnail.jpg',
    category: 'TVs',
    variants: [
      {
        grade: 'Nuevo',
        price: 5999,
        originalPrice: 7499,
        stock: 12,
      },
    ],
  },
  {
    name: 'Pantalla 42\'\' Samsung AI OLED 4K S90D NQ4 AI Gen2 Tizen OS',
    slug: 'samsung-42-oled-s90d',
    image: '/assets/images/products/samsung-42-oled-s90d/primary.jpg',
    thumbnail: '/assets/images/products/samsung-42-oled-s90d/thumbnail.jpg',
    category: 'TVs',
    variants: [
      {
        grade: 'Nuevo',
        price: 19999,
        originalPrice: 24999,
        stock: 4,
      },
    ],
  },
  {
    name: 'Combo Pantalla 75\'\' Samsung Crystal U8200F 4K Smart TV (2025) + Barra de sonido 2.1 Ch Subwoofer B-series HW-B450F (2025) Negro',
    slug: 'samsung-75-u8200f-barra-sonido',
    image: '/assets/images/products/samsung-75-u8200f-bundle/primary.jpg',
    thumbnail: '/assets/images/products/samsung-75-u8200f-bundle/thumbnail.jpg',
    category: 'TVs',
    variants: [
      {
        grade: 'Nuevo',
        price: 16999,
        originalPrice: 21999,
        stock: 5,
      },
    ],
  },
  {
    name: 'TV Samsung 55 pulgadas 4K Ultra HD Smart TV LED UN-55DU7000',
    slug: 'samsung-55-du7000',
    image: '/assets/images/products/samsung-55-du7000/primary.jpg',
    thumbnail: '/assets/images/products/samsung-55-du7000/thumbnail.jpg',
    category: 'TVs',
    variants: [
      {
        grade: 'Nuevo',
        price: 8999,
        originalPrice: 11999,
        stock: 10,
      },
    ],
  },
  {
    name: 'TV Hisense 65 pulgadas 4K 65U6QV Miniled vidaa',
    slug: 'hisense-65-u6qv',
    image: '/assets/images/products/hisense-65-u6qv/primary.jpg',
    thumbnail: '/assets/images/products/hisense-65-u6qv/thumbnail.jpg',
    category: 'TVs',
    variants: [
      {
        grade: 'Nuevo',
        price: 9339,
        originalPrice: 15499,
        stock: 6,
      },
    ],
  },
  {
    name: 'Televisión Samsung 75 Pulgadas 4K Smart Crystal UHD UN75U8000FFXZX',
    slug: 'samsung-75-u8000f',
    image: '/assets/images/products/samsung-75-u8000f/primary.jpg',
    thumbnail: '/assets/images/products/samsung-75-u8000f/thumbnail.jpg',
    category: 'TVs',
    variants: [
      {
        grade: 'Nuevo',
        price: 12995,
        originalPrice: 19993,
        stock: 4,
      },
    ],
  },
  {
    name: 'MacBook Apple Chip M2 con CPU de 8 núcleos y GPU de 8 núcleos, 16 GB RAM, 256 GB SSD',
    slug: 'macbook-m2-16gb',
    image: '/assets/images/products/macbook-m2-16gb/primary.jpg',
    thumbnail: '/assets/images/products/macbook-m2-16gb/thumbnail.jpg',
    category: 'Laptops',
    variants: [
      {
        grade: 'Nuevo',
        price: 25999,
        originalPrice: 32999,
        stock: 5,
      },
    ],
  },
];

export const products = BASE_PRODUCTS;
