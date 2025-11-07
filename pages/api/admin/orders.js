import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import { apiResponse } from '../../../lib/utils/apiResponse';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json(apiResponse(null, 'Method Not Allowed'));
  }

  const session = await getSession({ req });

  if (!session || session.user.role !== 'SOPORTE') {
    return res.status(403).json(apiResponse(null, 'Forbidden'));
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(apiResponse(orders, 'Orders fetched successfully'));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json(apiResponse(null, 'Internal Server Error'));
  }
}
