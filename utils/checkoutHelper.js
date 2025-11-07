/**
 * Utilidad para integrar el servicio de pagos con el checkout
 */

/**
 * Procesa el checkout y crea una orden con pago pendiente
 * @param {Object} checkoutData - Datos del checkout
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function processCheckout(checkoutData) {
  try {
    const { customer, shipping, cart, totals, paymentMethod } = checkoutData;

    // Preparar los items del carrito
    const items = cart.map(item => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
      image: item.image ?? null,
      grade: item.grade ?? null,
      category: item.category ?? null,
    }));

    // Crear la orden mediante la API
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer,
        shipping,
        items,
        totals,
        paymentMethod,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error al procesar la orden');
    }

    return {
      success: true,
      order: result.order,
      payment: result.payment,
    };
  } catch (error) {
    console.error('Error en processCheckout:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Obtiene las órdenes del usuario actual
 * @returns {Promise<Object>} - Lista de órdenes
 */
export async function getUserOrders() {
  try {
    const response = await fetch('/api/payments/my-orders');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error al obtener órdenes');
    }

    return {
      success: true,
      orders: result.orders,
    };
  } catch (error) {
    console.error('Error en getUserOrders:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Obtiene los detalles de una orden específica
 * @param {string} orderNumber - Número de orden
 * @returns {Promise<Object>} - Detalles de la orden
 */
export async function getOrderDetails(orderNumber) {
  try {
    const response = await fetch(
      `/api/payments/order-details?orderNumber=${encodeURIComponent(orderNumber)}`
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error al obtener detalles de la orden');
    }

    return {
      success: true,
      order: result.order,
    };
  } catch (error) {
    console.error('Error en getOrderDetails:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Formatea el estado de una orden para mostrar
 * @param {string} status - Estado de la orden
 * @returns {Object} - Información formateada del estado
 */
export function formatOrderStatus(status) {
  const statusMap = {
    PENDING: {
      label: 'Pendiente',
      color: '#f59e0b',
      description: 'Esperando confirmación de pago',
    },
    PAYMENT_CONFIRMED: {
      label: 'Pago Confirmado',
      color: '#10b981',
      description: 'Pago verificado, preparando envío',
    },
    PROCESSING: {
      label: 'En Proceso',
      color: '#3b82f6',
      description: 'Preparando tu pedido',
    },
    SHIPPED: {
      label: 'Enviado',
      color: '#8b5cf6',
      description: 'En camino a tu dirección',
    },
    DELIVERED: {
      label: 'Entregado',
      color: '#059669',
      description: 'Pedido entregado exitosamente',
    },
    CANCELLED: {
      label: 'Cancelado',
      color: '#ef4444',
      description: 'Pedido cancelado',
    },
    REFUNDED: {
      label: 'Reembolsado',
      color: '#6366f1',
      description: 'Reembolso procesado',
    },
  };

  return statusMap[status] || {
    label: status,
    color: '#6b7280',
    description: 'Estado desconocido',
  };
}

/**
 * Formatea el método de pago para mostrar
 * @param {string} method - Método de pago
 * @returns {string} - Nombre formateado del método
 */
export function formatPaymentMethod(method) {
  const methodMap = {
    BANK_TRANSFER: 'Transferencia Bancaria',
    CASH_DEPOSIT: 'Depósito en Efectivo',
    PHONE_PAYMENT: 'Pago Telefónico',
    STORE_PAYMENT: 'Pago en Tienda',
  };

  return methodMap[method] || method;
}

/**
 * Formatea el estado del pago para mostrar
 * @param {string} status - Estado del pago
 * @returns {Object} - Información formateada del estado
 */
export function formatPaymentStatus(status) {
  const statusMap = {
    PENDING: {
      label: 'Pendiente',
      color: '#f59e0b',
      icon: '⏳',
    },
    PROCESSING: {
      label: 'En Verificación',
      color: '#3b82f6',
      icon: '🔍',
    },
    COMPLETED: {
      label: 'Completado',
      color: '#10b981',
      icon: '✅',
    },
    FAILED: {
      label: 'Fallido',
      color: '#ef4444',
      icon: '❌',
    },
    REFUNDED: {
      label: 'Reembolsado',
      color: '#6366f1',
      icon: '💰',
    },
    CANCELLED: {
      label: 'Cancelado',
      color: '#6b7280',
      icon: '🚫',
    },
  };

  return statusMap[status] || {
    label: status,
    color: '#6b7280',
    icon: '❓',
  };
}
