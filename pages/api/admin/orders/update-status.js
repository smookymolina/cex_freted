import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import { apiResponse } from '../../../../lib/utils/apiResponse';

// Estados válidos de orden
const VALID_ORDER_STATUSES = [
  'PENDING',
  'PAYMENT_CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

// Transiciones de estado permitidas (opcional, para validar flujos lógicos)
const VALID_TRANSITIONS = {
  PENDING: ['PAYMENT_CONFIRMED', 'CANCELLED'],
  PAYMENT_CONFIRMED: ['PROCESSING', 'CANCELLED', 'REFUNDED'],
  PROCESSING: ['SHIPPED', 'CANCELLED', 'REFUNDED'],
  SHIPPED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [], // No se puede cambiar desde cancelado
  REFUNDED: [], // No se puede cambiar desde reembolsado
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method Not Allowed'));
  }

  // Verificar autenticación y rol
  const session = await getSession({ req });

  if (!session || session.user.role !== 'SOPORTE') {
    return res.status(403).json(apiResponse(null, 'Forbidden - Acceso denegado'));
  }

  const { orderId, status } = req.body;

  // Validar datos de entrada
  if (!orderId) {
    return res.status(400).json(apiResponse(null, 'ID de orden requerido'));
  }

  if (!status) {
    return res.status(400).json(apiResponse(null, 'Estado requerido'));
  }

  if (!VALID_ORDER_STATUSES.includes(status)) {
    return res.status(400).json(apiResponse(null, `Estado inválido. Estados permitidos: ${VALID_ORDER_STATUSES.join(', ')}`));
  }

  try {
    // Obtener la orden actual
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        payments: true,
      },
    });

    if (!order) {
      return res.status(404).json(apiResponse(null, 'Orden no encontrada'));
    }

    // Validar transición de estado (opcional - puedes descomentar si quieres validación estricta)
    /*
    const allowedTransitions = VALID_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(status) && order.status !== status) {
      return res.status(400).json(
        apiResponse(
          null,
          `No se puede cambiar de ${order.status} a ${status}. Transiciones permitidas: ${allowedTransitions.join(', ')}`
        )
      );
    }
    */

    // Actualizar la orden
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        payments: true,
      },
    });

    // Lógica adicional según el estado
    // Si el estado es PAYMENT_CONFIRMED, actualizar el pago relacionado
    if (status === 'PAYMENT_CONFIRMED' && order.payments.length > 0) {
      const pendingPayment = order.payments.find((p) => p.status === 'PENDING');

      if (pendingPayment) {
        await prisma.payment.update({
          where: {
            id: pendingPayment.id,
          },
          data: {
            status: 'COMPLETED',
            processedAt: new Date(),
            processedBy: session.user.id,
            notes: 'Pago confirmado automáticamente al cambiar estado de orden',
          },
        });
      }
    }

    // Si el estado es CANCELLED, cancelar los pagos pendientes
    if (status === 'CANCELLED' && order.payments.length > 0) {
      const pendingPayments = order.payments.filter((p) => p.status === 'PENDING');

      for (const payment of pendingPayments) {
        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: 'CANCELLED',
            processedAt: new Date(),
            processedBy: session.user.id,
            notes: 'Pago cancelado automáticamente al cancelar orden',
          },
        });
      }
    }

    console.log(`Orden ${order.orderNumber} actualizada a ${status} por ${session.user.email}`);

    return res.status(200).json(
      apiResponse(
        {
          order: updatedOrder,
          previousStatus: order.status,
          newStatus: status,
          updatedBy: session.user.email,
        },
        'Estado de orden actualizado exitosamente'
      )
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json(apiResponse(null, 'Error al actualizar el estado de la orden'));
  }
}
