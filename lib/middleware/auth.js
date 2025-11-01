import { verifyAccessToken } from '../utils/jwt';
import prisma from '../prisma';

/**
 * Middleware para verificar autenticación JWT
 * Extrae el token del header Authorization y lo verifica
 * Agrega el usuario a req.user si es válido
 */
export const authenticate = async (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó un token de autenticación',
      });
    }

    // Extraer el token (remover "Bearer ")
    const token = authHeader.substring(7);

    // Verificar el token
    const decoded = verifyAccessToken(token);

    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Agregar el usuario al request
    req.user = user;

    // Continuar con la siguiente función
    next();
  } catch (error) {
    console.error('Error en autenticación:', error.message);

    return res.status(401).json({
      success: false,
      message: error.message || 'Token inválido o expirado',
    });
  }
};

/**
 * Middleware opcional - no falla si no hay token
 * Útil para rutas que funcionan con o sin autenticación
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
