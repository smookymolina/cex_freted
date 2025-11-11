#!/bin/bash

# Script de deployment para CEX Freted en VPS Ubuntu
# Uso: bash deploy.sh

set -e

echo "🚀 Iniciando deployment de CEX Freted..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables (ajustar según tu configuración)
APP_DIR="/var/www/cex-freted"
APP_NAME="cex-freted"

echo -e "${YELLOW}📦 Actualizando código desde Git...${NC}"
cd $APP_DIR
git pull origin main

echo -e "${YELLOW}📥 Instalando dependencias...${NC}"
npm ci --production=false

echo -e "${YELLOW}🗃️  Generando Prisma Client...${NC}"
npx prisma generate

echo -e "${YELLOW}🔧 Construyendo aplicación...${NC}"
npm run build

echo -e "${YELLOW}🔄 Reiniciando aplicación con PM2...${NC}"
pm2 reload ecosystem.config.js --env production

echo -e "${YELLOW}💾 Guardando configuración de PM2...${NC}"
pm2 save

echo -e "${GREEN}✅ Deployment completado exitosamente!${NC}"

echo -e "${YELLOW}📊 Estado de la aplicación:${NC}"
pm2 status $APP_NAME

echo -e "${YELLOW}📝 Últimos logs:${NC}"
pm2 logs $APP_NAME --lines 20 --nostream
