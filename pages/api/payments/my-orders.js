import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import PaymentService from '../../../services/paymentService';

/**
 * API endpoint para obtener las órdenes del usuario actual
 * GET /api/payments/my-orders
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

    // Obtener las órdenes del usuario
    const result = await PaymentService.getUserOrders(session.user.id);

    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Error al obtener las órdenes',
      });
    }

    return res.status(200).json({
      success: true,
      orders: result.orders,
    });
  } catch (error) {
    console.error('Error en my-orders:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
