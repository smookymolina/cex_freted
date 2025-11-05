
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '../../../lib/email/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
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

    // Enviar email de bienvenida (no bloquear la respuesta)
    sendWelcomeEmail(email, name).catch((error) => {
      console.error('Error enviando email de bienvenida:', error);
    });

    res.status(201).json({ message: 'Usuario creado con éxito', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
}
