import { PrismaClient } from '@prisma/client';
import { generateOrderRelease } from '../config/paymentOrderData';

const prisma = new PrismaClient();

/**
 * Servicio de procesamiento de pagos interno
 * No requiere APIs externas - gestiona pagos de forma local
 */
class PaymentService {
  /**
   * Genera un número de orden único
   */
  static generateOrderNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    return `STI-${year}-${random}`;
  }

  /**
   * Genera un número de referencia de pago único
   */
  static generatePaymentReference() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp}-${random}`;
  }

  /**
   * Crea una nueva orden con pago pendiente
   * @param {Object} orderData - Datos de la orden
   * @param {string} orderData.userId - ID del usuario
   * @param {Object} orderData.customer - Información del cliente
   * @param {Object} orderData.shipping - Información de envío
   * @param {Array} orderData.items - Items del pedido
   * @param {Object} orderData.totals - Totales del pedido
   * @param {string} orderData.paymentMethod - Método de pago seleccionado
   * @returns {Promise<Object>} - Orden creada con información del pago
   */
  static async createOrder(orderData) {
    try {
      const {
        userId,
        customer,
        shipping,
        items,
        totals,
        paymentMethod = 'PHONE_PAYMENT',
      } = orderData;

      // Validar datos requeridos
      if (!userId || !customer || !shipping || !items || !totals) {
        throw new Error('Faltan datos requeridos para crear la orden');
      }

      // Generar números únicos
      const orderNumber = this.generateOrderNumber();
      const paymentReference = this.generatePaymentReference();

      // Crear la orden con el pago pendiente en una transacción
      const order = await prisma.$transaction(async (tx) => {
        // Inicializar historial de tracking
        const initialTracking = [
          {
            status: 'ORDER_RECEIVED',
            timestamp: new Date().toISOString(),
            note: 'Pedido registrado exitosamente',
          },
        ];

        // Crear la orden
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId,
            customerName: customer.fullName,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            shippingAddress: shipping.address,
            shippingCity: shipping.city,
            shippingState: shipping.state,
            shippingPostalCode: shipping.postalCode,
            shippingReferences: shipping.references || null,
            subtotal: totals.subtotal,
            shippingCost: totals.shippingCost,
            total: totals.total,
            items: items,
            status: 'PENDING',
            paymentReleaseStatus: 'WAITING_SUPPORT',
            trackingStatus: 'ORDER_RECEIVED',
            trackingHistory: initialTracking,
          },
        });

        // Crear el pago pendiente
        const payment = await tx.payment.create({
          data: {
            orderId: newOrder.id,
            amount: totals.total,
            paymentMethod,
            status: 'PENDING',
            referenceNumber: paymentReference,
          },
        });

        return {
          ...newOrder,
          payment,
        };
      });

      return {
        success: true,
        order,
        orderNumber,
        paymentReference,
      };
    } catch (error) {
      console.error('Error al crear orden:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene una orden por su número
   * @param {string} orderNumber - Número de orden
   * @returns {Promise<Object>} - Orden encontrada
   */
  static async getOrderByNumber(orderNumber) {
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          payments: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        return {
          success: false,
          error: 'Orden no encontrada',
        };
      }

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error al obtener orden:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene todas las órdenes de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} - Lista de órdenes
   */
  static async getUserOrders(userId) {
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          payments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        orders,
      };
    } catch (error) {
      console.error('Error al obtener órdenes del usuario:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Procesa y confirma un pago (para uso administrativo)
   * @param {string} paymentId - ID del pago
   * @param {Object} confirmationData - Datos de confirmación
   * @param {string} confirmationData.transactionId - ID de transacción
   * @param {string} confirmationData.processedBy - Usuario que procesó
   * @param {Object} confirmationData.metadata - Metadatos adicionales
   * @param {string} confirmationData.notes - Notas sobre el pago
   * @returns {Promise<Object>} - Pago confirmado
   */
  static async confirmPayment(paymentId, confirmationData) {
    try {
      const { transactionId, processedBy, metadata, notes } = confirmationData;

      const result = await prisma.$transaction(async (tx) => {
        // Actualizar el pago
        const payment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: 'COMPLETED',
            transactionId: transactionId || null,
            processedBy,
            processedAt: new Date(),
            paymentMetadata: metadata || null,
            notes: notes || null,
          },
          include: {
            order: true,
          },
        });

        // Actualizar el estado de la orden
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            status: 'PAYMENT_CONFIRMED',
          },
        });

        return payment;
      });

      return {
        success: true,
        payment: result,
      };
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Rechaza o cancela un pago
   * @param {string} paymentId - ID del pago
   * @param {string} reason - Razón del rechazo
   * @param {string} processedBy - Usuario que procesó
   * @returns {Promise<Object>} - Pago cancelado
   */
  static async cancelPayment(paymentId, reason, processedBy) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: 'CANCELLED',
            processedBy,
            processedAt: new Date(),
            notes: reason,
          },
          include: {
            order: true,
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            status: 'CANCELLED',
          },
        });

        return payment;
      });

      return {
        success: true,
        payment: result,
      };
    } catch (error) {
      console.error('Error al cancelar pago:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Actualiza el estado de una orden
   * @param {string} orderId - ID de la orden
   * @param {string} newStatus - Nuevo estado
   * @returns {Promise<Object>} - Orden actualizada
   */
  static async updateOrderStatus(orderId, newStatus) {
    try {
      const validStatuses = [
        'PENDING',
        'PAYMENT_CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED',
      ];

      if (!validStatuses.includes(newStatus)) {
        throw new Error('Estado de orden inválido');
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        include: {
          payments: true,
        },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Actualiza el estado de liberaci��n de pago de una orden
   * @param {string} orderId
   * @param {string} releaseStatus
   * @param {Object} options
   * @param {string} options.notes
   * @param {string} options.supportUserId
   * @returns {Promise<Object>}
   */
  static async updatePaymentRelease(orderId, releaseStatus, options = {}) {
    try {
      const validReleaseStatuses = [
        'WAITING_SUPPORT',
        'CALL_SCHEDULED',
        'RELEASED_TO_CUSTOMER',
        'ON_HOLD',
      ];

      if (!validReleaseStatuses.includes(releaseStatus)) {
        throw new Error('Estado de liberacion invalido');
      }

      // Si se va a liberar al cliente, obtener información del pago para generar datos de orden
      let orderReleaseData = null;
      if (releaseStatus === 'RELEASED_TO_CUSTOMER' && options.generateOrderData) {
        const orderWithPayment = await prisma.order.findUnique({
          where: { id: orderId },
          include: { payments: true },
        });

        if (orderWithPayment && orderWithPayment.payments.length > 0) {
          const payment = orderWithPayment.payments[0];
          orderReleaseData = generateOrderRelease(
            payment.paymentMethod,
            payment.referenceNumber,
            orderWithPayment.total
          );
        }
      }

      const data = {
        paymentReleaseStatus: releaseStatus,
        paymentReleaseBy: options.supportUserId || null,
      };

      if (options.notes !== undefined) {
        data.paymentReleaseNotes = options.notes;
      }

      if (releaseStatus === 'RELEASED_TO_CUSTOMER') {
        data.paymentReleaseAt = new Date();
        if (orderReleaseData) {
          data.orderReleaseData = orderReleaseData;
        }
      } else if (releaseStatus === 'WAITING_SUPPORT') {
        data.paymentReleaseAt = null;
        data.orderReleaseData = null;
      } else {
        data.paymentReleaseAt = null;
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data,
        include: {
          payments: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error al actualizar liberacion de pago:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene estadísticas de pagos (para dashboard administrativo)
   * @returns {Promise<Object>} - Estadísticas
   */
  static async getPaymentStats({ startDate, endDate }) {
    try {
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          gte: new Date(startDate),
          lte: new Date(endDate),
        };
      }

      const [
        totalOrders,
        pendingPayments,
        completedPayments,
        totalRevenue,
        cancelledPayments,
      ] = await Promise.all([
        prisma.order.count({ where: dateFilter }),
        prisma.payment.count({ where: { status: 'PENDING', ...dateFilter } }),
        prisma.payment.count({ where: { status: 'COMPLETED' } }), // Cumulative completed payments
        prisma.payment.aggregate({
          where: { status: 'COMPLETED' }, // Only include COMPLETED payments in revenue
          _sum: { amount: true },
        }),
        prisma.payment.count({ where: { status: 'CANCELLED' } }), // Track cancelled payments
      ]);

      return {
        success: true,
        stats: {
          totalOrders,
          pendingPayments,
          completedPayments: completedPayments || 0, // Cumulative completed payments
          totalRevenue: totalRevenue._sum.amount || 0, // Only revenue from completed payments
          cancelledPayments: cancelledPayments || 0, // Track cancelled payments separately
        },
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene todos los pagos pendientes (para administración)
   * @returns {Promise<Object>} - Lista de pagos pendientes
   */
  static async getPendingPayments() {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          status: 'PENDING',
        },
        include: {
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        payments,
      };
    } catch (error) {
      console.error('Error al obtener pagos pendientes:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default PaymentService;
