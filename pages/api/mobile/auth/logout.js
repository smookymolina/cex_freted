import prisma from '../../../../lib/prisma';
import { authenticate } from '../../../../lib/middleware/auth';
import { successResponse, errorResponse } from '../../../../lib/utils/apiResponse';

/**
 * Wrapper para ejecutar middleware en Next.js API routes
 */
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

/**
 * API de Logout para App Móvil
 * POST /api/mobile/auth/logout
 *
 * Headers requeridos:
 * Authorization: Bearer <accessToken>
 *
 * Respuesta exitosa:
 * {
 *   "success": true,
 *   "message": "Sesión cerrada exitosamente"
 * }
 */
export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return errorResponse(res, 'Método no permitido', 405);
  }

  // Ejecutar middleware de autenticación
  try {
    await runMiddleware(req, res, authenticate);
  } catch (error) {
    return; // El middleware ya envió la respuesta
  }

  try {
    // Invalidar el refresh token en la base de datos
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });

    return successResponse(res, null, 'Sesión cerrada exitosamente', 200);

  } catch (error) {
    console.error('Error en logout:', error);
    return errorResponse(res, 'Error al cerrar sesión', 500);
  }
}
