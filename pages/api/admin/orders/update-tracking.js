import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { apiResponse } from '../../../../lib/utils/apiResponse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_TRACKING_STATUSES = [
  'ORDER_RECEIVED',
  'PAYMENT_VERIFICATION',
  'PREPARING_ORDER',
  'IN_TRANSIT',
  'DELIVERED',
];

/**
 * Endpoint para actualizar el estado de tracking del pedido
 * POST /api/admin/orders/update-tracking
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method Not Allowed'));
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'SOPORTE') {
    return res.status(403).json(apiResponse(null, 'Acceso denegado'));
  }

  const { orderId, trackingStatus, note } = req.body || {};

  if (!orderId || !trackingStatus) {
    return res.status(400).json(apiResponse(null, 'Datos incompletos'));
  }

  if (!VALID_TRACKING_STATUSES.includes(trackingStatus)) {
    return res.status(400).json(
      apiResponse(
        null,
        `Estado inválido. Valores permitidos: ${VALID_TRACKING_STATUSES.join(', ')}`
      )
    );
  }

  try {
    // Obtener la orden actual
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json(apiResponse(null, 'Orden no encontrada'));
    }

    // Obtener historial actual
    const trackingHistory = order.trackingHistory ? JSON.parse(JSON.stringify(order.trackingHistory)) : [];

    // Agregar nuevo registro al historial
    trackingHistory.push({
      status: trackingStatus,
      timestamp: new Date().toISOString(),
      note: note || null,
      updatedBy: session.user.email || session.user.id,
    });

    // Actualizar el tracking status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingStatus,
        trackingHistory,
      },
      include: {
        payments: true,
      },
    });

    // Si el estado es DELIVERED, también actualizar el estado de la orden
    if (trackingStatus === 'DELIVERED') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'DELIVERED',
        },
      });
    }

    // Si el estado es IN_TRANSIT, actualizar a SHIPPED
    if (trackingStatus === 'IN_TRANSIT') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'SHIPPED',
        },
      });
    }

    return res.status(200).json(
      apiResponse(
        {
          order: updatedOrder,
          trackingStatus: updatedOrder.trackingStatus,
        },
        'Estado de seguimiento actualizado'
      )
    );
  } catch (error) {
    console.error('Error al actualizar tracking:', error);
    return res.status(500).json(apiResponse(null, 'Error al actualizar estado de seguimiento'));
  }
}
