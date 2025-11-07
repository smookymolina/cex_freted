import { getSession } from 'next-auth/react';
import PaymentService from '../../../../services/paymentService';

/**
 * API endpoint administrativo para obtener pagos pendientes
 * GET /api/admin/payments/pending
 *
 * NOTA: En producción, debes implementar verificación de roles de admin
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Verificar sesión del usuario
    const session = await getSession({ req });
    if (!session || !session.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Verificar que el usuario tiene rol de soporte
    if (session.user.role !== 'SOPORTE') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // Obtener pagos pendientes
    const result = await PaymentService.getPendingPayments();

    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Error al obtener pagos pendientes',
      });
    }

    return res.status(200).json({
      success: true,
      payments: result.payments,
    });
  } catch (error) {
    console.error('Error en pending payments:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
