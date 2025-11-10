# CEX Freted Frontend

Aplicacion Next.js/Prisma para la gestion de cuentas y pedidos de CEX Freted. Este README resume los requisitos locales y los pasos para desplegar en un VPS Ubuntu 25 siguiendo la estrategia acordada con el equipo.

## Requisitos

- Node.js 20.17.0 (se fuerza via `.nvmrc` y `.node-version`)
- npm 10.8+ (incluido en Node 20.17)
- SQLite 3.45+ (para desarrollo y despliegues ligeros)
- PM2 (solo en servidores para ejecutar `next start`)
- Git y build-essential (para compilar dependencias nativas)

Los paquetes de sistema equivalentes estan listados en `requirements.txt`.

## Instalacion local

```bash
nvm use # o asdf use, respeta la version indicada
npm install
cp .env.example .env
npx prisma migrate deploy --schema prisma/schema.prisma # o prisma migrate dev si necesitas editar el schema
npm run dev
```

## Variables de entorno

Revisa `.env.example`. Para produccion debes:

- Cambiar todos los secretos (`JWT_*`, `NEXTAUTH_SECRET`) por cadenas generadas (`openssl rand -hex 32`).
- Ajustar `NEXTAUTH_URL` al dominio publico HTTPS.
- Usar una ruta persistente para `DATABASE_URL`, por ejemplo `file:../shared/prisma/prod.db`.
- Configurar credenciales SMTP si se usara recuperacion de contrasena.

## Scripts relevantes

- `npm run dev`: ejecuta Next en modo desarrollo.
- `npm run build`: genera la build de produccion.
- `npm start`: sirve la build (utilizado por PM2 en el VPS).
- `npm run lint`: aplica las reglas de ESLint.
- `npm run postinstall`: ejecuta `prisma generate` automaticamente tras cada `npm install`/`npm ci`.

### Gestion de base de datos

- `npm run db:reset`: **Reinicia completamente la base de datos** (elimina todos los datos, recrea las tablas, aplica todas las migraciones y ejecuta el seed para crear el usuario admin con rol SOPORTE).
  - **Credenciales del admin creado:**
    - Email: `admin_general@sti.com`
    - Password: `Admin01`
    - Rol: `SOPORTE`
  - **Usar cuando:** necesites empezar desde cero con la base de datos limpia.

- `npm run db:reset:full`: **Aplica solo las migraciones pendientes** sin eliminar datos existentes (preserva todos los registros actuales en la base de datos).
  - **Usar cuando:** necesites actualizar el schema de la base de datos pero quieras mantener todos los datos existentes.

Scripts utilitarios adicionales se encuentran en `scripts/` (`create-support-user.js`, `verify-role-home.mjs`).

## Despliegue en VPS (resumen)

1. **Preparar el repositorio**: confirma scripts npm, completa `.env.production`, agrega secretos reales y haz push. Manten sincronizado `deploy-instructions.txt` para el equipo.
2. **Preparar el servidor**: crea usuario `deploy`, instala dependencias (`git`, `build-essential`, `sqlite3`, Node 20, pm2), configura la ruta compartida `/opt/cex-freted/shared` y copia el `.env`.
3. **Clonar y ejecutar**:
   ```bash
   cd /opt/cex-freted/app
   git clone git@github.com:tu-org/cex_freted.git .
   ln -s ../shared/.env .env
   npm ci
   npx prisma migrate deploy
   npm run build
   pm2 start npm --name cex-freted -- start
   pm2 save && pm2 startup systemd
   ```

Para mas detalles consulta `deploy-instructions.txt`.
