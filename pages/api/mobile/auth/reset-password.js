import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { hashToken } from '../../../../lib/utils/crypto';
import { validatePassword } from '../../../../lib/utils/validation';
import { successResponse, errorResponse, validationErrorResponse } from '../../../../lib/utils/apiResponse';

/**
 * API de Reset Password para App Móvil
 * POST /api/mobile/auth/reset-password
 *
 * Body:
 * {
 *   "token": "token_recibido_en_email",
 *   "newPassword": "newpassword123"
 * }
 *
 * Respuesta exitosa:
 * {
 *   "success": true,
 *   "message": "Contraseña actualizada exitosamente"
 * }
 */
export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return errorResponse(res, 'Método no permitido', 405);
  }

  try {
    const { token, newPassword } = req.body;

    // Validar campos requeridos
    if (!token || !newPassword) {
      return validationErrorResponse(res, {
        token: !token ? 'El token es requerido' : undefined,
        newPassword: !newPassword ? 'La nueva contraseña es requerida' : undefined,
      });
    }

    // Validar nueva contraseña
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return validationErrorResponse(res, {
        newPassword: passwordValidation.message,
      });
    }

    // Hashear el token recibido para compararlo con el de la BD
    const hashedToken = hashToken(token);

    // Buscar usuario con el token y que no haya expirado
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          gt: new Date(), // Mayor que la fecha actual (no expirado)
        },
      },
    });

    if (!user) {
      return errorResponse(res, 'Token inválido o expirado', 400);
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar tokens de reset
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        // También invalidar refresh token por seguridad
        refreshToken: null,
      },
    });

    return successResponse(
      res,
      null,
      'Contraseña actualizada exitosamente. Por favor, inicia sesión con tu nueva contraseña',
      200
    );

  } catch (error) {
    console.error('Error en reset password:', error);
    return errorResponse(res, 'Error al restablecer la contraseña', 500);
  }
}
