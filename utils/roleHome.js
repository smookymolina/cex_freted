const SUPPORT_HOME_ROUTE = '/admin/ordenes';
const BUYER_HOME_ROUTE = '/mi-cuenta/dashboard';

/**
 * Mapa de rutas por rol; se puede extender sin tocar la lógica.
 */
const ROLE_HOME_MAP = {
  SOPORTE: SUPPORT_HOME_ROUTE,
  COMPRADOR: BUYER_HOME_ROUTE,
};

/**
 * Determina la ruta de inicio adecuada para un usuario autenticado.
 * @param {Object} user - Usuario proveniente de la sesión NextAuth.
 * @returns {string} Ruta a la que se debe enviar al usuario.
 */
export const resolveRoleHomeRoute = (user = {}) => {
  if (!user || typeof user !== 'object') {
    return BUYER_HOME_ROUTE;
  }

  const { role } = user;

  if (role && ROLE_HOME_MAP[role]) {
    return ROLE_HOME_MAP[role];
  }

  return BUYER_HOME_ROUTE;
};

/**
 * Determina la ruta final post login dando prioridad a callbackUrl seguros.
 * @param {Object} params
 * @param {string} params.callbackUrl - Callback validado (ya seguro).
 * @param {Object} params.user - Usuario de sesión NextAuth.
 * @returns {string}
 */
export const getPostLoginRoute = ({ callbackUrl, user }) => {
  const roleHome = resolveRoleHomeRoute(user);
  const role = user?.role;
  const forceRoleRoute = role && role !== 'COMPRADOR';

  if (forceRoleRoute) {
    return roleHome;
  }

  return callbackUrl || roleHome || BUYER_HOME_ROUTE;
};

export const constants = {
  SUPPORT_HOME_ROUTE,
  BUYER_HOME_ROUTE,
  ROLE_HOME_MAP,
};

export default resolveRoleHomeRoute;
