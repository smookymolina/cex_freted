import { products } from '../../../data/mock/products';
import { BUEN_FIN_PROMO, isBuenFinActive } from '../../../config/promotions';

const HERO_OFFER_CONFIG = [
  {
    id: 1,
    type: 'offer',
    slug: 'iphone-16-pro-max',
    variantGrade: 'A+',
    badge: `${BUEN_FIN_PROMO.badge} flagship`,
    title: 'Buen Fin: iPhone 16 Pro Max con upgrade express',
    subtitle: 'Estado A+ | 256GB | -$1,500 MXN adicionales + entrega gratis en 24h CDMX/MTY',
    primaryCta: {
      text: 'Ver oferta',
      href: '/productos/iphone-16-pro-max',
    },
    secondaryCta: {
      text: 'Ver catalogo',
      href: '/comprar',
    },
    image: BUEN_FIN_PROMO.hero.backgroundImages.appleEcosystem,
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
    badge: `${BUEN_FIN_PROMO.badge} fotografia`,
    title: 'S24 Ultra + kit creator por el Buen Fin',
    subtitle:
      'Incluye S Pen, onboarding remoto y -$1,500 MXN extra vs precio web todo noviembre 2025',
    primaryCta: {
      text: 'Aprovechar oferta',
      href: '/productos/samsung-galaxy-s24-ultra',
    },
    secondaryCta: {
      text: 'Ver catalogo',
      href: '/comprar?category=Smartphones',
    },
    image: BUEN_FIN_PROMO.hero.backgroundImages.flagshipPhones,
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
    badge: `${BUEN_FIN_PROMO.badge} laptops`,
    title: 'MacBook Air M2 para home office sin ruido',
    subtitle:
      'Estado A | 8GB RAM | 256GB SSD | -$1,500 MXN por Buen Fin + configuracion lista para entregar',
    primaryCta: {
      text: 'Comprar ahora',
      href: '/productos/macbook-air-m2',
    },
    secondaryCta: {
      text: 'Mas laptops',
      href: '/comprar?category=Laptops',
    },
    image: BUEN_FIN_PROMO.hero.backgroundImages.gamerSetups,
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

    const buenFinMetadata = isBuenFinActive()
      ? {
          buenFinApplied: true,
          buenFinSavings: BUEN_FIN_PROMO.extraDiscountAmount,
        }
      : {};

    return {
      ...presentation,
      originalPrice,
      offerPrice,
      discount,
      ...buenFinMetadata,
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
