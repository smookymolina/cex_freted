import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

const sanitizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && typeof item === 'object' && item.id)
    .map((item) => ({
      id: item.id,
      name: item.name ?? item.title ?? '',
      slug: item.slug ?? '',
      price: Number.isFinite(item.price) ? item.price : Number(item.price ?? 0),
      originalPrice: Number.isFinite(item.originalPrice)
        ? item.originalPrice
        : item.originalPrice != null
        ? Number(item.originalPrice)
        : null,
      image: item.image ?? null,
      grade: item.grade ?? null,
      category: item.category ?? null,
      stock: Number.isFinite(item.stock) ? item.stock : null,
      quantity: Math.max(1, Number.isFinite(item.quantity) ? item.quantity : Number(item.quantity ?? 1) || 1),
    }));
};

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { cart: true },
      });

      const cartItems = Array.isArray(user?.cart) ? user.cart : [];
      return res.status(200).json({ items: cartItems });
    }

    if (req.method === 'PUT') {
      const { items } = req.body ?? {};
      const sanitizedItems = sanitizeCartItems(items);

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          cart: sanitizedItems,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({ items: sanitizedItems });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en API de carrito', error);
    return res.status(500).json({ error: 'No fue posible procesar la solicitud del carrito' });
  }
}
