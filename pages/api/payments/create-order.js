import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import PaymentService from '../../../services/paymentService';
import { sendOrderConfirmationEmail } from '../../../lib/email/mailer';

/**
 * API endpoint para crear una orden con pago pendiente
 * POST /api/payments/create-order
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

    const {
      customer,
      shipping,
      items,
      totals,
      paymentMethod = 'PHONE_PAYMENT',
    } = req.body;

    // Validaciones básicas
    if (!customer || !shipping || !items || !totals) {
      return res.status(400).json({
        error: 'Faltan datos requeridos',
        required: ['customer', 'shipping', 'items', 'totals'],
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Validar datos del cliente
    if (!customer.fullName || !customer.email || !customer.phone) {
      return res.status(400).json({
        error: 'Datos del cliente incompletos',
      });
    }

    // Validar datos de envío
    if (
      !shipping.address ||
      !shipping.city ||
      !shipping.state ||
      !shipping.postalCode
    ) {
      return res.status(400).json({
        error: 'Datos de envío incompletos',
      });
    }

    // Validar totales
    if (
      typeof totals.subtotal !== 'number' ||
      typeof totals.shippingCost !== 'number' ||
      typeof totals.total !== 'number'
    ) {
      return res.status(400).json({
        error: 'Totales inválidos',
      });
    }

    // Crear la orden usando el servicio de pagos
    const result = await PaymentService.createOrder({
      userId: session.user.id,
      customer,
      shipping,
      items,
      totals,
      paymentMethod,
    });

    if (!result.success) {
      return res.status(500).json({
        error: result.error || 'Error al crear la orden',
      });
    }

    // Enviar email de confirmación (no bloquear la respuesta)
    sendOrderConfirmationEmail(customer.email, {
      orderId: result.orderNumber,
      total: result.order.total,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price * item.quantity
      })),
      deliveryMethod: shipping.deliveryMethod
    }).catch((error) => {
      console.error('Error enviando email de confirmación:', error);
    });

    // Retornar la información de la orden creada
    return res.status(201).json({
      success: true,
      order: {
        id: result.order.id,
        orderNumber: result.orderNumber,
        total: result.order.total,
        status: result.order.status,
        createdAt: result.order.createdAt,
      },
      payment: {
        referenceNumber: result.paymentReference,
        amount: result.order.payment?.amount || result.order.total,
        method: result.order.payment?.paymentMethod || paymentMethod,
        status: result.order.payment?.status || 'PENDING',
      },
    });
  } catch (error) {
    console.error('Error en create-order:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
