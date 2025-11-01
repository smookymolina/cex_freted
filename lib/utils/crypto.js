import crypto from 'crypto';

/**
 * Genera un token aleatorio seguro para reset de contraseña
 * @returns {string} Token hexadecimal de 32 bytes
 */
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hashea un token para almacenarlo en la base de datos
 * @param {string} token - Token a hashear
 * @returns {string} Token hasheado
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
