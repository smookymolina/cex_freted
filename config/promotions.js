export const BUEN_FIN_PROMO = {
  name: 'Buen Fin',
  slug: 'buen-fin-2025',
  extraDiscountAmount: 1500,
  badge: 'Buen Fin',
  // Campana interna solicitada: desde hoy (11 de noviembre 2025) hasta el domingo 16.
  startDate: '2025-11-11T00:00:00-06:00',
  endDate: '2025-11-16T23:59:59-06:00',
  hero: {
    highlights: [
      'Envio express sin costo durante la campana',
      '12 meses de garantia premium incluidos',
      'Diagnostico de bateria y camara certificado en 30 puntos',
    ],
    backgroundImages: {
      flagshipPhones: '/images/hero/offers/buen-fin-flagship-phones.png',
      appleEcosystem: '/images/hero/offers/buen-fin-apple-ecosystem.png',
      gamerSetups: '/images/hero/offers/buen-fin-gamer-setups.png',
    },
  },
  messaging: {
    heroDeadlineLabel: 'Termina domingo 16 de noviembre',
    savingsLabel: 'Ahorra $1,500 MXN extra en todo el catalogo',
  },
};

export const isBuenFinActive = (now = new Date()) => {
  const start = new Date(BUEN_FIN_PROMO.startDate);
  const end = new Date(BUEN_FIN_PROMO.endDate);
  return now >= start && now <= end;
};

export const applyBuenFinDiscount = (price) => {
  if (typeof price !== 'number' || Number.isNaN(price)) {
    return { discountedPrice: null, savings: null };
  }

  const savings = BUEN_FIN_PROMO.extraDiscountAmount;
  const discountedPrice = Math.max(price - savings, 0);
  return { discountedPrice, savings };
};
