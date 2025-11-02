import { getSession } from 'next-auth/react';
import PaymentService from '../../../../services/paymentService';

/**
 * API endpoint administrativo para obtener estadísticas de pagos
 * GET /api/admin/payments/stats
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

    // TODO: Verificar que el usuario es administrador
    // if (session.user.role !== 'ADMIN') {
    //   return res.status(403).json({ error: 'Acceso denegado' });
    // }

    // Obtener estadísticas
    const result = await PaymentService.getPaymentStats();

    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Error al obtener estadísticas',
      });
    }

    return res.status(200).json({
      success: true,
      stats: result.stats,
    });
  } catch (error) {
    console.error('Error en payment stats:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
