import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import { sendVerificationEmail, generateVerificationToken } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session || !session.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, emailVerified: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ error: 'Email ya verificado' });
      }

      // Generar token de verificación
      const verificationToken = generateVerificationToken();
      const expires = new Date();
      expires.setHours(expires.getHours() + 24); // Expira en 24 horas

      // Guardar token en la base de datos
      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: verificationToken,
          expires,
        },
      });

      // Enviar email de verificación
      const emailResult = await sendVerificationEmail(user.email, verificationToken);

      if (!emailResult.success) {
        return res.status(500).json({
          error: 'Error al enviar el email de verificación',
          details: emailResult.error
        });
      }

      // Solo mostrar el link en desarrollo
      const verificationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify-email/confirm?token=${verificationToken}`;

      if (process.env.NODE_ENV === 'development') {
        console.log('Link de verificación:', verificationLink);
      }

      return res.status(200).json({
        message: 'Email de verificación enviado correctamente',
        verificationLink: process.env.NODE_ENV === 'development' ? verificationLink : undefined,
      });
    } catch (error) {
      console.error('Error al enviar verificación:', error);
      return res.status(500).json({ error: 'Error al enviar email de verificación' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
