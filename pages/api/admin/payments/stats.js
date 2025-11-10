import { getServerSession } from 'next-auth/next';
import PaymentService from '../../../../services/paymentService';
import { authOptions } from '../../auth/[...nextauth]';

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
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Verificar que el usuario tiene rol de soporte
    if (session.user.role !== 'SOPORTE') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { startDate, endDate } = req.query;

    // Obtener estadísticas
    const result = await PaymentService.getPaymentStats({ startDate, endDate });

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
