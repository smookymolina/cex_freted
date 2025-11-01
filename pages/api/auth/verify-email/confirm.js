import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Token no proporcionado' });
      }

      // Buscar el token en la base de datos
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken) {
        return res.status(404).json({ error: 'Token inválido o expirado' });
      }

      // Verificar si el token ha expirado
      if (verificationToken.expires < new Date()) {
        await prisma.verificationToken.delete({
          where: { token },
        });
        return res.status(400).json({ error: 'Token expirado' });
      }

      // Buscar el usuario y verificar su email
      const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Marcar el email como verificado
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });

      // Eliminar el token usado
      await prisma.verificationToken.delete({
        where: { token },
      });

      // Redirigir a una página de éxito
      return res.redirect('/mi-cuenta/perfil?verified=true');
    } catch (error) {
      console.error('Error al verificar email:', error);
      return res.status(500).json({ error: 'Error al verificar email' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
