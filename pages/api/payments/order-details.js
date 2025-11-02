import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import PaymentService from '../../../services/paymentService';

/**
 * API endpoint para obtener detalles de una orden específica
 * GET /api/payments/order-details?orderNumber=XXX
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

    const { orderNumber } = req.query;

    if (!orderNumber) {
      return res.status(400).json({
        error: 'Número de orden requerido',
      });
    }

    // Obtener la orden
    const result = await PaymentService.getOrderByNumber(orderNumber);

    if (!result.success) {
      return res.status(404).json({
        error: result.error || 'Orden no encontrada',
      });
    }

    // Verificar que la orden pertenece al usuario
    if (result.order.userId !== session.user.id) {
      return res.status(403).json({
        error: 'No tienes permiso para ver esta orden',
      });
    }

    return res.status(200).json({
      success: true,
      order: result.order,
    });
  } catch (error) {
    console.error('Error en order-details:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
