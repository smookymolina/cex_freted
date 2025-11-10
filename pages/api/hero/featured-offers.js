import { products } from '../../../data/mock/products';

const HERO_OFFER_CONFIG = [
  {
    id: 1,
    type: 'offer',
    slug: 'iphone-16-pro-max',
    variantGrade: 'A+',
    badge: 'Oferta especial',
    title: 'iPhone 16 Pro Max reacondicionado y certificado',
    subtitle: 'Estado A+ | 256GB | Garantia 12 meses | Envio express incluido',
    primaryCta: {
      text: 'Ver oferta',
      href: '/productos/iphone-16-pro-max',
    },
    secondaryCta: {
      text: 'Ver catalogo',
      href: '/comprar',
    },
    image: '/assets/images/products/iphone-16-pro-max/primary.jpg',
    fallbackPricing: {
      originalPrice: 34980,
      offerPrice: 26980,
    },
  },
  {
    id: 2,
    type: 'offer',
    slug: 'samsung-galaxy-s24-ultra',
    variantGrade: 'A',
    badge: 'Super oferta',
    title: 'Samsung Galaxy S24 Ultra con onboarding gratuito',
    subtitle: 'Estado A | 256GB | Garantia extendida | Envio gratis incluido',
    primaryCta: {
      text: 'Aprovechar oferta',
      href: '/productos/samsung-galaxy-s24-ultra',
    },
    secondaryCta: {
      text: 'Ver catalogo',
      href: '/comprar?category=Smartphones',
    },
    image: '/assets/images/products/samsung-galaxy-s24-ultra/primary.jpg',
    fallbackPricing: {
      originalPrice: 31980,
      offerPrice: 21480,
    },
  },
  {
    id: 3,
    type: 'offer',
    slug: 'macbook-air-m2',
    variantGrade: 'A',
    badge: 'Laptops top',
    title: 'MacBook Air M2 lista para entregar hoy mismo',
    subtitle: 'Estado A | 8GB RAM | 256GB SSD | macOS Sonoma limpio',
    primaryCta: {
      text: 'Comprar ahora',
      href: '/productos/macbook-air-m2',
    },
    secondaryCta: {
      text: 'Mas laptops',
      href: '/comprar?category=Laptops',
    },
    image: '/assets/images/products/macbook-air-m2/primary.jpg',
    fallbackPricing: {
      originalPrice: 30000,
      offerPrice: 22000,
    },
  },
];

const formatDiscount = (originalPrice, offerPrice) => {
  if (!originalPrice || !offerPrice || offerPrice >= originalPrice) {
    return null;
  }

  const discountValue = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  return discountValue > 0 ? `${discountValue}%` : null;
};

const getPricingFromCatalog = (slug, grade) => {
  const product = products.find((item) => item.slug === slug);
  if (!product || !Array.isArray(product.variants)) {
    return null;
  }

  const variant =
    product.variants.find((item) => item.grade === grade) ?? product.variants[0] ?? null;

  if (!variant || !variant.price) {
    return null;
  }

  return {
    originalPrice: variant.originalPrice ?? null,
    offerPrice: variant.price,
  };
};

const buildFeaturedOffers = () =>
  HERO_OFFER_CONFIG.map((config) => {
    const { slug, variantGrade, fallbackPricing, ...presentation } = config;
    const pricing = getPricingFromCatalog(slug, variantGrade) ?? fallbackPricing ?? null;

    if (!pricing?.offerPrice) {
      return null;
    }

    const originalPrice = pricing.originalPrice ?? null;
    const offerPrice = pricing.offerPrice;
    const discount = formatDiscount(originalPrice, offerPrice);

    return {
      ...presentation,
      originalPrice,
      offerPrice,
      discount,
    };
  }).filter(Boolean);

// API para obtener las mejores ofertas destacadas para el banner hero
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const featuredOffers = buildFeaturedOffers();

    res.status(200).json({
      success: true,
      offers: featuredOffers,
      count: featuredOffers.length,
    });
  } catch (error) {
    console.error('Error fetching featured offers:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las ofertas destacadas',
    });
  }
}
