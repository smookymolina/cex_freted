# GUÍA COMPLETA DE IMPLEMENTACIÓN - PLATAFORMA RECOMMERCE TECNOLÓGICO

## ÍNDICE DE FASES

1. [FASE 0: Preparación y Configuración Inicial](#fase-0)
2. [FASE 1: Construcción del MVP (Meses 0-2)](#fase-1)
3. [FASE 2: Despliegue y Testing (Mes 2-3)](#fase-2)
4. [FASE 3: Gestión de Contenido e Imágenes (Mes 3-4)](#fase-3)
5. [FASE 4: Integración de Pagos (Mes 4-5)](#fase-4)
6. [FASE 5: Expansión y Fidelización (Mes 6-12)](#fase-5)
7. [FASE 6: Escalamiento (Mes 13+)](#fase-6)

---

<a name="fase-0"></a>
## FASE 0: PREPARACIÓN Y CONFIGURACIÓN INICIAL (Semana 0-1)

### Objetivos
- Definir stack tecnológico definitivo
- Configurar entorno de desarrollo
- Establecer arquitectura base
- Preparar repositorios y pipelines

### 0.1 Decisiones Técnicas Críticas

#### Stack Tecnológico Recomendado
```
FRONTEND:
- Framework: Next.js 14+ (App Router)
- UI Components: Shadcn/ui + Tailwind CSS
- State Management: Zustand o React Context
- Formularios: React Hook Form + Zod
- Búsqueda: Algolia (recomendado) o MeiliSearch

BACKEND:
- Opción A (Recomendada): Strapi 4+ (Headless CMS)
- Opción B: Node.js + Express + Prisma
- Base de datos: PostgreSQL
- File Storage: Cloudinary o AWS S3

INFRAESTRUCTURA:
- Frontend: Vercel
- Backend: Render.com o Railway
- Database: Supabase o Render PostgreSQL
- CDN: Cloudflare
```

#### Checklist de Configuración Inicial
- [ ] Crear repositorio Git (monorepo o dual-repo)
- [ ] Configurar .gitignore y .env.example
- [ ] Instalar Next.js con TypeScript
- [ ] Configurar Tailwind CSS + Shadcn/ui
- [ ] Configurar ESLint + Prettier
- [ ] Crear estructura de carpetas base
- [ ] Configurar backend (Strapi o custom)
- [ ] Configurar PostgreSQL local y remoto
- [ ] Configurar variables de entorno para desarrollo/producción

### 0.2 Arquitectura de Información

```
ESTRUCTURA DE RUTAS (Next.js App Router):

/app
  /(marketing)
    /page.tsx                    # Home
    /comprar
      /page.tsx                  # Catálogo principal
      /[categoria]
        /page.tsx                # Categoría
        /[producto]
          /page.tsx              # Producto individual
    /vender
      /page.tsx                  # Landing vender
      /tasacion/page.tsx         # Flujo de tasación
    /nosotros/page.tsx
    /certificacion/page.tsx
    /garantias/page.tsx
    /blog
      /page.tsx                  # Lista de artículos
      /[slug]/page.tsx           # Artículo individual
  /(auth)
    /login/page.tsx
    /registro/page.tsx
    /perfil/page.tsx
  /(checkout)
    /carrito/page.tsx
    /checkout/page.tsx
    /confirmacion/page.tsx
  /api
    /productos/route.ts
    /tasacion/route.ts
    /pagos/route.ts
```

### 0.3 Diseño Visual Base

#### Paleta de Colores
```css
/* Guardar en tailwind.config.js */
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',  // Azul principal (confianza)
    700: '#1d4ed8',
  },
  secondary: {
    500: '#10b981',  // Verde (sostenibilidad + CTA)
    600: '#059669',
  },
  neutral: {
    100: '#f5f5f5',
    800: '#1f2937',
  }
}
```

#### Componentes Base a Crear
- [ ] Button (variantes: primary, secondary, outline, ghost)
- [ ] Card (para productos, certificados, pasos)
- [ ] Badge (grados, garantía, estado)
- [ ] Input, Select, Textarea (formularios)
- [ ] Modal/Dialog
- [ ] Toast/Notification
- [ ] Breadcrumb
- [ ] Tabs

---

<a name="fase-1"></a>
## FASE 1: CONSTRUCCIÓN DEL MVP (Meses 0-2)

**Objetivo**: Crear los flujos fundamentales funcionales sin contenido real

### 1.1 HOME / Landing Page

#### Componentes a Construir

**Hero Section**
```tsx
Elementos:
- Título: "Tecnología Reacondicionada Certificada"
- Subtítulo: "12 meses de garantía + Certificado de 30 puntos"
- 2 CTA: [Comprar Dispositivos] [Vender mi Dispositivo]
- Imagen hero: Dispositivo destacado
```

**Sección: Cómo Funciona (Vender)**
```
3 Cards con iconos:
1. Tasación Instantánea - "Precio al momento"
2. Envío Gratuito - "Recogemos tu dispositivo"
3. Pago en 48h - "Transferencia o PayPal"
```

**Sección: Sistema de Grados**
```
4 Badges interactivos: A+, A, B, C
Al hacer hover/click: Modal con:
- Definición del grado
- Ejemplo fotográfico
- Rango de precio
- Enlace a guía completa
```

**Sección: Certificación**
```
Badge central: "30 Puntos de Control Superados"
- Enlace a página de proceso de certificación
- Mini galería del laboratorio
```

**Sección: Productos Destacados**
```
Grid de 6-8 productos:
- Imagen
- Nombre + Marca
- Selector de grado (dropdown)
- Precio dinámico
- Badge "Garantía 12 meses"
- CTA "Ver detalles"
```

**Sección: Sostenibilidad**
```
Métricas counter animadas:
- X toneladas CO2 ahorradas
- X dispositivos reacondicionados
- X árboles salvados
```

**Sección: Testimonios**
```
Carrusel de 5-6 testimonios:
- Foto del cliente
- Nombre
- Rating (estrellas)
- Comentario breve
```

#### Checklist Técnico Fase 1.1
- [ ] Crear componente Hero con imagen optimizada (Next/Image)
- [ ] Implementar componente StepCard reutilizable
- [ ] Crear componente GradeBadge con modal integrado
- [ ] Implementar ProductCard con selector de grado
- [ ] Integrar animaciones de contador (framer-motion o CountUp.js)
- [ ] Crear componente TestimonialCarousel (swiper.js)
- [ ] Asegurar 100% responsive (mobile-first)
- [ ] Optimizar Core Web Vitals (Lighthouse score >90)

### 1.2 Flujo VENDER (Tasación Multipaso)

**Arquitectura del Flujo**
```
/vender
  -> Landing explicativa
  -> [Iniciar Tasación]
    -> Paso 1: Buscar modelo
    -> Paso 2: Preguntas de estado
    -> Paso 3: Resumen y oferta
    -> Paso 4: Datos personales
    -> Paso 5: Confirmación
```

#### Paso 1: Buscador de Modelo
```tsx
Componentes:
- Input con autocompletado (Algolia Autocomplete)
- Sugerencias: "iPhone 14 Pro 128GB"
- Filtros: Marca > Modelo > Capacidad
- Botón: "Siguiente"

Datos a capturar:
- marca: string
- modelo: string
- almacenamiento: string
- color: string (opcional)
```

#### Paso 2: Formulario de Estado
```tsx
Preguntas dinámicas:

1. ¿Incluye caja original? [Sí +15€] [No]
2. ¿Incluye cargador original? [Sí +10€] [No]
3. Estado de la pantalla:
   - [ ] Perfecta (0€)
   - [ ] Arañazos leves (-20€)
   - [ ] Arañazos visibles (-40€)
   - [ ] Grietas (-100€)
4. Estado de la batería:
   - [ ] >85% salud (0€)
   - [ ] 70-85% (-30€)
   - [ ] <70% (-60€)
5. ¿Funciona Face ID/Touch ID? [Sí] [No -50€]
6. ¿Tiene golpes en el marco? [No] [Leves -15€] [Visibles -40€]

WIDGET LATERAL (sticky):
Precio base: 450€
+ Caja original: +15€
- Arañazos pantalla: -20€
-------------------
TOTAL: 445€
[Aceptar Oferta]
```

**Guía de Grados Contextual**
```
Componente emergente/accordión:
- Mostrar ejemplos fotográficos de cada grado
- Tips: "Si tu pantalla tiene arañazos visibles, probablemente sea Grado B"
```

#### Paso 3: Resumen y Bonificaciones
```tsx
RESUMEN DE OFERTA:
- Modelo: iPhone 14 Pro 128GB
- Estado evaluado: Grado A
- Precio base: 445€

OPCIONES DE PAGO:
○ Transferencia bancaria: 445€
○ PayPal: 445€
● Crédito tienda: 467€ (+5% bonus)

MÉTODO DE ENVÍO:
○ Etiqueta digital gratuita
● Kit premium con caja protectora (+0€)

[Continuar]
```

#### Paso 4: Datos Personales
```tsx
Formulario (React Hook Form + Zod):
- Nombre completo *
- Email *
- Teléfono *
- Dirección de recogida *
- Código postal *
- Preferencia de contacto
- Acepto términos y condiciones *

OPCIONAL: Crear cuenta
- [ ] Sí, quiero crear cuenta para seguimiento
  → Si marca: añadir campo contraseña
```

#### Paso 5: Confirmación
```tsx
PANTALLA DE ÉXITO:
✓ ¡Oferta aceptada!

TIMELINE VISUAL:
① Envío → ② Recepción → ③ Verificación → ④ Pago

SIGUIENTE PASOS:
- Recibirás email con etiqueta de envío
- Tracking number: #WB-2024-001234
- Tiempo estimado de pago: 2-3 días

ACCIONES:
[Descargar etiqueta PDF]
[Ver estado del pedido]
[Vender otro dispositivo]

EMAIL AUTOMÁTICO:
- Resumen de la tasación
- Instrucciones de embalaje
- Etiqueta de envío adjunta
- FAQ sobre el proceso
```

#### Checklist Técnico Fase 1.2
- [ ] Implementar máquina de estados para navegación de pasos (xState o custom)
- [ ] Crear API endpoint POST /api/tasacion
- [ ] Validación de formularios con Zod
- [ ] Lógica de cálculo de precio en tiempo real
- [ ] Integración con Algolia para búsqueda de modelos
- [ ] Crear tabla `tasaciones` en base de datos
- [ ] Implementar generación de etiqueta de envío (PDF con react-pdf)
- [ ] Configurar email transaccional (Resend.com o SendGrid)
- [ ] Guardar estado en localStorage (recuperación de sesión)
- [ ] Validación backend de precios (prevenir manipulación)

### 1.3 Flujo COMPRAR

#### Página de Categorías (/comprar)
```tsx
LAYOUT:
[Sidebar Filtros]              [Grid de Productos]

FILTROS:
- Categoría (checkbox multiple)
  ☑ Smartphones
  ☐ Tablets
  ☐ Laptops
  ☐ Smartwatches

- Marca (checkbox)
  ☑ Apple
  ☑ Samsung
  ☐ Google

- Precio (slider)
  [100€ ----●-------- 1000€]

- Grado (checkbox)
  ☐ A+  ☐ A  ☐ B  ☐ C

- Almacenamiento
  ☐ 64GB  ☑ 128GB  ☐ 256GB

[Limpiar filtros]

ORDENAR POR:
- Relevancia
- Precio: menor a mayor
- Precio: mayor a menor
- Más recientes

GRID:
6 productos por fila (desktop)
2 productos por fila (mobile)
Paginación o scroll infinito
```

#### Product Card Componente
```tsx
<ProductCard>
  <Badge>Grado A</Badge>
  <Image optimizada>
  <Nombre>iPhone 14 Pro 128GB</Nombre>
  <Rating>★★★★★ (124)</Rating>
  <Price>
    <CurrentPrice>549€</CurrentPrice>
    <OriginalPrice>899€</OriginalPrice>
    <Discount>-39%</Discount>
  </Price>
  <Tags>
    - Garantía 12 meses
    - Envío gratis
  </Tags>
  <CTA>Ver detalles</CTA>
</ProductCard>
```

#### Checklist Técnico Fase 1.3
- [ ] Implementar sistema de filtros con URL params (SEO friendly)
- [ ] Integrar Algolia InstantSearch
- [ ] Crear componente FilterSidebar
- [ ] Crear componente ProductGrid con paginación
- [ ] API endpoint GET /api/productos con filtros
- [ ] Implementar favoritos (localStorage + backend si auth)
- [ ] Optimizar imágenes con Next/Image + blur placeholder
- [ ] Meta tags dinámicos por categoría (SEO)

### 1.4 Página de Producto Individual

**Estructura de la Página**
```
┌─────────────────────────────────────────────┐
│  Breadcrumb: Home > Smartphones > iPhone 14 │
├─────────────────┬───────────────────────────┤
│   GALERÍA       │   INFO PRINCIPAL          │
│   DE IMÁGENES   │   - Título + Rating       │
│   (6-8 fotos)   │   - Precio por grado      │
│                 │   - Selector de grado     │
│   [Thumbnails]  │   - Stock disponible      │
│                 │   - CTA Añadir al carrito │
│                 │   - Trade-in link         │
├─────────────────┴───────────────────────────┤
│   TABS:                                     │
│   [Certificado] [Especificaciones] [Reseñas]│
├─────────────────────────────────────────────┤
│   PRODUCTOS RELACIONADOS                    │
└─────────────────────────────────────────────┘
```

#### Selector de Grado Interactivo
```tsx
SELECTOR DE GRADO:

[○ Grado A+] 649€  ← Agotado
[● Grado A]  549€  ← 3 en stock
[○ Grado B]  469€  ← 7 en stock
[○ Grado C]  389€  ← 12 en stock

DETALLES DEL GRADO A:
✓ Estado cosmético: Excelente
✓ Pantalla: Sin arañazos visibles
✓ Batería: >85% salud
✓ Accesorios: Cargador incluido
✓ Garantía: 12 meses
✓ Devolución: 30 días

[¿Qué significa Grado A?] ← Link a modal
```

#### Sección de Certificado
```tsx
CERTIFICADO DE REVISIÓN:

Badge destacado: ✓ 30 PUNTOS DE CONTROL SUPERADOS

Checklist visible (collapsible):
✓ Pantalla LCD/OLED sin pixeles muertos
✓ Touch screen calibrado
✓ Face ID / Touch ID funcional
✓ Cámaras (frontal y trasera) testeadas
✓ Flash y linterna operativos
✓ Altavoces y micrófono funcionales
✓ Botones físicos funcionales
✓ Puertos de carga limpios y operativos
✓ Batería testeada (ciclos y salud)
✓ Conectividad: WiFi, Bluetooth, NFC
✓ GPS y sensores
✓ Sin bloqueo iCloud/Google
✓ IMEI limpio (no reportado)
✓ Limpieza y desinfección profesional
... [Ver los 30 puntos]

[Descargar certificado PDF] [Ver QR]

Técnico responsable: Juan Pérez
Fecha de revisión: 15/10/2024
```

#### Galería de Fotos
```tsx
IMPORTANTE PARA GRADO B y C:
- Incluir fotos REALES del producto exacto
- Close-ups de imperfecciones (arañazos, golpes)
- Etiquetar con flechas las marcas visibles

PARA GRADO A+ y A:
- Fotos profesionales de stock permitidas
- Mínimo 6 ángulos diferentes
```

#### Información Adicional
```tsx
ESPECIFICACIONES TÉCNICAS:
- Pantalla: 6.1" OLED
- Procesador: A15 Bionic
- RAM: 6GB
- Almacenamiento: 128GB
- Cámara: 48MP + 12MP
- Batería: XXmAh (85% salud)
- Sistema: iOS 17

QUÉ INCLUYE:
✓ iPhone 14 Pro reacondicionado
✓ Cable de carga USB-C
✓ Cargador 20W (solo grado A+/A)
✓ Certificado de garantía
✓ Caja genérica (no original)

GARANTÍA Y DEVOLUCIONES:
- Garantía: 12 meses incluidos
- Devolución: 30 días sin preguntas
- Soporte técnico: Chat en vivo
[Ver política completa]
```

#### Cross-Sell
```tsx
PRODUCTOS COMPLEMENTARIOS:

[Funda MagSafe] 19€
[Protector de pantalla] 12€
[AirPods reacondicionados] 89€
[Garantía extendida +12 meses] 49€

¿Tienes un iPhone antiguo?
[Véndelo y obtén 50€ de descuento en este producto]
```

#### Checklist Técnico Fase 1.4
- [ ] Implementar galería con zoom (react-medium-image-zoom)
- [ ] Crear componente GradeSelector con lógica de stock
- [ ] Sistema de variantes (grado) con actualización de precio/stock
- [ ] API endpoint GET /api/productos/[id]
- [ ] Componente CertificadoChecklist con datos reales de DB
- [ ] Generación de certificado PDF por producto
- [ ] Sistema de reseñas y rating (estructura DB)
- [ ] Recomendaciones de productos (algoritmo simple o manual)
- [ ] Integración con carrito (Zustand store)
- [ ] Structured data (JSON-LD) para SEO
- [ ] Open Graph tags para compartir en redes

### 1.5 Carrito y Checkout Básico

#### Página de Carrito (/carrito)
```tsx
CARRITO (3 items)

┌─────────────────────────────────────┐
│ [IMG] iPhone 14 Pro 128GB - Grado A │
│       549€ x1                  549€ │
│       [- 1 +] [Eliminar]            │
├─────────────────────────────────────┤
│ [IMG] Funda MagSafe                 │
│       19€ x2                    38€ │
│       [- 2 +] [Eliminar]            │
├─────────────────────────────────────┤
│ CUPÓN DE DESCUENTO                  │
│ [____________] [Aplicar]            │
├─────────────────────────────────────┤
│ Subtotal:                     587€ │
│ Envío:                      GRATIS │
│ ─────────────────────────────────  │
│ TOTAL:                        587€ │
│                                     │
│ [Continuar comprando]               │
│ [Proceder al pago] ←───────────────│
└─────────────────────────────────────┘

GARANTÍA DE SEGURIDAD:
🔒 Pago 100% seguro
✓ 30 días devolución gratuita
✓ Garantía de 12 meses incluida
```

#### Checkout Proceso (/checkout)
```
PASO 1: Datos de envío
PASO 2: Método de envío
PASO 3: Pago (FASE 4 - por ahora mock)
PASO 4: Confirmación
```

**Paso 1: Datos de Envío**
```tsx
SI EL USUARIO ESTÁ LOGUEADO:
- Pre-rellenar con dirección guardada
- Opción "Usar dirección predeterminada"
- Opción "Nueva dirección"

FORMULARIO:
- Email *
- Nombre completo *
- Teléfono *
- Dirección *
- Ciudad *
- Código postal *
- País *
- Instrucciones de entrega (opcional)

[Guardar como dirección predeterminada]
[Continuar]
```

**Paso 2: Método de Envío**
```tsx
OPCIONES:

○ Estándar (3-5 días) - GRATIS
  Entrega estimada: 25-27 Octubre

○ Express (24-48h) - 9.99€
  Entrega estimada: 23-24 Octubre

[Continuar al pago]
```

**Paso 3: Pago (Temporal - Mock)**
```tsx
PARA MVP FASE 1:
Mostrar diseño pero sin integración real

MÉTODOS DE PAGO:
○ Tarjeta de crédito/débito
○ PayPal
○ Transferencia bancaria
○ Financiación con Klarna (próximamente)

[MENSAJE TEMPORAL]:
"La integración de pagos se activará en Fase 4.
Por ahora puedes continuar para ver la confirmación."

[Simular pago]
```

**Paso 4: Confirmación**
```tsx
✓ ¡PEDIDO CONFIRMADO!

Número de pedido: #WB-20241023-0045
Email de confirmación enviado a: tu@email.com

TIMELINE DEL PEDIDO:
● Pedido recibido (23 Oct, 14:30)
○ Preparando envío
○ Enviado
○ En reparto
○ Entregado

RESUMEN:
- iPhone 14 Pro 128GB (Grado A): 549€
- Funda MagSafe x2: 38€
- Envío: Gratis
TOTAL: 587€

[Ver detalles del pedido]
[Seguir comprando]

---

¿NECESITAS AYUDA?
Chat en vivo | soporte@tutienda.com | +34 900 XXX XXX
```

#### Checklist Técnico Fase 1.5
- [ ] Crear store de carrito (Zustand + localStorage)
- [ ] Componente CartItem con cantidad editable
- [ ] Sistema de cupones (tabla en DB, validación backend)
- [ ] API endpoint POST /api/checkout/crear-pedido
- [ ] Tabla `pedidos` y `pedidos_items` en DB
- [ ] Validación de stock antes de confirmar
- [ ] Email de confirmación de pedido (plantilla HTML)
- [ ] Página de seguimiento de pedido (/pedido/[id])
- [ ] Protección de rutas de checkout (puede requerir auth)

### 1.6 Sistema de Autenticación

#### Páginas Necesarias
```
/login
/registro
/recuperar-password
/perfil
```

**Registro (/registro)**
```tsx
FORMULARIO:
- Nombre *
- Email *
- Contraseña * (mínimo 8 caracteres)
- Confirmar contraseña *
- [ ] Acepto términos y condiciones
- [ ] Quiero recibir ofertas y novedades

[Crear cuenta]

¿Ya tienes cuenta? [Inicia sesión]

OPCIONES RÁPIDAS:
[Continuar con Google]
[Continuar con Apple]
```

**Login (/login)**
```tsx
- Email *
- Contraseña *
- [ ] Recordarme

[Iniciar sesión]
[¿Olvidaste tu contraseña?]

¿No tienes cuenta? [Regístrate]

[Continuar con Google]
[Continuar con Apple]
```

**Panel de Usuario (/perfil)**
```tsx
TABS:
[Mis Pedidos] [Mis Tasaciones] [Datos Personales] [Favoritos]

MIS PEDIDOS:
Lista de pedidos con estado y acciones:
- #WB-001 - iPhone 14 Pro - En camino [Tracking]
- #WB-002 - AirPods - Entregado [Ver detalles]

MIS TASACIONES:
- iPhone 12 - En verificación - 320€
- iPad Air - Pagado - 280€

DATOS PERSONALES:
- Nombre, email, teléfono
- Direcciones guardadas
- Cambiar contraseña

FAVORITOS:
Grid de productos guardados
```

#### Checklist Técnico Fase 1.6
- [ ] Elegir sistema de auth (NextAuth.js recomendado o Clerk)
- [ ] Implementar registro con email/password
- [ ] Hash de contraseñas (bcrypt)
- [ ] Login con JWT o sessions
- [ ] OAuth con Google (opcional para MVP)
- [ ] Recuperación de contraseña (email con token)
- [ ] Middleware de protección de rutas
- [ ] Tabla `usuarios` en DB
- [ ] Dashboard de perfil con tabs
- [ ] Asociar pedidos y tasaciones a usuarios

---

<a name="fase-2"></a>
## FASE 2: DESPLIEGUE Y TESTING (Mes 2-3)

### Objetivos
- Deployar aplicación en producción
- Configurar CI/CD
- Realizar testing exhaustivo
- Optimizar performance

### 2.1 Preparación para Producción

#### Checklist de Pre-Deploy
- [ ] Variables de entorno configuradas (.env.production)
- [ ] Secrets configurados en Vercel/hosting
- [ ] Base de datos de producción creada
- [ ] Migraciones de DB ejecutadas
- [ ] Cloudinary/S3 configurado para imágenes
- [ ] Dominios DNS configurados
- [ ] SSL/HTTPS verificado
- [ ] CORS configurado correctamente

#### Configuración de Vercel (Frontend)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Configurar variables de entorno en dashboard:
NEXT_PUBLIC_API_URL=https://api.tutienda.com
NEXT_PUBLIC_ALGOLIA_APP_ID=xxx
NEXT_PUBLIC_ALGOLIA_API_KEY=xxx
DATABASE_URL=postgresql://...
JWT_SECRET=xxx
EMAIL_API_KEY=xxx
```

#### Configuración Backend (Render/Railway)
```yaml
# render.yaml ejemplo
services:
  - type: web
    name: api-recommerce
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres-recommerce
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production

databases:
  - name: postgres-recommerce
    plan: starter
```

### 2.2 Testing

#### Testing Frontend
```bash
# Tests unitarios (Vitest)
- Componentes: ProductCard, GradeSelector, CartItem
- Utils: formatPrice, calculateDiscount
- Hooks: useCart, useAuth

# Tests de integración (Playwright)
- Flujo completo de tasación
- Flujo completo de compra
- Login y registro
- Añadir al carrito y checkout

# Comandos
npm run test              # Unitarios
npm run test:e2e          # E2E con Playwright
npm run test:coverage     # Coverage report
```

#### Testing Backend
```bash
# Tests API (Jest + Supertest)
- POST /api/tasacion (validaciones)
- GET /api/productos (filtros)
- POST /api/checkout (validación stock)
- POST /api/auth/register

# Comandos
npm run test:api
```

#### Checklist de Testing Manual
**Flujo Vender:**
- [ ] Búsqueda de modelo funciona
- [ ] Calculadora de precio actualiza en tiempo real
- [ ] Email de confirmación se envía
- [ ] PDF de etiqueta se genera correctamente
- [ ] Datos se guardan en DB

**Flujo Comprar:**
- [ ] Filtros funcionan correctamente
- [ ] Búsqueda Algolia responde rápido
- [ ] Página de producto muestra info correcta
- [ ] Cambio de grado actualiza precio y stock
- [ ] Añadir al carrito funciona
- [ ] Checkout guarda pedido en DB

**Performance:**
- [ ] Lighthouse score >90 en todas las páginas
- [ ] Imágenes optimizadas (WebP, lazy loading)
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] No hay errores en consola

**Responsive:**
- [ ] Mobile (375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1920px)

**SEO:**
- [ ] Meta tags en todas las páginas
- [ ] Sitemap.xml generado
- [ ] Robots.txt configurado
- [ ] Structured data (JSON-LD)
- [ ] Open Graph tags

### 2.3 Monitoreo y Analytics

#### Configurar Google Analytics 4
```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

#### Eventos Críticos a Trackear
```typescript
// Tasación iniciada
gtag('event', 'tasacion_iniciada', {
  modelo: 'iPhone 14 Pro',
  categoria: 'Smartphone'
})

// Tasación completada
gtag('event', 'tasacion_completada', {
  modelo: 'iPhone 14 Pro',
  precio_ofrecido: 549,
  grado_estimado: 'A'
})

// Producto visto
gtag('event', 'view_item', {
  items: [{
    item_id: 'iphone-14-pro-128',
    item_name: 'iPhone 14 Pro 128GB',
    price: 549,
    item_category: 'Smartphone'
  }]
})

// Añadido al carrito
gtag('event', 'add_to_cart', {...})

// Compra completada
gtag('event', 'purchase', {
  transaction_id: 'WB-001',
  value: 587,
  currency: 'EUR',
  items: [...]
})
```

#### Configurar Sentry (Monitoreo de Errores)
```bash
npm install @sentry/nextjs

# Ejecutar wizard
npx @sentry/wizard@latest -i nextjs
```

#### Configurar Uptime Monitoring
- [ ] UptimeRobot o similar
- [ ] Alertas por email/Slack
- [ ] Endpoints críticos:
  - https://tutienda.com (home)
  - https://tutienda.com/api/health (health check)
  - https://api.tutienda.com/health

---

<a name="fase-3"></a>
## FASE 3: GESTIÓN DE CONTENIDO E IMÁGENES (Mes 3-4)

### Objetivos
- Poblar catálogo con productos reales
- Configurar sistema de imágenes optimizado
- Crear contenido para blog
- Definir workflows de actualización

### 3.1 Configuración de Cloudinary

#### Setup Inicial
```bash
npm install cloudinary next-cloudinary

# .env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

#### Estructura de Carpetas en Cloudinary
```
/recommerce
  /productos
    /smartphones
      /iphone-14-pro
        - grado-a-01.jpg
        - grado-a-02.jpg
        - grado-b-01.jpg (con imperfecciones)
    /tablets
    /laptops
  /certificados
    - laboratorio-01.jpg
    - laboratorio-02.jpg
  /blog
    - articulo-01-hero.jpg
  /grados
    - ejemplo-grado-a.jpg
    - ejemplo-grado-b.jpg
```

#### Componente de Imagen Optimizada
```tsx
// components/CloudinaryImage.tsx
import { CldImage } from 'next-cloudinary'

export function ProductImage({
  publicId,
  alt,
  grado
}: ProductImageProps) {
  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={800}
      height={800}
      crop="fill"
      gravity="center"
      format="auto"
      quality="auto:best"
      loading="lazy"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}
```

#### Proceso de Subida de Imágenes
```typescript
// Opción 1: Upload manual desde Strapi
// Opción 2: Upload programático

import { v2 as cloudinary } from 'cloudinary'

async function uploadProductImages(productId: string, files: File[]) {
  const uploads = files.map(file => {
    return cloudinary.uploader.upload(file.path, {
      folder: `recommerce/productos/${productId}`,
      transformation: [
        { width: 1200, height: 1200, crop: 'fill' },
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    })
  })

  return Promise.all(uploads)
}
```

### 3.2 Población del Catálogo

#### Estructura de Datos de Producto
```typescript
interface Producto {
  id: string
  nombre: string
  marca: 'Apple' | 'Samsung' | 'Google' | ...
  modelo: string
  categoria: 'Smartphone' | 'Tablet' | 'Laptop' | ...
  especificaciones: {
    pantalla: string
    procesador: string
    ram: string
    almacenamiento: string
    camara: string
    bateria: string
    sistemaOperativo: string
  }
  variantes: Array<{
    grado: 'A+' | 'A' | 'B' | 'C'
    precio: number
    stock: number
    imagenes: string[]  // Cloudinary IDs
    estadoDetallado: {
      pantalla: string
      marco: string
      bateriaSalud: number
      accesoriosIncluidos: string[]
    }
    certificado: {
      fecha: Date
      tecnicoId: string
      puntosControl: Record<string, boolean>
    }
  }>
  seo: {
    metaTitle: string
    metaDescription: string
    slug: string
  }
}
```

#### Plantilla de Entrada de Producto
```csv
# productos_plantilla.csv
marca,modelo,almacenamiento,color,categoria,grado,precio,stock,imagenes,pantalla,bateria
Apple,iPhone 14 Pro,128GB,Negro,Smartphone,A,549,5,"img1.jpg;img2.jpg",Perfecta,87%
Apple,iPhone 14 Pro,128GB,Negro,Smartphone,B,469,8,"img3.jpg;img4.jpg",Arañazos leves,82%
```

#### Script de Importación Masiva
```typescript
// scripts/importar-productos.ts
import Papa from 'papaparse'
import { prisma } from '@/lib/db'

async function importarDesdeCSV(filePath: string) {
  const file = fs.readFileSync(filePath, 'utf8')

  Papa.parse(file, {
    header: true,
    complete: async (results) => {
      for (const row of results.data) {
        await prisma.producto.create({
          data: {
            marca: row.marca,
            modelo: row.modelo,
            categoria: row.categoria,
            variantes: {
              create: {
                grado: row.grado,
                precio: parseFloat(row.precio),
                stock: parseInt(row.stock),
                // ...más campos
              }
            }
          }
        })
      }
      console.log('Importación completada')
    }
  })
}
```

#### Checklist de Población Inicial
**Mínimo para lanzamiento:**
- [ ] 50 productos diferentes (modelos únicos)
- [ ] Mínimo 3 variantes de grado por producto popular
- [ ] 6-8 imágenes por variante (más para grado B/C)
- [ ] Especificaciones técnicas completas
- [ ] Certificados generados para todos
- [ ] Stock actualizado

**Categorización recomendada:**
- [ ] 30 Smartphones (iPhone, Samsung, Google)
- [ ] 10 Tablets (iPad, Galaxy Tab)
- [ ] 5 Laptops (MacBook, ThinkPad)
- [ ] 5 Smartwatches (Apple Watch, Galaxy Watch)

### 3.3 Sistema de Gestión de Contenido (CMS)

#### Configurar Strapi para Contenido
```bash
# Si usas Strapi
npx create-strapi-app@latest cms-recommerce

# Tipos de contenido a crear:
- Producto (ya hecho en 3.2)
- Artículo de Blog
- Página Estática
- FAQ
- Testimonio
```

#### Modelo de Artículo de Blog
```typescript
interface ArticuloBlog {
  titulo: string
  slug: string
  autor: {
    nombre: string
    foto: string
  }
  fechaPublicacion: Date
  categoria: 'Guía' | 'Comparativa' | 'Noticias' | 'Tips'
  imagenDestacada: string
  resumen: string
  contenido: string  // Rich text / Markdown
  seo: {
    metaTitle: string
    metaDescription: string
  }
  relacionados: Producto[]
}
```

#### Artículos Iniciales Recomendados (SEO)
**10 artículos para lanzamiento:**

1. **"Guía completa: Qué significan los grados en móviles reacondicionados"**
   - Keywords: grado A, grado B, móvil reacondicionado
   - 1500 palabras

2. **"iPhone 14 vs iPhone 15: ¿Cuál comprar reacondicionado en 2024?"**
   - Keywords: comparativa iPhone, qué iPhone comprar
   - 2000 palabras

3. **"Cómo vender tu móvil usado: Guía paso a paso"**
   - Keywords: vender iPhone, vender móvil usado
   - 1200 palabras

4. **"¿Es seguro comprar un móvil reacondicionado? Todo lo que debes saber"**
   - Keywords: móvil reacondicionado seguro, garantía
   - 1500 palabras

5. **"7 tips para mantener tu iPhone reacondicionado como nuevo"**
   - Keywords: mantenimiento iPhone, cuidados móvil
   - 1000 palabras

6. **"Reacondicionado vs Segunda mano vs Nuevo: Análisis completo"**
   - Keywords: diferencia reacondicionado segunda mano
   - 1800 palabras

7. **"¿Qué hacer con tu móvil antiguo? Opciones y precios"**
   - Keywords: qué hacer móvil viejo, reciclar móvil
   - 1000 palabras

8. **"Samsung Galaxy S23 reacondicionado: Review y mejores ofertas"**
   - Keywords: Galaxy S23 reacondicionado
   - 1500 palabras

9. **"Certificación de móviles reacondicionados: Nuestro proceso de 30 puntos"**
   - Keywords: certificado móvil, proceso reacondicionado
   - 1200 palabras

10. **"Impacto ambiental: Cuánto CO2 ahorras comprando reacondicionado"**
    - Keywords: sostenibilidad móviles, economía circular
    - 1000 palabras

#### Workflow de Publicación de Blog
```
1. Redacción (Notion/Google Docs)
2. Revisión SEO (Yoast/Surfer SEO)
3. Crear en Strapi
4. Subir imágenes a Cloudinary
5. Programar publicación
6. Compartir en redes sociales
```

### 3.4 Imágenes de Certificación y Confianza

#### Fotografías del Laboratorio
```
NECESITAS:
- 10-15 fotos profesionales del proceso:
  1. Recepción de dispositivos
  2. Técnico revisando pantalla con lupa
  3. Equipo de diagnóstico conectado
  4. Limpieza y desinfección
  5. Embalaje final
  6. Equipo técnico (foto grupal)

- Videos cortos (15-30 seg):
  1. Timelapse del proceso completo
  2. Explicación de un técnico
```

#### Ejemplos de Grados (CRÍTICO)
```
POR CADA GRADO (A+, A, B, C):
- 5 fotos de ejemplo de diferentes dispositivos
- Close-ups de detalles (marco, pantalla, parte trasera)
- Infografía comparativa de los 4 grados

Ubicación en web:
- Página /grados
- Modal en selector de grado
- Flujo de tasación (vendedor)
```

### 3.5 Checklist Fase 3 Completa
- [ ] Cloudinary configurado y optimizado
- [ ] 50+ productos con imágenes subidos
- [ ] Sistema de variantes por grado funcionando
- [ ] Stock actualizado en tiempo real
- [ ] 10 artículos de blog publicados
- [ ] Imágenes del laboratorio y equipo
- [ ] Ejemplos visuales de grados A+, A, B, C
- [ ] Página /grados completa
- [ ] Página /certificacion completa
- [ ] Página /blog funcionando con listado y artículo individual
- [ ] SEO optimizado en todos los artículos
- [ ] Sitemap actualizado automáticamente

---

<a name="fase-4"></a>
## FASE 4: INTEGRACIÓN DE PAGOS (Mes 4-5)

### Objetivos
- Implementar pasarela de pagos segura
- Configurar múltiples métodos de pago
- Implementar sistema de reembolsos
- Gestión de transacciones

### 4.1 Elección de Pasarela de Pagos

#### Opciones Recomendadas

**Opción 1: Stripe (Recomendada)**
```
PROS:
✓ Experiencia de desarrollo superior
✓ Documentación excelente
✓ Soporte para múltiples métodos de pago
✓ Stripe Checkout (UI pre-construida)
✓ Webhooks robustos
✓ Financiación con Klarna integrada
✓ Dashboard completo

CONTRAS:
✗ Comisión 1.5% + 0.25€ por transacción
✗ Retención de fondos 7 días (verificación inicial)

MÉTODOS SOPORTADOS:
- Tarjeta crédito/débito
- Apple Pay / Google Pay
- SEPA Direct Debit
- Klarna (financiación)
- Link (checkout express)
```

**Opción 2: PayPal + Braintree**
```
PROS:
✓ Confianza de marca PayPal
✓ Amplia adopción en usuarios
✓ Braintree para tarjetas

CONTRAS:
✗ UX más fragmentada
✗ Comisiones variables
✗ Documentación menos clara
```

**Opción 3: Redsys (España)**
```
PROS:
✓ Integración directa con bancos españoles
✓ Sin intermediarios

CONTRAS:
✗ Experiencia de desarrollo pobre
✗ Documentación antigua
✗ Limitado a España
```

**RECOMENDACIÓN: Stripe como principal + PayPal como secundario**

### 4.2 Implementación con Stripe

#### Instalación y Configuración
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

# .env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Flujo de Pago Recomendado: Stripe Checkout

**Ventajas de Stripe Checkout:**
- UI pre-construida y optimizada
- Múltiples métodos de pago automáticos
- Cumplimiento PCI DSS automático
- Soporte multi-idioma
- Conversión optimizada

**Implementación:**

```typescript
// app/api/checkout/create-session/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const { items, email, pedidoId } = await request.json()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'klarna'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.nombre,
            images: [item.imagen],
            description: `${item.marca} ${item.modelo} - Grado ${item.grado}`,
          },
          unit_amount: item.precio * 100, // Stripe usa centavos
        },
        quantity: item.cantidad,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/carrito`,
      customer_email: email,
      metadata: {
        pedidoId: pedidoId,
      },
      shipping_address_collection: {
        allowed_countries: ['ES', 'FR', 'DE', 'IT', 'PT'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'Envío estándar gratuito',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 999, currency: 'eur' },
            display_name: 'Envío express',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

```typescript
// components/CheckoutButton.tsx
'use client'

import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '@/store/cart'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutButton() {
  const { items, total } = useCart()

  const handleCheckout = async () => {
    // 1. Crear pedido en DB
    const pedido = await fetch('/api/pedidos/crear', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }).then(r => r.json())

    // 2. Crear sesión de Stripe
    const { sessionId } = await fetch('/api/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify({
        items,
        email: user.email,
        pedidoId: pedido.id
      }),
    }).then(r => r.json())

    // 3. Redirigir a Stripe Checkout
    const stripe = await stripePromise
    await stripe.redirectToCheckout({ sessionId })
  }

  return (
    <button onClick={handleCheckout} className="btn-primary">
      Proceder al pago ({total}€)
    </button>
  )
}
```

### 4.3 Webhooks de Stripe

**¿Por qué son críticos?**
- Confirmar pagos de forma segura (no confiar en cliente)
- Actualizar estado de pedido
- Enviar emails de confirmación
- Gestionar reembolsos

#### Configuración de Webhooks
```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed', err)
    return new Response('Webhook error', { status: 400 })
  }

  // Manejar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session

      // Actualizar pedido en DB
      await prisma.pedido.update({
        where: { id: session.metadata.pedidoId },
        data: {
          estado: 'PAGADO',
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
        }
      })

      // Reducir stock
      // Enviar email de confirmación
      // ...
      break

    case 'payment_intent.payment_failed':
      // Manejar pago fallido
      break

    case 'charge.refunded':
      // Manejar reembolso
      break
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}

// IMPORTANTE: Desactivar bodyParser para webhooks
export const runtime = 'edge'
```

#### Configurar Webhook en Dashboard de Stripe
```
1. Ir a Developers > Webhooks
2. Add endpoint
3. URL: https://tutienda.com/api/webhooks/stripe
4. Eventos a escuchar:
   - checkout.session.completed
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - charge.refunded
5. Copiar signing secret a .env (STRIPE_WEBHOOK_SECRET)
```

### 4.4 Integración de PayPal

#### Instalación
```bash
npm install @paypal/react-paypal-js

# .env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
```

#### Implementación
```typescript
// components/PayPalButton.tsx
'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

export function PayPalButton({ amount, pedidoId }: Props) {
  return (
    <PayPalScriptProvider options={{
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
      currency: 'EUR'
    }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: amount.toString() },
              custom_id: pedidoId,
            }],
          })
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture()

          // Actualizar pedido en backend
          await fetch('/api/pedidos/confirmar-paypal', {
            method: 'POST',
            body: JSON.stringify({
              pedidoId,
              paypalOrderId: order.id
            })
          })

          // Redirigir a confirmación
          window.location.href = `/checkout/success?pedido=${pedidoId}`
        }}
        onError={(err) => {
          console.error('PayPal error:', err)
        }}
      />
    </PayPalScriptProvider>
  )
}
```

### 4.5 Página de Checkout Actualizada

```tsx
// app/checkout/page.tsx
'use client'

export default function CheckoutPage() {
  const [metodoPago, setMetodoPago] = useState<'stripe' | 'paypal' | 'transferencia'>('stripe')

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Columna izquierda: Formulario */}
      <div>
        <h2>Datos de envío</h2>
        <CheckoutForm />

        <h2>Método de pago</h2>
        <div className="payment-methods">
          <button
            onClick={() => setMetodoPago('stripe')}
            className={metodoPago === 'stripe' ? 'active' : ''}
          >
            💳 Tarjeta / Apple Pay / Klarna
          </button>

          <button
            onClick={() => setMetodoPago('paypal')}
            className={metodoPago === 'paypal' ? 'active' : ''}
          >
            PayPal
          </button>

          <button
            onClick={() => setMetodoPago('transferencia')}
            className={metodoPago === 'transferencia' ? 'active' : ''}
          >
            Transferencia bancaria
          </button>
        </div>

        {metodoPago === 'stripe' && <CheckoutButton />}
        {metodoPago === 'paypal' && <PayPalButton amount={total} pedidoId={pedidoId} />}
        {metodoPago === 'transferencia' && <TransferenciaInstrucciones />}
      </div>

      {/* Columna derecha: Resumen */}
      <div>
        <OrderSummary />
      </div>
    </div>
  )
}
```

### 4.6 Gestión de Reembolsos

#### API para Reembolsos
```typescript
// app/api/admin/reembolsos/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const { pedidoId, motivo } = await request.json()

  // Obtener pedido
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId }
  })

  // Crear reembolso en Stripe
  const refund = await stripe.refunds.create({
    payment_intent: pedido.stripePaymentIntentId,
    reason: 'requested_by_customer',
    metadata: {
      pedidoId,
      motivo
    }
  })

  // Actualizar pedido
  await prisma.pedido.update({
    where: { id: pedidoId },
    data: {
      estado: 'REEMBOLSADO',
      fechaReembolso: new Date()
    }
  })

  // Restaurar stock
  // Enviar email al cliente

  return Response.json({ success: true, refund })
}
```

### 4.7 Testing de Pagos

#### Tarjetas de Prueba de Stripe
```
ÉXITO:
4242 4242 4242 4242

REQUIERE AUTENTICACIÓN 3D SECURE:
4000 0025 0000 3155

PAGO RECHAZADO:
4000 0000 0000 9995

TARJETA EXPIRADA:
4000 0000 0000 0069
```

#### Checklist de Testing de Pagos
- [ ] Pago con tarjeta exitoso (Stripe)
- [ ] Pago con tarjeta rechazado
- [ ] Pago con autenticación 3D Secure
- [ ] Pago con PayPal exitoso
- [ ] Cupones de descuento aplicados correctamente
- [ ] Stock se reduce tras pago exitoso
- [ ] Email de confirmación se envía
- [ ] Webhook de Stripe funciona (logs)
- [ ] Reembolso completo
- [ ] Reembolso parcial
- [ ] Estado de pedido se actualiza en DB

### 4.8 Seguridad y Cumplimiento

#### Checklist de Seguridad PCI DSS
- [ ] Nunca guardar números de tarjeta en tu DB
- [ ] Usar Stripe Elements o Checkout (PCI compliant)
- [ ] HTTPS en todo el sitio
- [ ] Validar webhooks con firma
- [ ] Encriptar datos sensibles en DB
- [ ] Logs de transacciones (auditoría)

#### Cumplimiento Legal (Europa/España)
- [ ] Política de privacidad actualizada (mencionar Stripe/PayPal)
- [ ] Aviso legal con datos fiscales
- [ ] Política de reembolsos clara (14 días UE)
- [ ] Términos y condiciones de venta
- [ ] Gestión de consentimientos (GDPR)

### 4.9 Checklist Fase 4 Completa
- [ ] Stripe integrado con Checkout
- [ ] PayPal integrado como alternativa
- [ ] Webhooks configurados y testeados
- [ ] Emails transaccionales (confirmación, envío, reembolso)
- [ ] Sistema de cupones funcional
- [ ] Reembolsos implementados
- [ ] Testing exhaustivo con tarjetas de prueba
- [ ] Ambiente de producción configurado (claves reales)
- [ ] Políticas legales actualizadas
- [ ] Panel admin para gestionar pedidos y reembolsos

---

<a name="fase-5"></a>
## FASE 5: EXPANSIÓN Y FIDELIZACIÓN (Mes 6-12)

### Objetivos
- Implementar gamificación
- Programa de referidos
- Métricas de sostenibilidad
- App móvil
- Trade-in program

### 5.1 Sistema de Gamificación

#### Estructura de Puntos y Niveles

```typescript
interface SistemaFidelizacion {
  niveles: {
    BRONCE: { min: 0, max: 499, beneficios: string[] }
    PLATA: { min: 500, max: 1499, beneficios: string[] }
    ORO: { min: 1500, max: 3999, beneficios: string[] }
    PLATINO: { min: 4000, max: Infinity, beneficios: string[] }
  }

  formasGanarPuntos: {
    COMPRA: 'por_cada_euro'  // 1 punto por euro
    VENTA: 'por_dispositivo'  // 50 puntos
    RESEÑA: 'por_reseña'      // 25 puntos
    REFERIDO: 'por_referido'  // 100 puntos
    CUMPLEAÑOS: 'anual'       // 50 puntos
  }

  beneficiosPorNivel: {
    BRONCE: ['Descuento 5% en accesorios']
    PLATA: ['Descuento 10% accesorios', 'Envío express gratis']
    ORO: ['Descuento 15% accesorios', 'Prioridad soporte', 'Acceso preventas']
    PLATINO: ['Descuento 20%', 'Regalos exclusivos', 'Eventos VIP']
  }
}
```

#### Implementación en Base de Datos
```sql
-- Tabla de puntos
CREATE TABLE puntos_usuario (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  puntos_totales INTEGER DEFAULT 0,
  puntos_disponibles INTEGER DEFAULT 0,
  nivel VARCHAR(20) DEFAULT 'BRONCE',
  fecha_actualizacion TIMESTAMP
);

-- Tabla de transacciones de puntos
CREATE TABLE puntos_transacciones (
  id UUID PRIMARY KEY,
  usuario_id UUID,
  tipo VARCHAR(50), -- COMPRA, VENTA, CANJE, REFERIDO
  puntos INTEGER,
  descripcion TEXT,
  fecha TIMESTAMP
);

-- Tabla de insignias
CREATE TABLE insignias (
  id UUID PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  icono VARCHAR(255),
  condicion JSONB
);

CREATE TABLE usuario_insignias (
  usuario_id UUID,
  insignia_id UUID,
  fecha_obtencion TIMESTAMP,
  PRIMARY KEY (usuario_id, insignia_id)
);
```

#### Panel de Usuario con Gamificación
```tsx
// app/perfil/puntos/page.tsx
export default function PuntosPage() {
  const usuario = useUsuario()

  return (
    <div>
      {/* Header con nivel actual */}
      <div className="nivel-actual">
        <h1>Nivel {usuario.nivel}</h1>
        <ProgressBar
          current={usuario.puntosEnNivel}
          max={nivelSiguiente.puntosMinimos}
        />
        <p>{puntosRestantes} puntos para nivel {nivelSiguiente.nombre}</p>
      </div>

      {/* Beneficios actuales */}
      <div className="beneficios">
        <h2>Tus beneficios</h2>
        {beneficiosActuales.map(b => (
          <Badge key={b}>{b}</Badge>
        ))}
      </div>

      {/* Formas de ganar puntos */}
      <div className="ganar-puntos">
        <h2>Gana más puntos</h2>
        <ul>
          <li>✓ Compra productos (+1 punto por €)</li>
          <li>✓ Vende tu dispositivo (+50 puntos)</li>
          <li>✓ Deja una reseña (+25 puntos)</li>
          <li>✓ Invita a un amigo (+100 puntos)</li>
        </ul>
      </div>

      {/* Insignias */}
      <div className="insignias">
        <h2>Insignias ({insigniasObtenidas.length}/{insigniasTotales})</h2>
        <div className="grid">
          {insignias.map(i => (
            <InsigniaCard
              key={i.id}
              insignia={i}
              obtenida={usuario.insignias.includes(i.id)}
            />
          ))}
        </div>
      </div>

      {/* Historial de puntos */}
      <div className="historial">
        <h2>Historial</h2>
        <table>
          <tbody>
            {transacciones.map(t => (
              <tr key={t.id}>
                <td>{t.fecha}</td>
                <td>{t.descripcion}</td>
                <td className={t.puntos > 0 ? 'positivo' : 'negativo'}>
                  {t.puntos > 0 ? '+' : ''}{t.puntos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

#### Sistema de Insignias
```typescript
// Definición de insignias
const INSIGNIAS = [
  {
    id: 'primer-compra',
    nombre: 'Primera compra',
    descripcion: 'Has realizado tu primera compra',
    icono: '🛒',
    condicion: { tipo: 'compras', valor: 1 }
  },
  {
    id: 'comprador-frecuente',
    nombre: 'Comprador frecuente',
    descripcion: '5 compras realizadas',
    icono: '⭐',
    condicion: { tipo: 'compras', valor: 5 }
  },
  {
    id: 'vendedor-activo',
    nombre: 'Vendedor activo',
    descripcion: '3 dispositivos vendidos',
    icono: '💰',
    condicion: { tipo: 'ventas', valor: 3 }
  },
  {
    id: 'eco-warrior',
    nombre: 'Eco Warrior',
    descripcion: 'Has ahorrado 100kg de CO2',
    icono: '🌱',
    condicion: { tipo: 'co2_ahorrado', valor: 100 }
  },
  {
    id: 'influencer',
    nombre: 'Influencer',
    descripcion: '10 amigos referidos',
    icono: '📣',
    condicion: { tipo: 'referidos', valor: 10 }
  }
]
```

### 5.2 Programa de Referidos

#### Mecánica
```
Usuario refiere a amigo:
- Amigo obtiene 20€ de descuento en primera compra >100€
- Usuario obtiene 20€ de crédito tras compra del amigo
- Ambos obtienen 100 puntos extra
```

#### Implementación
```typescript
// Tabla de referidos
CREATE TABLE referidos (
  id UUID PRIMARY KEY,
  usuario_referidor_id UUID,
  email_referido VARCHAR(255),
  codigo_referido VARCHAR(20) UNIQUE,
  estado VARCHAR(20), -- PENDIENTE, REGISTRADO, COMPRADO
  descuento_usado BOOLEAN DEFAULT false,
  credito_otorgado BOOLEAN DEFAULT false,
  fecha_creacion TIMESTAMP,
  fecha_conversion TIMESTAMP
);
```

```tsx
// app/perfil/referidos/page.tsx
export default function ReferidosPage() {
  const usuario = useUsuario()
  const codigoReferido = usuario.codigoReferido // ej: JUAN2024
  const urlReferido = `https://tutienda.com/registro?ref=${codigoReferido}`

  return (
    <div>
      <h1>Invita y gana</h1>
      <p>Comparte tu código y ambos ganáis 20€</p>

      <div className="codigo-referido">
        <input value={urlReferido} readOnly />
        <button onClick={() => copiarAlPortapapeles(urlReferido)}>
          Copiar enlace
        </button>
      </div>

      <div className="compartir">
        <button onClick={() => compartirEnWhatsApp(urlReferido)}>
          WhatsApp
        </button>
        <button onClick={() => compartirEnEmail(urlReferido)}>
          Email
        </button>
        <button onClick={() => compartirEnTwitter(urlReferido)}>
          Twitter
        </button>
      </div>

      <div className="estadisticas">
        <StatCard
          titulo="Invitaciones enviadas"
          valor={referidos.length}
        />
        <StatCard
          titulo="Amigos registrados"
          valor={referidos.filter(r => r.estado === 'REGISTRADO').length}
        />
        <StatCard
          titulo="Crédito ganado"
          valor={`${creditoTotal}€`}
        />
      </div>

      <table className="historial-referidos">
        <thead>
          <tr>
            <th>Email</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {referidos.map(r => (
            <tr key={r.id}>
              <td>{r.email}</td>
              <td><Badge>{r.estado}</Badge></td>
              <td>{formatDate(r.fechaCreacion)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 5.3 Métricas de Sostenibilidad

#### Cálculo de CO2 Ahorrado
```typescript
// Datos base (ejemplo)
const CO2_POR_DISPOSITIVO = {
  SMARTPHONE: 70, // kg CO2 ahorrados vs producir uno nuevo
  TABLET: 90,
  LAPTOP: 200,
  SMARTWATCH: 30
}

function calcularCO2Usuario(compras: Compra[]) {
  return compras.reduce((total, compra) => {
    return total + (CO2_POR_DISPOSITIVO[compra.categoria] || 0)
  }, 0)
}
```

#### Panel de Impacto Ambiental
```tsx
// app/perfil/sostenibilidad/page.tsx
export default function SostenibilidadPage() {
  const usuario = useUsuario()
  const co2Ahorrado = calcularCO2Usuario(usuario.compras)

  return (
    <div>
      <h1>Tu impacto ambiental</h1>

      <div className="metricas-principales">
        <MetricCard
          titulo="CO2 ahorrado"
          valor={`${co2Ahorrado} kg`}
          equivalencia={`Equivale a ${Math.round(co2Ahorrado / 20)} árboles plantados`}
          icono="🌍"
        />

        <MetricCard
          titulo="Dispositivos reusados"
          valor={usuario.compras.length}
          equivalencia="Evitados a la basura electrónica"
          icono="♻️"
        />

        <MetricCard
          titulo="Agua ahorrada"
          valor={`${usuario.compras.length * 13000} L`}
          equivalencia="Necesaria para fabricar un smartphone"
          icono="💧"
        />
      </div>

      <div className="timeline">
        <h2>Tu contribución en el tiempo</h2>
        <LineChart data={co2PorMes} />
      </div>

      <div className="ranking">
        <h2>Ranking de eco-héroes</h2>
        <p>Estás en el puesto #{usuario.rankingCO2} de {totalUsuarios}</p>
        <Leaderboard top10={top10EcoHeroes} />
      </div>

      <div className="compartir">
        <h2>Comparte tu impacto</h2>
        <button onClick={() => generarImagenParaCompartir()}>
          Generar imagen para redes sociales
        </button>
      </div>
    </div>
  )
}
```

### 5.4 Trade-In Program

#### Flujo Integrado en Checkout
```tsx
// En página de producto
<div className="trade-in-widget">
  <h3>¿Tienes un dispositivo antiguo?</h3>
  <p>Véndelo y obtén un descuento instantáneo</p>

  <button onClick={() => abrirModalTradeIn()}>
    Valorar mi dispositivo
  </button>
</div>

// Modal de trade-in
<Modal>
  <h2>Valora tu dispositivo actual</h2>

  <BuscadorModelo onSelect={setModelo} />

  <FormularioEstado
    modelo={modelo}
    onComplete={setValoracion}
  />

  <div className="resumen-trade-in">
    <p>Valor de tu {modelo}: <strong>{valoracion}€</strong></p>
    <p>Precio del nuevo dispositivo: <strong>{precioNuevo}€</strong></p>
    <hr />
    <p>Total a pagar: <strong>{precioNuevo - valoracion}€</strong></p>
  </div>

  <button onClick={() => aplicarTradeIn()}>
    Aplicar descuento
  </button>
</Modal>
```

### 5.5 App Móvil (Opcional - Fase avanzada)

#### Opción 1: PWA (Recomendada para empezar)
```typescript
// next.config.js
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // ...configuración Next.js
})
```

```json
// public/manifest.json
{
  "name": "Recommerce Store",
  "short_name": "Recommerce",
  "description": "Tecnología reacondicionada certificada",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Opción 2: React Native (Fase muy avanzada)
```
FUNCIONALIDADES EXTRA EN APP:
- Escaneo de IMEI con cámara para tasación instantánea
- Notificaciones push (alertas de stock, ofertas)
- Escaneo de certificado QR
- Soporte offline
```

### 5.6 Checklist Fase 5 Completa
- [ ] Sistema de puntos implementado
- [ ] Niveles de usuario funcionales
- [ ] Insignias configuradas (mínimo 10)
- [ ] Panel de gamificación en perfil
- [ ] Programa de referidos funcionando
- [ ] Código de referido único por usuario
- [ ] Sistema de cupones para referidos
- [ ] Métricas de sostenibilidad calculadas
- [ ] Panel de impacto ambiental
- [ ] Trade-in integrado en producto/checkout
- [ ] PWA configurada (si aplica)
- [ ] Notificaciones push (si app móvil)

---

<a name="fase-6"></a>
## FASE 6: ESCALAMIENTO (Mes 13+)

### Objetivos
- Marketplace multivendedor
- Internacionalización
- Funcionalidades avanzadas
- B2B

### 6.1 Marketplace para Vendedores Certificados

#### Modelo de Negocio
```
TIPOS DE VENDEDORES:
1. Interno (tu equipo) - Comisión 0%
2. Partner Certificado - Comisión 15%
3. Profesional - Comisión 20%

REQUISITOS PARA SER VENDEDOR:
- Registro de empresa
- Certificación de calidad (checklist)
- Depósito de garantía
- Mínimo 50 productos
- Rating >4.5 estrellas
```

#### Estructura de Datos
```typescript
interface Vendedor {
  id: string
  tipo: 'INTERNO' | 'PARTNER' | 'PROFESIONAL'
  nombreEmpresa: string
  cif: string
  contacto: ContactoVendedor
  certificaciones: string[]
  comision: number
  estado: 'ACTIVO' | 'PENDIENTE' | 'SUSPENDIDO'
  rating: number
  totalVentas: number

  // Configuración de envíos
  politicaEnvios: {
    zonas: string[]
    tiempoPreparacion: number
    transportistas: string[]
  }

  // Verificación
  verificado: boolean
  documentosVerificacion: string[]
}

// Modificar modelo Producto
interface Producto {
  // ...campos existentes
  vendedor: Vendedor
  comisionPlataforma: number
}
```

#### Panel de Vendedor
```tsx
// app/vendedor/dashboard/page.tsx
export default function VendedorDashboard() {
  return (
    <div>
      <h1>Panel de Vendedor</h1>

      <div className="metricas">
        <StatCard titulo="Ventas del mes" valor="12.450€" />
        <StatCard titulo="Pedidos pendientes" valor="8" />
        <StatCard titulo="Rating" valor="4.8 ⭐" />
        <StatCard titulo="Productos activos" valor="124" />
      </div>

      <Tabs>
        <Tab label="Productos">
          <ProductosTable
            productos={productos}
            onEditar={editarProducto}
            onEliminar={eliminarProducto}
          />
          <button onClick={() => navigate('/vendedor/productos/nuevo')}>
            Añadir producto
          </button>
        </Tab>

        <Tab label="Pedidos">
          <PedidosTable
            pedidos={pedidos}
            onActualizar={actualizarEstado}
          />
        </Tab>

        <Tab label="Finanzas">
          <ResumenFinanciero
            ventas={ventas}
            comisiones={comisiones}
            pagos={pagos}
          />
        </Tab>

        <Tab label="Configuración">
          <ConfiguracionVendedor />
        </Tab>
      </Tabs>
    </div>
  )
}
```

### 6.2 Internacionalización

#### Implementación con next-intl
```bash
npm install next-intl
```

```typescript
// i18n.ts
export const locales = ['es', 'en', 'fr', 'de', 'it'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'es'

export const languages = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano'
}
```

```json
// messages/es.json
{
  "home": {
    "hero": {
      "title": "Tecnología Reacondicionada Certificada",
      "subtitle": "12 meses de garantía + Certificado de 30 puntos",
      "cta": {
        "buy": "Comprar dispositivos",
        "sell": "Vender mi dispositivo"
      }
    }
  },
  "product": {
    "grade": "Grado",
    "warranty": "Garantía",
    "addToCart": "Añadir al carrito"
  }
}
```

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'

export default async function LocaleLayout({
  children,
  params: { locale }
}) {
  const messages = await import(`@/messages/${locale}.json`)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

#### Gestión de Divisas
```typescript
// utils/currency.ts
const EXCHANGE_RATES = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  CHF: 0.96
}

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  const amountInEUR = amount / EXCHANGE_RATES[from]
  return amountInEUR * EXCHANGE_RATES[to]
}

export function formatPrice(
  amount: number,
  currency: Currency,
  locale: Locale
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}
```

### 6.3 Funcionalidades Avanzadas

#### Trazabilidad con Blockchain (Conceptual)
```typescript
// Ejemplo con Ethereum (simplificado)
interface CertificadoBlockchain {
  productId: string
  imei: string
  hash: string  // Hash SHA-256 del certificado
  transactionHash: string  // Hash de transacción en blockchain
  blockNumber: number
  timestamp: Date
}

async function registrarCertificadoEnBlockchain(
  producto: Producto
): Promise<string> {
  const certificado = generarCertificadoPDF(producto)
  const hash = SHA256(certificado)

  // Registrar en blockchain (smart contract)
  const tx = await contract.registrarCertificado(
    producto.id,
    producto.imei,
    hash
  )

  await tx.wait()

  return tx.hash
}
```

#### Búsqueda Visual con IA
```typescript
// Subir foto del dispositivo y obtener modelo/precio estimado
async function buscarPorImagen(imagen: File): Promise<Tasacion> {
  const formData = new FormData()
  formData.append('imagen', imagen)

  const response = await fetch('/api/ia/identificar-dispositivo', {
    method: 'POST',
    body: formData
  })

  const resultado = await response.json()
  // {
  //   modelo: 'iPhone 14 Pro',
  //   confianza: 0.95,
  //   estadoEstimado: 'Grado A',
  //   precioEstimado: 549
  // }

  return resultado
}
```

### 6.4 B2B - Ventas a Empresas

#### Portal B2B
```tsx
// app/b2b/page.tsx
export default function B2BPage() {
  return (
    <div>
      <h1>Soluciones para Empresas</h1>

      <div className="beneficios-b2b">
        <h2>Ventajas para empresas</h2>
        <ul>
          <li>Descuentos por volumen (10-30%)</li>
          <li>Gestor de cuenta dedicado</li>
          <li>Facturación personalizada</li>
          <li>Soporte prioritario 24/7</li>
          <li>Gestión de flotas</li>
        </ul>
      </div>

      <form onSubmit={solicitarPresupuesto}>
        <h2>Solicitar presupuesto</h2>
        <input name="empresa" placeholder="Nombre empresa" />
        <input name="cif" placeholder="CIF" />
        <input name="email" placeholder="Email corporativo" />
        <select name="cantidadDispositivos">
          <option>10-50</option>
          <option>50-100</option>
          <option>100-500</option>
          <option>500+</option>
        </select>
        <textarea name="necesidades" placeholder="Cuéntanos tus necesidades" />
        <button type="submit">Enviar solicitud</button>
      </form>
    </div>
  )
}
```

### 6.5 Checklist Fase 6 Completa
- [ ] Marketplace multivendedor funcional
- [ ] Panel de vendedor completo
- [ ] Sistema de comisiones automatizado
- [ ] Soporte multi-idioma (mínimo 3 idiomas)
- [ ] Soporte multi-divisa
- [ ] Geolocalización automática
- [ ] Trazabilidad avanzada (blockchain opcional)
- [ ] Búsqueda visual con IA (opcional)
- [ ] Portal B2B
- [ ] Descuentos por volumen configurables

---

## ANEXOS

### A. Checklist General de Lanzamiento

**PRE-LANZAMIENTO:**
- [ ] Dominio registrado y DNS configurado
- [ ] SSL/HTTPS activo
- [ ] Emails corporativos configurados
- [ ] Redes sociales creadas (Instagram, Twitter, LinkedIn)
- [ ] Políticas legales redactadas y publicadas
- [ ] 50+ productos en catálogo
- [ ] Pasarela de pagos en producción
- [ ] Testing completo realizado
- [ ] Analytics y monitoreo configurados

**MARKETING INICIAL:**
- [ ] Landing page optimizada para conversión
- [ ] 10 artículos de blog publicados
- [ ] Estrategia de SEO implementada
- [ ] Campañas de Google Ads preparadas
- [ ] Campañas de Meta Ads preparadas
- [ ] Email marketing configurado (Mailchimp/Klaviyo)
- [ ] Programa de influencers/afiliados

**POST-LANZAMIENTO:**
- [ ] Monitorear errores diariamente (Sentry)
- [ ] Revisar métricas semanalmente (GA4)
- [ ] Responder reseñas en <24h
- [ ] Actualizar blog quincenalmente
- [ ] Optimizar conversión basado en datos

### B. Stack Tecnológico Final Recomendado

```yaml
FRONTEND:
  Framework: Next.js 14+
  UI: Tailwind CSS + Shadcn/ui
  State: Zustand
  Forms: React Hook Form + Zod
  Auth: NextAuth.js
  Búsqueda: Algolia

BACKEND:
  CMS: Strapi (headless)
  API: Next.js API Routes
  Database: PostgreSQL (Supabase)
  ORM: Prisma

INFRAESTRUCTURA:
  Frontend Hosting: Vercel
  Backend Hosting: Render/Railway
  Database: Supabase
  File Storage: Cloudinary
  CDN: Cloudflare
  Email: Resend.com

PAGOS:
  Principal: Stripe
  Alternativo: PayPal

ANALYTICS:
  Web: Google Analytics 4
  Errores: Sentry
  Uptime: UptimeRobot

MARKETING:
  Email: Klaviyo o Mailchimp
  CRM: HubSpot (gratis para empezar)
```

### C. Estimación de Costes Mensuales (Primer Año)

```
INFRAESTRUCTURA:
- Vercel Pro: 20€/mes
- Render: 25€/mes (backend + DB)
- Cloudinary: 0-50€/mes (según uso)
- Dominio: 12€/año
SUBTOTAL: ~70€/mes

SERVICIOS:
- Stripe: 1.5% + 0.25€ por transacción
- Algolia: 0-100€/mes (según búsquedas)
- Resend/SendGrid: 0-20€/mes
SUBTOTAL: ~50€/mes base + comisiones

MARKETING:
- Google Ads: 300-1000€/mes
- Meta Ads: 200-500€/mes
- Email Marketing: 30€/mes
SUBTOTAL: 530-1530€/mes

TOTAL: 650-1650€/mes (sin contar comisiones de pago)
```

### D. KPIs Clave a Seguir

**NEGOCIO:**
- Tasa de conversión (objetivo: >2%)
- Ticket medio (objetivo: >200€)
- LTV (Lifetime Value por cliente)
- CAC (Coste de adquisición de cliente)
- Retención de clientes (objetivo: >30% recompra)

**OPERACIONALES:**
- Tiempo medio de tasación (objetivo: <3 min)
- Tiempo de verificación de dispositivo (objetivo: <48h)
- Tasa de discrepancia de grado (objetivo: <5%)
- NPS (Net Promoter Score) (objetivo: >50)

**TÉCNICOS:**
- Lighthouse score (objetivo: >90)
- Uptime (objetivo: 99.9%)
- Tiempo de carga (objetivo: <2s)
- Tasa de errores (objetivo: <0.1%)

---

## RESUMEN EJECUTIVO

Esta guía proporciona un roadmap completo para implementar una plataforma de recommerce tecnológico en 6 fases:

**FASE 0-1 (Meses 0-2):** MVP funcional con flujos de compra/venta
**FASE 2 (Mes 3):** Despliegue y testing exhaustivo
**FASE 3 (Mes 4):** Población de contenido e imágenes
**FASE 4 (Mes 5):** Integración de pagos completa
**FASE 5 (Meses 6-12):** Gamificación, referidos, sostenibilidad
**FASE 6 (Mes 13+):** Marketplace, internacionalización, B2B

Cada fase incluye:
- Objetivos claros
- Checklists técnicos
- Ejemplos de código
- Mejores prácticas

El enfoque prioriza la construcción de **confianza** mediante certificación, garantías y transparencia, diferenciándose de competidores C2C y posicionándose como líder en recommerce premium.
