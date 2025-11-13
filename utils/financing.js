/**
 * Configuración y utilidades para meses sin intereses
 * Reglas:
 * - Smartphones: 15% de comisión
 * - Consolas: 12% de comisión
 * - iPhone más caro (>= 25000): 18 meses sin intereses
 * - Otros productos: 6, 9 o 12 meses según precio
 */

export const FINANCING_CONFIG = {
  categories: {
    Smartphones: {
      commission: 0.15,
      defaultMonths: 12,
    },
    Consoles: {
      commission: 0.12,
      defaultMonths: 12,
    },
    Laptops: {
      commission: 0.10,
      defaultMonths: 12,
    },
    Tablets: {
      commission: 0.10,
      defaultMonths: 9,
    },
    default: {
      commission: 0.08,
      defaultMonths: 6,
    },
  },

  // iPhone premium con 18 MSI
  premiumThreshold: 25000,
  premiumMonths: 18,
};

/**
 * Calcula los meses sin intereses disponibles según categoría y precio
 * @param {string} category - Categoría del producto
 * @param {number} price - Precio del producto
 * @param {string} productName - Nombre del producto
 * @returns {number} - Meses sin intereses disponibles
 */
export function getMonthsWithoutInterest(category, price, productName = '') {
  // iPhone premium de alto precio
  if (
    category === 'Smartphones' &&
    productName.toLowerCase().includes('iphone') &&
    price >= FINANCING_CONFIG.premiumThreshold
  ) {
    return FINANCING_CONFIG.premiumMonths;
  }

  // Obtener configuración por categoría
  const config = FINANCING_CONFIG.categories[category] || FINANCING_CONFIG.categories.default;

  // Ajustar meses según precio
  if (price >= 20000) {
    return Math.max(config.defaultMonths, 12);
  } else if (price >= 10000) {
    return Math.min(config.defaultMonths, 12);
  } else if (price >= 5000) {
    return Math.min(config.defaultMonths, 9);
  } else {
    return 6;
  }
}

/**
 * Calcula la comisión por financiamiento
 * @param {string} category - Categoría del producto
 * @param {number} price - Precio base del producto
 * @returns {number} - Comisión a agregar
 */
export function getFinancingCommission(category, price) {
  const config = FINANCING_CONFIG.categories[category] || FINANCING_CONFIG.categories.default;
  return price * config.commission;
}

/**
 * Calcula el pago mensual sin intereses
 * @param {number} totalPrice - Precio total con comisión
 * @param {number} months - Meses sin intereses
 * @returns {number} - Pago mensual
 */
export function getMonthlyPayment(totalPrice, months) {
  return totalPrice / months;
}

/**
 * Obtiene información completa de financiamiento para un producto
 * @param {object} product - Producto con category, name, y variants
 * @param {number} price - Precio seleccionado
 * @returns {object} - Información de financiamiento
 */
export function getFinancingInfo(product, price) {
  const months = getMonthsWithoutInterest(
    product.category,
    price,
    product.name
  );

  const commission = getFinancingCommission(product.category, price);
  const totalWithFinancing = price + commission;
  const monthlyPayment = getMonthlyPayment(totalWithFinancing, months);

  return {
    months,
    commission,
    commissionPercentage: (commission / price) * 100,
    totalWithFinancing,
    monthlyPayment,
    originalPrice: price,
  };
}

/**
 * Formatea el pago mensual para mostrar en UI
 * @param {number} monthlyPayment - Pago mensual
 * @returns {string} - Formato de moneda
 */
export function formatMonthlyPayment(monthlyPayment) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monthlyPayment);
}
