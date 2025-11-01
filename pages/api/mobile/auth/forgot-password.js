import prisma from '../../../../lib/prisma';
import { generateResetToken, hashToken } from '../../../../lib/utils/crypto';
import { isValidEmail, sanitizeInput } from '../../../../lib/utils/validation';
import { successResponse, errorResponse, validationErrorResponse } from '../../../../lib/utils/apiResponse';

/**
 * API de Forgot Password para App Móvil
 * POST /api/mobile/auth/forgot-password
 *
 * Body:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Respuesta exitosa:
 * {
 *   "success": true,
 *   "message": "Se ha enviado un código de recuperación a tu email",
 *   "data": {
 *     "resetToken": "..." (SOLO EN DESARROLLO - en producción se envía por email)
 *   }
 * }
 */
export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return errorResponse(res, 'Método no permitido', 405);
  }

  try {
    const { email } = req.body;

    // Validar email
    if (!email) {
      return validationErrorResponse(res, {
        email: 'El email es requerido',
      });
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    if (!isValidEmail(sanitizedEmail)) {
      return validationErrorResponse(res, {
        email: 'Formato de email inválido',
      });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    // Por seguridad, siempre respondemos lo mismo aunque el usuario no exista
    // Esto previene que se pueda enumerar usuarios válidos
    if (!user) {
      return successResponse(
        res,
        null,
        'Si el email existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña',
        200
      );
    }

    // Generar token de reset
    const resetToken = generateResetToken();
    const hashedToken = hashToken(resetToken);

    // Establecer expiración del token (1 hora)
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token hasheado en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: resetTokenExpires,
      },
    });

    // TODO: Aquí deberías enviar el email con el token
    // Por ahora, en desarrollo, lo retornamos en la respuesta
    // En producción, NUNCA retornar el token en la respuesta

    const isDevelopment = process.env.NODE_ENV === 'development';

    // IMPORTANTE: En producción, aquí enviarías un email con el token
    // Ejemplo:
    // await sendPasswordResetEmail(user.email, resetToken);

    return successResponse(
      res,
      isDevelopment ? { resetToken } : null,
      'Si el email existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña',
      200
    );

  } catch (error) {
    console.error('Error en forgot password:', error);
    return errorResponse(res, 'Error al procesar la solicitud', 500);
  }
}
