import prisma from '../../../lib/prisma';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Por seguridad, siempre devolvemos el mismo mensaje
    // incluso si el usuario no existe
    if (!user) {
      return res.status(200).json({
        message: 'Si existe una cuenta con ese email, recibirás instrucciones para recuperar tu contraseña',
      });
    }

    // Generar token de reseteo
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Expira en 1 hora

    // Guardar token en el usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // En producción, aquí enviarías un email
    // Por ahora, devolvemos el link para testing
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/mi-cuenta/reset-password?token=${resetToken}`;

    console.log('Link de reseteo:', resetLink);

    return res.status(200).json({
      message: 'Si existe una cuenta con ese email, recibirás instrucciones para recuperar tu contraseña',
      // En producción, NO devolver el link
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined,
    });
  } catch (error) {
    console.error('Error al procesar recuperación de contraseña:', error);
    return res.status(500).json({ error: 'Error al procesar solicitud' });
  }
}
