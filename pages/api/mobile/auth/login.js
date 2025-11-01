import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../../../../lib/utils/jwt';
import { isValidEmail, sanitizeInput } from '../../../../lib/utils/validation';
import { successResponse, errorResponse, validationErrorResponse } from '../../../../lib/utils/apiResponse';

/**
 * API de Login para App Móvil
 * POST /api/mobile/auth/login
 *
 * Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 *
 * Respuesta exitosa:
 * {
 *   "success": true,
 *   "message": "Inicio de sesión exitoso",
 *   "data": {
 *     "user": { ... },
 *     "accessToken": "...",
 *     "refreshToken": "..."
 *   }
 * }
 */
export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return errorResponse(res, 'Método no permitido', 405);
  }

  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return validationErrorResponse(res, {
        email: !email ? 'El email es requerido' : undefined,
        password: !password ? 'La contraseña es requerida' : undefined,
      });
    }

    // Sanitizar y validar email
    const sanitizedEmail = sanitizeInput(email);
    if (!isValidEmail(sanitizedEmail)) {
      return validationErrorResponse(res, {
        email: 'Formato de email inválido',
      });
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user || !user.password) {
      return errorResponse(res, 'Credenciales incorrectas', 401);
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Credenciales incorrectas', 401);
    }

    // Generar tokens JWT
    const tokens = generateTokens(user);

    // Guardar refresh token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    // Preparar datos del usuario (sin password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Responder con tokens y datos del usuario
    return successResponse(res, {
      user: userData,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    }, 'Inicio de sesión exitoso', 200);

  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse(res, 'Error al iniciar sesión. Intenta nuevamente', 500);
  }
}
