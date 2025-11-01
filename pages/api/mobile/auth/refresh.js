import prisma from '../../../../lib/prisma';
import { verifyRefreshToken, generateAccessToken } from '../../../../lib/utils/jwt';
import { successResponse, errorResponse } from '../../../../lib/utils/apiResponse';

/**
 * API de Refresh Token para App Móvil
 * POST /api/mobile/auth/refresh
 *
 * Body:
 * {
 *   "refreshToken": "..."
 * }
 *
 * Respuesta exitosa:
 * {
 *   "success": true,
 *   "message": "Token actualizado exitosamente",
 *   "data": {
 *     "accessToken": "..."
 *   }
 * }
 */
export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return errorResponse(res, 'Método no permitido', 405);
  }

  try {
    const { refreshToken } = req.body;

    // Validar que se proporcionó el refresh token
    if (!refreshToken) {
      return errorResponse(res, 'Refresh token es requerido', 400);
    }

    // Verificar el refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return errorResponse(res, error.message || 'Refresh token inválido', 401);
    }

    // Buscar el usuario y verificar que el refresh token coincida
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Verificar que el refresh token en BD coincida con el enviado
    if (user.refreshToken !== refreshToken) {
      return errorResponse(res, 'Refresh token inválido o revocado', 401);
    }

    // Generar nuevo access token
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const newAccessToken = generateAccessToken(payload);

    // Responder con el nuevo access token
    return successResponse(res, {
      accessToken: newAccessToken,
    }, 'Token actualizado exitosamente', 200);

  } catch (error) {
    console.error('Error en refresh token:', error);
    return errorResponse(res, 'Error al actualizar el token', 500);
  }
}
