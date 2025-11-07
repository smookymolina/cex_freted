/**
 * Script para crear usuarios de soporte técnico
 *
 * Uso:
 *   node scripts/create-support-user.js
 *
 * O para especificar datos personalizados:
 *   node scripts/create-support-user.js email@ejemplo.com "Nombre Completo" contraseña123
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createSupportUser(email, name, password) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('\n⚠️  El usuario ya existe.');
      const updateRole = await question('¿Deseas actualizar su rol a SOPORTE? (s/n): ');

      if (updateRole.toLowerCase() === 's') {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { role: 'SOPORTE' },
        });

        console.log('\n✅ Usuario actualizado exitosamente:');
        console.log('   Email:', updatedUser.email);
        console.log('   Nombre:', updatedUser.name);
        console.log('   Rol:', updatedUser.role);
        console.log('\n🔐 Ahora puedes iniciar sesión en /soporte/login');
      } else {
        console.log('\n❌ Operación cancelada.');
      }
    } else {
      // Crear nuevo usuario
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'SOPORTE',
        },
      });

      console.log('\n✅ Usuario de soporte creado exitosamente:');
      console.log('   Email:', newUser.email);
      console.log('   Nombre:', newUser.name);
      console.log('   Rol:', newUser.role);
      console.log('\n🔐 Credenciales de acceso:');
      console.log('   URL: /soporte/login');
      console.log('   Email:', email);
      console.log('   Contraseña:', password);
      console.log('\n⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro.');
    }
  } catch (error) {
    console.error('\n❌ Error al crear usuario de soporte:', error.message);
    throw error;
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║    CREADOR DE USUARIOS DE SOPORTE TÉCNICO    ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  try {
    // Obtener datos del usuario
    const args = process.argv.slice(2);

    let email, name, password;

    if (args.length >= 3) {
      // Usar argumentos de línea de comandos
      [email, name, password] = args;
      console.log('📝 Usando datos proporcionados por argumentos...\n');
    } else {
      // Modo interactivo
      console.log('📝 Por favor, ingresa los datos del usuario de soporte:\n');

      email = await question('Email: ');
      name = await question('Nombre completo: ');
      password = await question('Contraseña: ');

      console.log('');
    }

    // Validar datos
    if (!email || !email.includes('@')) {
      throw new Error('Email inválido');
    }

    if (!name || name.trim().length < 3) {
      throw new Error('Nombre debe tener al menos 3 caracteres');
    }

    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Confirmar
    console.log('📋 Resumen de datos:');
    console.log('   Email:', email);
    console.log('   Nombre:', name);
    console.log('   Rol: SOPORTE');
    console.log('');

    const confirm = await question('¿Confirmar creación? (s/n): ');

    if (confirm.toLowerCase() === 's') {
      await createSupportUser(email, name, password);
    } else {
      console.log('\n❌ Operación cancelada.');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n👋 Script finalizado.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
