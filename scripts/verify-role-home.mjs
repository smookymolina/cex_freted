import { resolveRoleHomeRoute, getPostLoginRoute, constants } from '../utils/roleHome.js';

const cases = [
  {
    name: 'Comprador autenticado sin callback',
    input: { user: { role: 'COMPRADOR' } },
    expected: constants.BUYER_HOME_ROUTE,
  },
  {
    name: 'Soporte redirige al panel administrativo',
    input: { user: { role: 'SOPORTE' } },
    expected: constants.SUPPORT_HOME_ROUTE,
  },
  {
    name: 'Rol desconocido cae al dashboard',
    input: { user: { role: 'VENTAS' } },
    expected: constants.BUYER_HOME_ROUTE,
  },
  {
    name: 'Post login prioriza rol sobre callback',
    input: {
      user: { role: 'SOPORTE' },
      callbackUrl: '/mi-cuenta/perfil',
      type: 'post-login',
    },
    expected: constants.SUPPORT_HOME_ROUTE,
  },
  {
    name: 'Post login usa callback cuando no hay rol',
    input: {
      user: {},
      callbackUrl: '/mi-cuenta/perfil',
      type: 'post-login',
    },
    expected: '/mi-cuenta/perfil',
  },
];

let passed = 0;
let failed = 0;

cases.forEach(({ name, input, expected }) => {
  const result =
    input.type === 'post-login'
      ? getPostLoginRoute({ user: input.user, callbackUrl: input.callbackUrl })
      : resolveRoleHomeRoute(input.user);

  if (result === expected) {
    passed += 1;
    console.log(`✅  ${name}`);
  } else {
    failed += 1;
    console.error(`❌  ${name} -> esperado "${expected}" pero se obtuvo "${result}"`);
  }
});

console.log(`\nTotal: ${passed + failed}, Aprobados: ${passed}, Fallidos: ${failed}`);

if (failed > 0) {
  process.exit(1);
}
