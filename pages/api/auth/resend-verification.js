import prisma from '../../../lib/prisma';
import { sendVerificationEmail, generateVerificationToken } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' });
  }

  try {
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      // Por seguridad, no revelar que el usuario no existe
      return res.status(200).json({
        message: 'Si existe una cuenta con ese email, recibirás un correo de verificación.',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: 'Este email ya está verificado. Puedes iniciar sesión.',
      });
    }

    // Eliminar tokens anteriores para este email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Generar nuevo token
    const verificationToken = generateVerificationToken();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Expira en 24 horas

    // Guardar token en la base de datos
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires,
      },
    });

    // Enviar email de verificación
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (!emailResult.success) {
      return res.status(500).json({
        error: 'Error al enviar el email. Por favor intenta más tarde.',
      });
    }

    return res.status(200).json({
      message: 'Email de verificación enviado. Revisa tu bandeja de entrada y carpeta de spam.',
    });
  } catch (error) {
    console.error('Error al reenviar verificación:', error);
    return res.status(500).json({
      error: 'Error al procesar la solicitud',
    });
  }
}
