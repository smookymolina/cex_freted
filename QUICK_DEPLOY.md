# Guía Rápida de Deployment - VPS Ubuntu

## Comandos Rápidos en el Servidor

### Primera vez (Setup inicial)

```bash
# 1. Instalar dependencias del sistema
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update && sudo apt install -y nodejs nginx postgresql postgresql-contrib
sudo npm install -g pm2

# 2. Configurar PostgreSQL
sudo -u postgres psql << EOF
CREATE DATABASE cex_freted;
CREATE USER cex_user WITH ENCRYPTED PASSWORD 'TU_PASSWORD_AQUI';
GRANT ALL PRIVILEGES ON DATABASE cex_freted TO cex_user;
\q
EOF

# 3. Clonar proyecto
sudo mkdir -p /var/www/cex-freted
sudo chown -R $USER:$USER /var/www/cex-freted
cd /var/www/cex-freted
git clone <URL_DE_TU_REPO> .

# 4. Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con tus valores reales

# 5. Instalar y configurar
npm ci
npx prisma generate
npx prisma migrate deploy
mkdir -p logs
npm run build

# 6. Iniciar con PM2
pm2 start ecosystem.config.js
pm2 startup  # Seguir instrucciones
pm2 save

# 7. Configurar Nginx
sudo cp nginx.conf.example /etc/nginx/sites-available/cex-freted
sudo nano /etc/nginx/sites-available/cex-freted  # Cambiar tu-dominio.com
sudo ln -s /etc/nginx/sites-available/cex-freted /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 8. SSL (opcional pero recomendado)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# 9. Firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Deployments posteriores

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

## Comandos Útiles

```bash
# Estado de la app
pm2 status

# Ver logs
pm2 logs cex-freted --lines 50

# Reiniciar app
pm2 reload cex-freted

# Estado de Nginx
sudo systemctl status nginx

# Logs de Nginx
sudo tail -f /var/log/nginx/cex-freted-error.log

# Estado de PostgreSQL
sudo systemctl status postgresql
```

## Troubleshooting Rápido

### App no inicia
```bash
pm2 logs cex-freted --lines 50
pm2 restart cex-freted
```

### 502 Bad Gateway
```bash
pm2 status  # Verificar que esté corriendo
sudo systemctl restart nginx
```

### Error de base de datos
```bash
sudo systemctl status postgresql
npx prisma migrate status
npx prisma migrate deploy
```

## Variables de Entorno Críticas

Asegúrate de configurar estas variables en `.env`:

```env
DATABASE_URL="postgresql://cex_user:password@localhost:5432/cex_freted"
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="<genera con: openssl rand -base64 32>"
JWT_SECRET="<genera con: openssl rand -base64 32>"
NODE_ENV="production"
```

## Verificar antes de Deployment

```bash
bash check-deployment.sh
```

## Documentación Completa

Ver `DEPLOYMENT.md` para instrucciones detalladas.
