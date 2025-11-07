import { getServerSession } from 'next-auth/next';
import PaymentService from '../../../../services/paymentService';
import { authOptions } from '../../auth/[...nextauth]';

/**
 * API endpoint administrativo para confirmar un pago
 * POST /api/admin/payments/confirm
 *
 * NOTA: En producción, debes implementar verificación de roles de admin
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Verificar sesión del usuario
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Verificar que el usuario tiene rol de soporte
    if (session.user.role !== 'SOPORTE') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { paymentId, transactionId, metadata, notes } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        error: 'ID de pago requerido',
      });
    }

    // Confirmar el pago
    const result = await PaymentService.confirmPayment(paymentId, {
      transactionId,
      processedBy: session.user.id,
      metadata,
      notes,
    });

    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Error al confirmar el pago',
      });
    }

    return res.status(200).json({
      success: true,
      payment: result.payment,
      message: 'Pago confirmado exitosamente',
    });
  } catch (error) {
    console.error('Error en confirm payment:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
