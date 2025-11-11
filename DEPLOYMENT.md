# Guía de Deployment en VPS Ubuntu

Esta guía te ayudará a desplegar la aplicación CEX Freted en un servidor VPS Ubuntu.

## Requisitos Previos

- VPS Ubuntu 20.04 o superior
- Acceso root o sudo
- Dominio apuntando a tu VPS (opcional pero recomendado)

## 1. Preparación del Servidor

### 1.1 Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Instalar Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Debe mostrar v20.x.x
npm --version
```

### 1.3 Instalar PM2 globalmente

```bash
sudo npm install -g pm2
pm2 startup  # Seguir las instrucciones que aparezcan
```

### 1.4 Instalar Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 1.5 Instalar PostgreSQL (si no lo tienes)

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

## 2. Configuración de Base de Datos

### 2.1 Crear base de datos y usuario

```bash
sudo -u postgres psql

# Dentro de psql:
CREATE DATABASE cex_freted;
CREATE USER cex_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE cex_freted TO cex_user;
\q
```

## 3. Deployment de la Aplicación

### 3.1 Crear directorio de la aplicación

```bash
sudo mkdir -p /var/www/cex-freted
sudo chown -R $USER:$USER /var/www/cex-freted
```

### 3.2 Clonar el repositorio

```bash
cd /var/www/cex-freted
git clone <URL_DE_TU_REPOSITORIO> .
```

### 3.3 Instalar dependencias

```bash
npm ci
```

### 3.4 Configurar variables de entorno

```bash
nano .env
```

Contenido del archivo `.env`:

```env
# Database
DATABASE_URL="postgresql://cex_user:tu_password_seguro@localhost:5432/cex_freted"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="genera_un_secret_aleatorio_aqui"

# JWT
JWT_SECRET="otro_secret_aleatorio_para_jwt"

# Email (configurar según tu proveedor)
EMAIL_SERVER="smtp://usuario:password@smtp.gmail.com:587"
EMAIL_FROM="noreply@tu-dominio.com"

# Node Environment
NODE_ENV="production"
```

Para generar secrets seguros:

```bash
openssl rand -base64 32
```

### 3.5 Configurar base de datos con Prisma

```bash
npx prisma generate
npx prisma migrate deploy
# Opcional: npx prisma db seed (si tienes seeds)
```

### 3.6 Crear directorio de logs

```bash
mkdir -p logs
```

### 3.7 Construir la aplicación

```bash
npm run build
```

### 3.8 Iniciar con PM2

```bash
pm2 start ecosystem.config.js
pm2 save
```

## 4. Configuración de Nginx

### 4.1 Copiar configuración de Nginx

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/cex-freted
```

### 4.2 Editar la configuración

```bash
sudo nano /etc/nginx/sites-available/cex-freted
```

Reemplazar `tu-dominio.com` con tu dominio real.

### 4.3 Habilitar el sitio

```bash
sudo ln -s /etc/nginx/sites-available/cex-freted /etc/nginx/sites-enabled/
sudo nginx -t  # Verificar configuración
sudo systemctl reload nginx
```

## 5. Configurar SSL con Let's Encrypt (RECOMENDADO)

### 5.1 Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 Obtener certificado SSL

```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

Seguir las instrucciones en pantalla. Certbot configurará automáticamente Nginx para usar SSL.

### 5.3 Verificar renovación automática

```bash
sudo certbot renew --dry-run
```

## 6. Configurar Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

## 7. Deployments Futuros

Para deployments posteriores, usa el script de deployment:

```bash
cd /var/www/cex-freted
bash deploy.sh
```

O manualmente:

```bash
cd /var/www/cex-freted
git pull origin main
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 reload ecosystem.config.js
```

## 8. Comandos Útiles de PM2

```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs cex-freted

# Ver logs específicos
pm2 logs cex-freted --lines 100

# Reiniciar aplicación
pm2 reload cex-freted

# Detener aplicación
pm2 stop cex-freted

# Eliminar de PM2
pm2 delete cex-freted

# Monitorear recursos
pm2 monit
```

## 9. Monitoreo y Mantenimiento

### 9.1 Ver logs de Nginx

```bash
sudo tail -f /var/log/nginx/cex-freted-access.log
sudo tail -f /var/log/nginx/cex-freted-error.log
```

### 9.2 Verificar uso de recursos

```bash
htop
pm2 monit
```

### 9.3 Backup de base de datos

```bash
# Crear backup
sudo -u postgres pg_dump cex_freted > backup_$(date +%Y%m%d).sql

# Restaurar backup
sudo -u postgres psql cex_freted < backup_20250101.sql
```

## 10. Troubleshooting

### Problema: La aplicación no inicia

```bash
# Ver logs de PM2
pm2 logs cex-freted --lines 50

# Verificar que el puerto 3000 no esté en uso
sudo lsof -i :3000

# Verificar configuración de .env
cat .env
```

### Problema: Nginx muestra 502 Bad Gateway

```bash
# Verificar que la app esté corriendo
pm2 status

# Verificar logs de Nginx
sudo tail -f /var/log/nginx/cex-freted-error.log

# Reiniciar servicios
pm2 reload cex-freted
sudo systemctl restart nginx
```

### Problema: Errores de base de datos

```bash
# Verificar conexión a PostgreSQL
sudo systemctl status postgresql

# Ver logs de PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log

# Verificar que las migraciones estén aplicadas
npx prisma migrate status
```

### Problema: Imágenes no se cargan

```bash
# Verificar permisos
sudo chown -R $USER:$USER /var/www/cex-freted/public
chmod -R 755 /var/www/cex-freted/public

# Verificar configuración de Nginx para archivos estáticos
sudo nano /etc/nginx/sites-available/cex-freted
```

## 11. Optimizaciones Adicionales

### 11.1 Habilitar compresión Brotli en Nginx (opcional)

```bash
sudo apt install -y nginx-module-brotli
```

### 11.2 Configurar cache en Nginx

Ya está incluido en `nginx.conf.example`.

### 11.3 Monitoreo con PM2 Plus (opcional)

```bash
pm2 link <secret_key> <public_key>
```

Obtén las keys en: https://pm2.io/

## 12. Checklist de Deployment

- [ ] Node.js 20.x instalado
- [ ] PM2 instalado globalmente
- [ ] Nginx instalado y configurado
- [ ] PostgreSQL instalado y configurado
- [ ] Base de datos creada
- [ ] Repositorio clonado en `/var/www/cex-freted`
- [ ] Archivo `.env` configurado correctamente
- [ ] Dependencias instaladas (`npm ci`)
- [ ] Prisma migrations ejecutadas
- [ ] Build completado (`npm run build`)
- [ ] Aplicación corriendo con PM2
- [ ] Nginx configurado como reverse proxy
- [ ] SSL configurado con Let's Encrypt
- [ ] Firewall configurado
- [ ] PM2 configurado para auto-start en boot

## Soporte

Si encuentras problemas durante el deployment, revisa:
1. Los logs de PM2: `pm2 logs cex-freted`
2. Los logs de Nginx: `sudo tail -f /var/log/nginx/cex-freted-error.log`
3. Los logs de la aplicación en: `./logs/`
