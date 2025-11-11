#!/bin/bash

# Script para verificar que todo está listo para deployment
# Uso: bash check-deployment.sh

echo "🔍 Verificando configuración para deployment..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

errors=0
warnings=0

# Verificar Node.js
echo -n "Verificando Node.js... "
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js $node_version"

    # Verificar versión mínima (20.17.0)
    required_version="20.17.0"
    current_version=$(node --version | cut -d 'v' -f 2)

    if [ "$(printf '%s\n' "$required_version" "$current_version" | sort -V | head -n1)" != "$required_version" ]; then
        echo -e "${YELLOW}⚠${NC} Advertencia: Se recomienda Node.js >= $required_version"
        ((warnings++))
    fi
else
    echo -e "${RED}✗${NC} Node.js no encontrado"
    ((errors++))
fi

# Verificar npm
echo -n "Verificando npm... "
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo -e "${GREEN}✓${NC} npm $npm_version"
else
    echo -e "${RED}✗${NC} npm no encontrado"
    ((errors++))
fi

# Verificar PM2
echo -n "Verificando PM2... "
if command -v pm2 &> /dev/null; then
    pm2_version=$(pm2 --version)
    echo -e "${GREEN}✓${NC} PM2 $pm2_version"
else
    echo -e "${YELLOW}⚠${NC} PM2 no encontrado (instalar con: npm install -g pm2)"
    ((warnings++))
fi

# Verificar Nginx
echo -n "Verificando Nginx... "
if command -v nginx &> /dev/null; then
    nginx_version=$(nginx -v 2>&1 | cut -d '/' -f 2)
    echo -e "${GREEN}✓${NC} Nginx $nginx_version"
else
    echo -e "${YELLOW}⚠${NC} Nginx no encontrado"
    ((warnings++))
fi

# Verificar PostgreSQL
echo -n "Verificando PostgreSQL... "
if command -v psql &> /dev/null; then
    psql_version=$(psql --version | cut -d ' ' -f 3)
    echo -e "${GREEN}✓${NC} PostgreSQL $psql_version"
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL no encontrado"
    ((warnings++))
fi

# Verificar archivo .env
echo -n "Verificando archivo .env... "
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} Archivo .env existe"

    # Verificar variables críticas
    required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env; then
            echo -e "${RED}✗${NC} Variable $var no encontrada en .env"
            ((errors++))
        fi
    done
else
    echo -e "${RED}✗${NC} Archivo .env no encontrado"
    ((errors++))
fi

# Verificar node_modules
echo -n "Verificando dependencias... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules existe"
else
    echo -e "${YELLOW}⚠${NC} node_modules no encontrado (ejecutar: npm ci)"
    ((warnings++))
fi

# Verificar Prisma
echo -n "Verificando Prisma Client... "
if [ -d "node_modules/.prisma/client" ]; then
    echo -e "${GREEN}✓${NC} Prisma Client generado"
else
    echo -e "${YELLOW}⚠${NC} Prisma Client no generado (ejecutar: npx prisma generate)"
    ((warnings++))
fi

# Verificar build
echo -n "Verificando build de Next.js... "
if [ -d ".next" ]; then
    echo -e "${GREEN}✓${NC} Build de Next.js existe"
else
    echo -e "${YELLOW}⚠${NC} Build no encontrado (ejecutar: npm run build)"
    ((warnings++))
fi

# Verificar directorio de logs
echo -n "Verificando directorio de logs... "
if [ -d "logs" ]; then
    echo -e "${GREEN}✓${NC} Directorio logs existe"
else
    echo -e "${YELLOW}⚠${NC} Creando directorio logs..."
    mkdir -p logs
    echo -e "${GREEN}✓${NC} Directorio logs creado"
fi

# Verificar permisos de archivos estáticos
echo -n "Verificando permisos de public/... "
if [ -d "public" ]; then
    if [ -r "public" ] && [ -x "public" ]; then
        echo -e "${GREEN}✓${NC} Permisos correctos"
    else
        echo -e "${YELLOW}⚠${NC} Permisos incorrectos (ejecutar: chmod -R 755 public)"
        ((warnings++))
    fi
else
    echo -e "${RED}✗${NC} Directorio public/ no encontrado"
    ((errors++))
fi

# Verificar Git
echo -n "Verificando Git... "
if [ -d ".git" ]; then
    branch=$(git rev-parse --abbrev-ref HEAD)
    echo -e "${GREEN}✓${NC} Git inicializado (rama: $branch)"

    # Verificar si hay cambios sin commitear
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠${NC} Hay cambios sin commitear"
        ((warnings++))
    fi
else
    echo -e "${YELLOW}⚠${NC} No es un repositorio Git"
    ((warnings++))
fi

# Resumen
echo ""
echo "=========================================="
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ Todo listo para deployment${NC}"
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ Listo con $warnings advertencia(s)${NC}"
    exit 0
else
    echo -e "${RED}✗ $errors error(es) encontrado(s)${NC}"
    echo -e "${YELLOW}⚠ $warnings advertencia(s)${NC}"
    echo ""
    echo "Por favor, corrija los errores antes de hacer deployment."
    exit 1
fi
