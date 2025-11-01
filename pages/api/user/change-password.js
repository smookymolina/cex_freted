import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validaciones básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: 'Todos los campos son requeridos'
      });
    }

    // Validar que las contraseñas nuevas coincidan
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: 'Las contraseñas no coinciden'
      });
    }

    // Validar longitud mínima de contraseña (mínimo 8 caracteres)
    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Validar complejidad de contraseña (al menos una letra y un número)
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    if (!hasLetter || !hasNumber) {
      return res.status(400).json({
        error: 'La contraseña debe contener al menos una letra y un número'
      });
    }

    // Obtener el usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return res.status(404).json({
        error: 'Usuario no encontrado o sin contraseña establecida'
      });
    }

    // Verificar la contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Contraseña actual incorrecta'
      });
    }

    // Verificar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        error: 'La nueva contraseña debe ser diferente a la actual'
      });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return res.status(500).json({
      error: 'Error al cambiar la contraseña'
    });
  }
}
