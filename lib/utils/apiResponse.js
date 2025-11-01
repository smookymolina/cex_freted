/**
 * Respuesta de éxito estándar
 * @param {Object} res - Response object de Express
 * @param {Object} data - Datos a enviar
 * @param {string} message - Mensaje de éxito
 * @param {number} statusCode - Código HTTP (default: 200)
 */
export const successResponse = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Respuesta de error estándar
 * @param {Object} res - Response object de Express
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código HTTP (default: 400)
 * @param {Object} errors - Errores detallados (opcional)
 */
export const errorResponse = (res, message = 'Error en la operación', statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

/**
 * Respuesta de validación fallida
 * @param {Object} res - Response object de Express
 * @param {Object} errors - Errores de validación
 */
export const validationErrorResponse = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Error de validación',
    errors,
  });
};

/**
 * Respuesta de no autorizado
 * @param {Object} res - Response object de Express
 * @param {string} message - Mensaje personalizado
 */
export const unauthorizedResponse = (res, message = 'No autorizado') => {
  return res.status(401).json({
    success: false,
    message,
  });
};

/**
 * Respuesta de no encontrado
 * @param {Object} res - Response object de Express
 * @param {string} message - Mensaje personalizado
 */
export const notFoundResponse = (res, message = 'Recurso no encontrado') => {
  return res.status(404).json({
    success: false,
    message,
  });
};
