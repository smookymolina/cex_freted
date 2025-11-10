const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * Seed básico: Crea solo el usuario admin con rol SOPORTE
 * Ejecutado con: npm run db:reset
 */
async function main() {
  console.log('🌱 Iniciando seed básico...');
  console.log('📝 Creando usuario admin con rol SOPORTE\n');

  const email = 'admin_general@sti.com';
  const password = 'Admin01';

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('⚠️  El usuario admin ya existe.');
    console.log(`   Email: ${existingUser.email}`);
    console.log(`   Rol: ${existingUser.role}`);
    console.log(`   ID: ${existingUser.id}\n`);
    console.log('✅ Seed completado (sin cambios).');
    return;
  }

  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario admin con rol SOPORTE
  const user = await prisma.user.create({
    data: {
      email: email,
      name: 'Admin General',
      password: hashedPassword,
      role: Role.SOPORTE,
      emailVerified: new Date(),
      notifyEmail: true,
      notifyPush: false,
      notifySms: false,
      notifyMarketing: false,
      profilePublic: false,
      showPurchases: false,
      allowMessages: true,
    },
  });

  console.log('✅ Usuario admin creado exitosamente:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Nombre: ${user.name}`);
  console.log(`   Rol: ${user.role}`);
  console.log(`   Contraseña: ${password}\n`);
  console.log('🎉 Seed básico completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
