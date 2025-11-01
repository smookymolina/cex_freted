/**
 * Valida que el email tenga formato correcto
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que la contraseña cumpla con requisitos mínimos
 * @param {string} password
 * @returns {Object} { valid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: 'La contraseña debe tener al menos 6 caracteres',
    };
  }

  // Puedes agregar más validaciones aquí si quieres
  // Por ejemplo: mayúsculas, minúsculas, números, caracteres especiales

  return {
    valid: true,
    message: 'Contraseña válida',
  };
};

/**
 * Valida que el nombre sea válido
 * @param {string} name
 * @returns {boolean}
 */
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

/**
 * Valida que el teléfono sea válido (opcional)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return true; // El teléfono es opcional
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitiza el input de usuario
 * @param {string} input
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim();
};
