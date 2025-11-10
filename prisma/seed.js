const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const email = 'admin_general@sti.com';
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('Admin user already exists. Seeding skipped.');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin01', 10);

  const user = await prisma.user.create({
    data: {
      email: email,
      name: 'Admin General',
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: new Date(), // Marcar el email como verificado
    },
  });

  console.log(`Created admin user with id: ${user.id}`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
