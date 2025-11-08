/**
 * Configuración de datos de órdenes de compra por método de pago
 * Estos datos se liberan al cliente después de la confirmación telefónica del soporte
 */

export const PAYMENT_ORDER_DATA = {
  BANK_TRANSFER: {
    title: 'Orden de Compra - Transferencia Bancaria',
    description: 'Realiza tu transferencia a la siguiente cuenta bancaria',
    instructions: [
      'Realiza la transferencia desde tu banca en línea o app móvil',
      'Utiliza tu número de referencia como concepto de pago',
      'Guarda el comprobante de transferencia',
      'Sube tu comprobante en la sección "Mis Pedidos"',
      'Espera la confirmación de pago (1-2 horas hábiles)',
    ],
    accounts: [
      {
        bank: 'BBVA Bancomer',
        accountHolder: 'Sociedad Tecnológica Integral SA de CV',
        accountNumber: '0123456789',
        clabe: '012180001234567890',
        cardNumber: '4152 3141 2345 6789',
      },
      {
        bank: 'Santander',
        accountHolder: 'Sociedad Tecnológica Integral SA de CV',
        accountNumber: '9876543210',
        clabe: '014180009876543210',
        cardNumber: '5256 7890 1234 5678',
      },
    ],
    importantNotes: [
      'El monto debe ser exacto al total de tu pedido',
      'Las transferencias se verifican en horario de 9:00 AM a 6:00 PM',
      'Transferencias realizadas después de las 6:00 PM se procesarán al día siguiente',
    ],
  },

  CASH_DEPOSIT: {
    title: 'Orden de Compra - Depósito en Efectivo',
    description: 'Realiza tu depósito en efectivo en cualquier sucursal bancaria',
    instructions: [
      'Acude a cualquier sucursal de los bancos listados',
      'Solicita un depósito en efectivo a la cuenta indicada',
      'Menciona tu número de referencia al cajero',
      'Guarda la ficha de depósito sellada por el banco',
      'Sube la foto o PDF de tu ficha en "Mis Pedidos"',
      'Tu pago se confirmará en 2-4 horas hábiles',
    ],
    accounts: [
      {
        bank: 'BBVA Bancomer',
        accountHolder: 'Sociedad Tecnológica Integral SA de CV',
        accountNumber: '0123456789',
        clabe: '012180001234567890',
      },
      {
        bank: 'Santander',
        accountHolder: 'Sociedad Tecnológica Integral SA de CV',
        accountNumber: '9876543210',
        clabe: '014180009876543210',
      },
      {
        bank: 'Banorte',
        accountHolder: 'Sociedad Tecnológica Integral SA de CV',
        accountNumber: '1122334455',
        clabe: '072180001122334455',
      },
    ],
    importantNotes: [
      'El depósito debe ser por el monto exacto de tu pedido',
      'Conserva tu ficha de depósito original',
      'Los depósitos después de las 5:00 PM se reflejan al día siguiente',
      'Comisiones bancarias corren por cuenta del cliente',
    ],
  },

  PHONE_PAYMENT: {
    title: 'Orden de Compra - Pago Telefónico',
    description: 'Realiza tu pago por teléfono de forma segura',
    instructions: [
      'Llama al número telefónico proporcionado',
      'Ten a la mano tu tarjeta de crédito o débito',
      'Proporciona tu número de referencia',
      'Nuestro ejecutivo procesará tu pago de forma segura',
      'Recibirás confirmación inmediata por correo',
      'No es necesario subir comprobante',
    ],
    contactInfo: {
      phone: '55 8526 4826',
      whatsapp: '+52 1 55 8526 4826',
      email: 'ventas@cexfreted.com',
      schedule: 'Lunes a Viernes: 9:00 AM - 7:00 PM | Sábados: 10:00 AM - 2:00 PM',
    },
    acceptedCards: [
      'Visa',
      'Mastercard',
      'American Express',
      'Débito Bancario',
    ],
    importantNotes: [
      'Método más rápido y recomendado',
      'Pago procesado de inmediato',
      'Conexión segura y encriptada',
      'Nunca compartas tu NIP o CVV por otros medios',
    ],
  },

  STORE_PAYMENT: {
    title: 'Orden de Compra - Pago en Tienda',
    description: 'Visita nuestras tiendas físicas y paga en persona',
    instructions: [
      'Acude a cualquiera de nuestras sucursales',
      'Menciona tu número de orden o referencia',
      'Realiza el pago en efectivo o con tarjeta',
      'Recibe tu ticket de pago',
      'Tu pedido será enviado el mismo día',
      'También puedes recoger tu pedido en tienda si prefieres',
    ],
    stores: [
      {
        name: 'Sucursal Centro',
        address: 'Av. Juárez #123, Col. Centro',
        city: 'Ciudad de México',
        postalCode: '06000',
        phone: '(55) 1234-5678',
        schedule: 'Lun-Vie: 9:00 AM - 7:00 PM | Sáb: 10:00 AM - 3:00 PM',
        parking: true,
      },
      {
        name: 'Sucursal Polanco',
        address: 'Av. Presidente Masaryk #456, Col. Polanco',
        city: 'Ciudad de México',
        postalCode: '11560',
        phone: '(55) 8765-4321',
        schedule: 'Lun-Vie: 10:00 AM - 8:00 PM | Sáb: 10:00 AM - 4:00 PM',
        parking: true,
      },
      {
        name: 'Sucursal Guadalajara',
        address: 'Av. Vallarta #789, Col. Americana',
        city: 'Guadalajara, Jalisco',
        postalCode: '44160',
        phone: '(33) 2345-6789',
        schedule: 'Lun-Vie: 9:00 AM - 7:00 PM | Sáb: 10:00 AM - 2:00 PM',
        parking: false,
      },
    ],
    importantNotes: [
      'Recoge tu pedido el mismo día sin costo de envío',
      'Pagos en efectivo hasta $50,000 MXN',
      'Acepta todas las tarjetas de crédito y débito',
      'Lleva tu identificación oficial',
    ],
  },

  CONVENIENCE_STORE: {
    title: 'Orden de Compra - Pago en Autoservicio',
    description: 'Paga en cualquier Oxxo, 7-Eleven, Soriana o más',
    instructions: [
      'Acude a tu tienda de conveniencia más cercana',
      'Presenta tu código de barras o número de referencia',
      'Realiza el pago en efectivo en la caja',
      'Solicita tu comprobante de pago',
      'Sube la foto de tu comprobante en "Mis Pedidos"',
      'Tu pago se confirmará en 1-3 horas',
    ],
    convenientStores: [
      'Oxxo',
      '7-Eleven',
      'Extra',
      'Circle K',
      'Soriana',
      'Walmart',
      'Bodega Aurrera',
    ],
    paymentLimits: {
      min: 50,
      max: 10000,
      currency: 'MXN',
    },
    importantNotes: [
      'Monto mínimo: $50 MXN',
      'Monto máximo: $10,000 MXN por transacción',
      'Solo acepta pagos en efectivo',
      'Comprobante es indispensable para confirmar tu pago',
      'Disponible 24/7 en miles de tiendas',
    ],
  },
};

/**
 * Obtener datos de orden de compra según método de pago
 * @param {string} paymentMethod - Método de pago
 * @returns {Object} Datos de la orden de compra
 */
export function getPaymentOrderData(paymentMethod) {
  return PAYMENT_ORDER_DATA[paymentMethod] || null;
}

/**
 * Generar datos de orden de compra con número de referencia incluido
 * @param {string} paymentMethod - Método de pago
 * @param {string} referenceNumber - Número de referencia del pago
 * @param {number} totalAmount - Monto total del pedido
 * @returns {Object} Datos completos de la orden de compra
 */
export function generateOrderRelease(paymentMethod, referenceNumber, totalAmount) {
  const baseData = PAYMENT_ORDER_DATA[paymentMethod];

  if (!baseData) {
    return null;
  }

  return {
    ...baseData,
    referenceNumber,
    totalAmount,
    currency: 'MXN',
    releasedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
  };
}

export default PAYMENT_ORDER_DATA;
