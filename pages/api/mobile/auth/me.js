import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { authenticate } from '../../../../lib/middleware/auth';
import { isValidName, isValidPhone, validatePassword, sanitizeInput } from '../../../../lib/utils/validation';
import { successResponse, errorResponse, validationErrorResponse } from '../../../../lib/utils/apiResponse';

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
 * API de Perfil de Usuario para App Móvil
 *
 * GET /api/mobile/auth/me
 * Obtener información del usuario autenticado
 *
 * PUT /api/mobile/auth/me
 * Actualizar información del usuario autenticado
 *
 * Body (PUT):
 * {
 *   "name": "Nuevo Nombre",
 *   "phone": "+52 1234567890",
 *   "currentPassword": "password123" (requerido si se cambia password),
 *   "newPassword": "newpassword123" (opcional)
 * }
 *
 * Headers requeridos:
 * Authorization: Bearer <accessToken>
 */
export default async function handler(req, res) {
  // Ejecutar middleware de autenticación
  try {
    await runMiddleware(req, res, authenticate);
  } catch (error) {
    return; // El middleware ya envió la respuesta
  }

  // GET - Obtener perfil
  if (req.method === 'GET') {
    try {
      // El usuario ya está en req.user gracias al middleware
      return successResponse(res, {
        user: req.user,
      }, 'Perfil obtenido exitosamente', 200);

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return errorResponse(res, 'Error al obtener el perfil', 500);
    }
  }

  // PUT - Actualizar perfil
  else if (req.method === 'PUT') {
    try {
      const { name, phone, currentPassword, newPassword } = req.body;

      const validationErrors = {};
      const updateData = {};

      // Validar y preparar actualización de nombre
      if (name !== undefined) {
        const sanitizedName = sanitizeInput(name);
        if (!isValidName(sanitizedName)) {
          validationErrors.name = 'El nombre debe tener al menos 2 caracteres';
        } else {
          updateData.name = sanitizedName;
        }
      }

      // Validar y preparar actualización de teléfono
      if (phone !== undefined) {
        const sanitizedPhone = sanitizeInput(phone);
        if (sanitizedPhone && !isValidPhone(sanitizedPhone)) {
          validationErrors.phone = 'Formato de teléfono inválido';
        } else {
          updateData.phone = sanitizedPhone || null;
        }
      }

      // Validar cambio de contraseña
      if (newPassword) {
        if (!currentPassword) {
          validationErrors.currentPassword = 'Debes proporcionar tu contraseña actual';
        } else {
          // Obtener usuario con password
          const userWithPassword = await prisma.user.findUnique({
            where: { id: req.user.id },
          });

          // Verificar contraseña actual
          const isPasswordValid = await bcrypt.compare(
            currentPassword,
            userWithPassword.password
          );

          if (!isPasswordValid) {
            validationErrors.currentPassword = 'Contraseña actual incorrecta';
          } else {
            // Validar nueva contraseña
            const passwordValidation = validatePassword(newPassword);
            if (!passwordValidation.valid) {
              validationErrors.newPassword = passwordValidation.message;
            } else {
              // Hashear nueva contraseña
              updateData.password = await bcrypt.hash(newPassword, 10);
            }
          }
        }
      }

      // Si hay errores de validación, retornar
      if (Object.keys(validationErrors).length > 0) {
        return validationErrorResponse(res, validationErrors);
      }

      // Si no hay nada que actualizar
      if (Object.keys(updateData).length === 0) {
        return errorResponse(res, 'No se proporcionaron datos para actualizar', 400);
      }

      // Actualizar usuario
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return successResponse(res, {
        user: updatedUser,
      }, 'Perfil actualizado exitosamente', 200);

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return errorResponse(res, 'Error al actualizar el perfil', 500);
    }
  }

  // Método no permitido
  else {
    return errorResponse(res, 'Método no permitido', 405);
  }
}
