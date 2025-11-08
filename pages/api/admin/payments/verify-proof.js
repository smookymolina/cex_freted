import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { apiResponse } from '../../../../lib/utils/apiResponse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Endpoint para que soporte verifique comprobantes de pago
 * POST /api/admin/payments/verify-proof
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method Not Allowed'));
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'SOPORTE') {
    return res.status(403).json(apiResponse(null, 'Acceso denegado'));
  }

  const { paymentId, approved, notes } = req.body || {};

  if (!paymentId || approved === undefined) {
    return res.status(400).json(apiResponse(null, 'Datos incompletos'));
  }

  try {
    // Obtener el pago con la orden
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return res.status(404).json(apiResponse(null, 'Pago no encontrado'));
    }

    if (!payment.paymentProof) {
      return res.status(400).json(apiResponse(null, 'Este pago no tiene comprobante subido'));
    }

    // Actualizar en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar el pago
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          paymentProofVerified: approved,
          paymentProofVerifiedAt: new Date(),
          paymentProofVerifiedBy: session.user.email || session.user.id,
          status: approved ? 'COMPLETED' : 'FAILED',
          notes: notes || null,
          processedAt: approved ? new Date() : payment.processedAt,
          processedBy: approved ? (session.user.email || session.user.id) : payment.processedBy,
        },
      });

      // Si fue aprobado, actualizar la orden
      if (approved) {
        // Actualizar historial de tracking
        const order = payment.order;
        const trackingHistory = order.trackingHistory ? JSON.parse(JSON.stringify(order.trackingHistory)) : [];

        trackingHistory.push({
          status: 'PREPARING_ORDER',
          timestamp: new Date().toISOString(),
          note: 'Pago verificado y confirmado',
        });

        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'PAYMENT_CONFIRMED',
            trackingStatus: 'PREPARING_ORDER',
            trackingHistory,
          },
        });
      } else {
        // Si fue rechazado, agregar nota al historial
        const order = payment.order;
        const trackingHistory = order.trackingHistory ? JSON.parse(JSON.stringify(order.trackingHistory)) : [];

        trackingHistory.push({
          status: 'PAYMENT_VERIFICATION',
          timestamp: new Date().toISOString(),
          note: `Comprobante rechazado: ${notes || 'No especificado'}`,
        });

        await tx.order.update({
          where: { id: order.id },
          data: {
            trackingHistory,
            supportNotes: notes,
          },
        });
      }

      return updatedPayment;
    });

    return res.status(200).json(
      apiResponse(
        { payment: result },
        approved ? 'Comprobante verificado y pago confirmado' : 'Comprobante rechazado'
      )
    );
  } catch (error) {
    console.error('Error al verificar comprobante:', error);
    return res.status(500).json(apiResponse(null, 'Error al verificar comprobante'));
  }
}
