import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import { apiResponse } from '../../../../lib/utils/apiResponse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method Not Allowed'));
  }

  const session = await getSession({ req });

  if (!session || session.user.role !== 'SOPORTE') {
    return res.status(403).json(apiResponse(null, 'Forbidden'));
  }

  const { orderId, notes } = req.body;

  if (!orderId) {
    return res.status(400).json(apiResponse(null, 'Order ID is required'));
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        supportNotes: notes,
      },
    });

    return res.status(200).json(apiResponse(updatedOrder, 'Notes updated successfully'));
  } catch (error) {
    console.error('Error updating order notes:', error);
    // Check for specific Prisma error for record not found
    if (error.code === 'P2025') {
      return res.status(404).json(apiResponse(null, 'Order not found'));
    }
    return res.status(500).json(apiResponse(null, 'Internal Server Error'));
  }
}
