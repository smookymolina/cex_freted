import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../../../../lib/utils/jwt';
import { isValidEmail, validatePassword, isValidName, isValidPhone, sanitizeInput } from '../../../../lib/utils/validation';
import { successResponse, errorResponse, validationErrorResponse } from '../../../../lib/utils/apiResponse';

/**
 * API de Registro para App Móvil
 * POST /api/mobile/auth/register
 *
 * Body:
 * {
 *   "name": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "password": "password123",
 *   "phone": "+52 1234567890" (opcional)
 * }
 *
 * Respuesta exitosa:
 * {
 *   "success": true,
 *   "message": "Registro exitoso",
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
    const { name, email, password, phone } = req.body;

    // Objeto para acumular errores de validación
    const validationErrors = {};

    // Validar nombre
    if (!name) {
      validationErrors.name = 'El nombre es requerido';
    } else {
      const sanitizedName = sanitizeInput(name);
      if (!isValidName(sanitizedName)) {
        validationErrors.name = 'El nombre debe tener al menos 2 caracteres';
      }
    }

    // Validar email
    if (!email) {
      validationErrors.email = 'El email es requerido';
    } else {
      const sanitizedEmail = sanitizeInput(email);
      if (!isValidEmail(sanitizedEmail)) {
        validationErrors.email = 'Formato de email inválido';
      }
    }

    // Validar contraseña
    if (!password) {
      validationErrors.password = 'La contraseña es requerida';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        validationErrors.password = passwordValidation.message;
      }
    }

    // Validar teléfono (opcional)
    if (phone && !isValidPhone(phone)) {
      validationErrors.phone = 'Formato de teléfono inválido';
    }

    // Si hay errores de validación, retornar
    if (Object.keys(validationErrors).length > 0) {
      return validationErrorResponse(res, validationErrors);
    }

    // Sanitizar inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedName = sanitizeInput(name);
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return errorResponse(res, 'El email ya está registrado', 409);
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        phone: sanitizedPhone,
      },
    });

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
    }, 'Registro exitoso', 201);

  } catch (error) {
    console.error('Error en registro:', error);
    return errorResponse(res, 'Error al crear la cuenta. Intenta nuevamente', 500);
  }
}
