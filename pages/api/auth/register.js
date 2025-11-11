
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, generateVerificationToken } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  console.log('[REGISTRO] Intento de registro:', { name, email });

  if (!name || !email || !password) {
    console.log('[REGISTRO] Error: Campos faltantes');
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('[REGISTRO] Error: Email ya existe:', email);
    return res.status(409).json({ message: 'El email ya está en uso' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log('[REGISTRO] Usuario creado:', { id: user.id, email: user.email });

    // VERIFICACIÓN DE EMAIL DESACTIVADA
    // Descomentar el código siguiente para ACTIVAR el envío de emails de verificación:

    /*
    // Generar token de verificación
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

    console.log('[REGISTRO] Token de verificación generado y guardado');

    // Enviar email de verificación
    sendVerificationEmail(email, verificationToken)
      .then((result) => {
        if (result.success) {
          console.log('[REGISTRO] ✅ Email de verificación enviado a:', email);
        } else {
          console.error('[REGISTRO] ❌ Error al enviar email:', result.error);
        }
      })
      .catch((error) => {
        console.error('[REGISTRO] ❌ Error crítico enviando email:', error);
      });

    const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email/confirm?token=${verificationToken}`;
    console.log('[REGISTRO] Link de verificación:', verificationLink);
    */

    res.status(201).json({
      message: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.',
      userId: user.id,
      requiresVerification: false
    });
  } catch (error) {
    console.error('[REGISTRO] Error:', error);
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
}
