import { getSession } from 'next-auth/react';
import PaymentService from '../../../../services/paymentService';

/**
 * API endpoint administrativo para cancelar un pago
 * POST /api/admin/payments/cancel
 *
 * NOTA: En producción, debes implementar verificación de roles de admin
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Verificar sesión del usuario
    const session = await getSession({ req });
    if (!session || !session.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // TODO: Verificar que el usuario es administrador
    // if (session.user.role !== 'ADMIN') {
    //   return res.status(403).json({ error: 'Acceso denegado' });
    // }

    const { paymentId, reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        error: 'ID de pago requerido',
      });
    }

    if (!reason) {
      return res.status(400).json({
        error: 'Razón de cancelación requerida',
      });
    }

    // Cancelar el pago
    const result = await PaymentService.cancelPayment(
      paymentId,
      reason,
      session.user.id
    );

    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Error al cancelar el pago',
      });
    }

    return res.status(200).json({
      success: true,
      payment: result.payment,
      message: 'Pago cancelado exitosamente',
    });
  } catch (error) {
    console.error('Error en cancel payment:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
