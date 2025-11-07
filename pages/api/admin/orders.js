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
    const { 
      page = 1, 
      limit = 10, 
      searchTerm, 
      status, 
      paymentMethod,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount 
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let where = {};

    if (searchTerm) {
      where.OR = [
        { orderNumber: { contains: searchTerm, mode: 'insensitive' } },
        { customerName: { contains: searchTerm, mode: 'insensitive' } },
        { customerEmail: { contains: searchTerm, mode: 'insensitive' } },
        { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }
    
    if (paymentMethod && paymentMethod !== 'ALL') {
      where.payments = {
        some: {
          paymentMethod: paymentMethod,
        },
      };
    }

    if (dateFrom) {
      where.createdAt = { ...where.createdAt, gte: new Date(dateFrom) };
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt = { ...where.createdAt, lte: toDate };
    }

    if (minAmount) {
      where.total = { ...where.total, gte: parseFloat(minAmount) };
    }

    if (maxAmount) {
      where.total = { ...where.total, lte: parseFloat(maxAmount) };
    }

    const [orders, totalOrders] = await prisma.$transaction([
      prisma.order.findMany({
        where,
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
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalOrders / limitNum);

    const response = {
      data: orders,
      pagination: {
        total: totalOrders,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    };

    return res.status(200).json(apiResponse(response, 'Orders fetched successfully'));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json(apiResponse(null, 'Internal Server Error'));
  }
}
