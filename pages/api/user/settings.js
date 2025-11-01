import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    // GET - Obtener configuraciones
    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          notifyEmail: true,
          notifyPush: true,
          notifySms: true,
          notifyMarketing: true,
          profilePublic: true,
          showPurchases: true,
          allowMessages: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.status(200).json({
        notifications: {
          email: user.notifyEmail,
          push: user.notifyPush,
          sms: user.notifySms,
          marketing: user.notifyMarketing,
        },
        privacy: {
          profilePublic: user.profilePublic,
          showPurchases: user.showPurchases,
          allowMessages: user.allowMessages,
        },
      });
    }

    // PUT - Actualizar configuraciones
    if (req.method === 'PUT') {
      const { notifications, privacy } = req.body;

      const updateData = {};

      // Actualizar notificaciones si se proporcionan
      if (notifications) {
        if (typeof notifications.email === 'boolean') {
          updateData.notifyEmail = notifications.email;
        }
        if (typeof notifications.push === 'boolean') {
          updateData.notifyPush = notifications.push;
        }
        if (typeof notifications.sms === 'boolean') {
          updateData.notifySms = notifications.sms;
        }
        if (typeof notifications.marketing === 'boolean') {
          updateData.notifyMarketing = notifications.marketing;
        }
      }

      // Actualizar privacidad si se proporciona
      if (privacy) {
        if (typeof privacy.profilePublic === 'boolean') {
          updateData.profilePublic = privacy.profilePublic;
        }
        if (typeof privacy.showPurchases === 'boolean') {
          updateData.showPurchases = privacy.showPurchases;
        }
        if (typeof privacy.allowMessages === 'boolean') {
          updateData.allowMessages = privacy.allowMessages;
        }
      }

      updateData.updatedAt = new Date();

      // Actualizar usuario
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: updateData,
        select: {
          notifyEmail: true,
          notifyPush: true,
          notifySms: true,
          notifyMarketing: true,
          profilePublic: true,
          showPurchases: true,
          allowMessages: true,
        },
      });

      return res.status(200).json({
        message: 'Configuraciones actualizadas exitosamente',
        settings: {
          notifications: {
            email: updatedUser.notifyEmail,
            push: updatedUser.notifyPush,
            sms: updatedUser.notifySms,
            marketing: updatedUser.notifyMarketing,
          },
          privacy: {
            profilePublic: updatedUser.profilePublic,
            showPurchases: updatedUser.showPurchases,
            allowMessages: updatedUser.allowMessages,
          },
        },
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en configuraciones:', error);
    return res.status(500).json({
      error: 'Error al procesar configuraciones'
    });
  }
}
