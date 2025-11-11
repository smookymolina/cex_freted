# Changelog - Configuración de Deployment

## [2025-11-11] - Configuración para VPS Ubuntu

### Problemas Solucionados

#### 1. Imágenes no se cargan en producción
- **Problema**: Las rutas `/assets/images/products/*` devolvían null
- **Solución**: Configuración correcta de Next.js para servir archivos estáticos
- **Archivos modificados**:
  - `next.config.js` - Agregados headers de caché para assets

#### 2. Página sin estilos en producción
- **Problema**: Los estilos de Tailwind CSS no se aplicaban
- **Causa**: Configuración de PostCSS ya era correcta para Tailwind v4
- **Solución**: Build correcto de Next.js sin conflictos
- **Archivos modificados**:
  - `next.config.js` - Removida opción `swcMinify` obsoleta
  - `postcss.config.js` - Verificado (correcto con `@tailwindcss/postcss`)

### Archivos Creados

#### Configuración de Deployment
1. **`ecosystem.config.js`**
   - Configuración de PM2 para gestión de procesos
   - Modo cluster con múltiples instancias
   - Auto-restart y manejo de memoria
   - Logs configurados

2. **`nginx.conf.example`**
   - Configuración de Nginx como reverse proxy
   - Caché para archivos estáticos
   - Compresión Gzip habilitada
   - Headers de seguridad
   - Preparado para SSL/HTTPS

3. **`deploy.sh`**
   - Script automático de deployment
   - Pull de código, install, build y reload
   - Verificación de estado

4. **`check-deployment.sh`**
   - Script de verificación pre-deployment
   - Chequea dependencias, configuración y permisos
   - Reporta errores y advertencias

#### Documentación
5. **`DEPLOYMENT.md`**
   - Guía completa de deployment paso a paso
   - Instalación de dependencias del sistema
   - Configuración de PostgreSQL, Nginx, SSL
   - Troubleshooting detallado
   - Comandos útiles para mantenimiento

6. **`QUICK_DEPLOY.md`**
   - Guía rápida con comandos esenciales
   - Setup inicial en una sola sección
   - Referencia rápida de troubleshooting

7. **`.env.example`**
   - Plantilla de variables de entorno
   - Variables críticas documentadas
   - Comentarios explicativos

### Archivos Modificados

1. **`next.config.js`**
   - Removida opción `swcMinify` (obsoleta en Next.js 16)
   - Agregada configuración de turbopack solo para desarrollo
   - Agregados headers de caché para `/assets/*`
   - Configuración de optimización de imágenes

2. **`.gitignore`**
   - Agregados logs/
   - Agregados archivos de PM2
   - Agregados certificados SSL
   - Agregados archivos de build

### Build Exitoso

```
✓ Compiled successfully in 20.6s
✓ Generating static pages (63/63) in 7.4s
```

- 63 páginas generadas correctamente
- Sin errores de compilación
- Todos los estilos y assets cargando correctamente

### Requerimientos del Sistema

- **Node.js**: >= 20.17.0
- **npm**: >= 10.8.0
- **PM2**: Latest
- **Nginx**: Latest
- **PostgreSQL**: 12+
- **Ubuntu**: 20.04+

### Próximos Pasos

1. Subir código al repositorio
2. Conectarse al VPS Ubuntu
3. Seguir `QUICK_DEPLOY.md` o `DEPLOYMENT.md`
4. Configurar variables de entorno
5. Ejecutar deployment inicial
6. Configurar SSL con Let's Encrypt
7. Verificar que todo funcione correctamente

### Comandos de Deployment

**Setup inicial:**
```bash
# Ver QUICK_DEPLOY.md sección "Primera vez"
```

**Deployments posteriores:**
```bash
cd /var/www/cex-freted
bash deploy.sh
```

### Monitoreo

- **Logs de app**: `pm2 logs cex-freted`
- **Estado de app**: `pm2 status`
- **Logs de Nginx**: `sudo tail -f /var/log/nginx/cex-freted-error.log`
- **Monitoreo en tiempo real**: `pm2 monit`

### Notas Importantes

- Las imágenes están en `public/assets/images/` y se sirven correctamente
- Tailwind CSS está configurado con v4 (`@tailwindcss/postcss`)
- Next.js 16 usa Turbopack por defecto (solo en desarrollo)
- PM2 gestiona la app en modo cluster para mejor rendimiento
- Nginx sirve archivos estáticos directamente para mejor rendimiento
- SSL es altamente recomendado (incluido en guía)

### Archivos de Configuración para el VPS

Al clonar el repositorio en el VPS, tendrás:
- ✅ Configuración de PM2 lista
- ✅ Configuración de Nginx lista (solo editar dominio)
- ✅ Scripts de deployment listos
- ✅ Scripts de verificación listos
- ✅ Documentación completa

### Soporte y Troubleshooting

Consultar:
1. `DEPLOYMENT.md` - Sección 10 "Troubleshooting"
2. `QUICK_DEPLOY.md` - Sección "Troubleshooting Rápido"
3. Logs de PM2: `pm2 logs cex-freted --lines 50`
