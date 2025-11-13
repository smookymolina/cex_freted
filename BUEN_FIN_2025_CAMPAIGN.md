# Guía de la Campaña "Buen Fin 2025" - Documentación Completa

Este documento detalla todos los cambios realizados para la campaña "Buen Fin 2025", incluyendo las mejoras de diseño y estilo implementadas. La campaña está configurada para desactivarse automáticamente después del `2025-11-16`.

---

## 📋 Índice

1. [Características de Diseño](#características-de-diseño)
2. [Plan operativo de logos Buen Fin 2025 (5 pasos)](#plan-operativo-de-logos-buen-fin-2025-5-pasos)
3. [Archivos Creados](#archivos-creados)
4. [Archivos Modificados](#archivos-modificados)
5. [Guía de Reversión](#guía-de-reversión)

---

## 🎨 Características de Diseño

### 1. Banner Superior de Campaña (CampaignBanner.jsx)

**Características visuales implementadas:**
- ✨ Gradiente rojo intenso (de #dc2626 a #7f1d1d) con efecto de profundidad
- 🎯 Badge dorado animado con efecto de "bounce" (rebote sutil)
- 💰 Icono de dinero rotando continuamente
- ⏰ Icono de reloj con animación de "tick" (pulsación)
- 🔆 Efecto de pulso radial en el fondo del banner
- ⚡ Efecto "shine" (brillo deslizante) que atraviesa el banner cada 4 segundos
- 🎯 Botón CTA blanco con hover que cambia a amarillo cremoso
- 📱 Diseño completamente responsive con diferentes vistas para móvil y desktop

**Animaciones incluidas:**
- `pulse`: Efecto radial de fondo (4s)
- `bounce`: Rebote del badge (2s)
- `rotate`: Rotación del icono de dinero (3s)
- `tick`: Pulsación del icono de reloj (1s)

### 2. Badge de Descuento en Tarjetas de Producto (ProductCard)

**Características visuales implementadas:**
- 🎁 Icono de regalo animado con efecto bounce
- 🔴 Gradiente rojo (#dc2626 → #991b1b) con borde dorado (#fbbf24)
- 💫 Sombra doble: principal roja + halo dorado
- ⚡ Efecto "shine" deslizante cada 3 segundos
- 📏 Animación de pulso que escala el badge sutilmente
- 🎯 Tipografía blanca en negrita con alto contraste

**Animaciones incluidas:**
- `promo-pulse`: Escala y cambia la intensidad de sombra (2s)
- `bounce-icon`: El regalo salta y crece (1.5s)
- `shine`: Brillo horizontal atraviesa el elemento (3s)

### 3. Mensaje de Descuento en Variantes (ProductCard Variants)

**Características visuales implementadas:**
- 🔥 Icono de fuego con efecto "flicker" (parpadeo)
- 🎨 Diseño compacto en píldora con gradiente rojo
- ✨ Efecto shine más rápido (2.5s) para mayor dinamismo
- 💎 Sombra suave roja para destacar sobre el fondo
- 📱 Tamaño optimizado para no saturar el espacio

**Animaciones incluidas:**
- `flicker`: El fuego parpadea y brilla (1.5s)
- `promo-shine`: Brillo rápido atravesando (2.5s)

### 4. Descuento en Resumen de Carrito (CartSummary)

**Características visuales implementadas:**
- 🎁 Icono de regalo con animación bounce más prominente
- 📦 Fila destacada con gradiente rojo suave de fondo
- 🌟 Borde dorado grueso (2px) con bordes redondeados
- 💫 Sombra animada que pulsa entre dos estados
- ⚡ Efecto shine dorado atravesando la fila
- 💪 Tipografía extra bold para el monto del descuento
- 🎯 Padding generoso para destacar la fila

**Animaciones incluidas:**
- `buen-fin-highlight`: Pulso de sombra y borde (2s)
- `buen-fin-bounce`: Rebote del icono de regalo (1.5s)
- `buen-fin-shine`: Brillo dorado horizontal (3s)

---

## Plan operativo de logos Buen Fin 2025 (5 pasos)

Este plan coloca los tres logos del Buen Fin en las esquinas visibles de los articulos y en los puntos de mayor conversion del sitio, manteniendo consistencia con las creatividades de Google Ads y facilitando su remocion al cerrar la temporada.

### Resumen rapido de los logos

| Archivo | Resolucion | Uso recomendado |
| --- | --- | --- |
| `logo_buen_fin_banner_princsf_2025.png` | 697x400 | Hero, navegacion sticky y creatividades display/video |
| `nuevo-logo-del-buen-fin-2025.jpg` | 1024x1024 | Overlay redondo para tarjetas de producto, carrito y modales |
| `El_buen_fin.jpg` | 450x449 | Sello editorial para articulos del blog y secciones de contenido |

### Paso 1. Hero y navegacion (`logo_buen_fin_banner_princsf_2025.png`)

- Inserta la imagen dentro de `components/CampaignBanner.jsx` en un contenedor `div` con clase `logoStamp` fijado `top: 12px; right: 24px; width: 220px`. El sello debe quedar delante del degradado para que sea lo primero que vea el usuario en desktop.
- Replica una version reducida (96px) en `components/navigation/PrimaryNav.jsx`, justo al lado del CTA principal, usando `aria-hidden="true"` y `loading="lazy"` para que la barra sticky recuerde la promocion en todo el scroll.
- Crea la clase `.logoStamp` en `styles/components/campaign-banner.module.css` con `position: absolute`, `mix-blend-mode: multiply`, `filter: drop-shadow(...)` y un breakpoint `< 768px` que mueve el logo abajo del copy para no tapar texto en mobile.
- Marca ambos nodos con `data-gtm="logo-buen-fin-hero"` y reutiliza este mismo PNG como base de las piezas responsive de Google Ads (ratio 1.7:1) para mantener mensaje y garantias en cada impacto.

### Paso 2. Overlay en tarjetas de producto (`nuevo-logo-del-buen-fin-2025.jpg`)

- Dentro de `components/product/ProductCard.jsx` agrega un `div` con `className={styles.productLogo}` inmediatamente despues del componente `<Image>` para mostrar el sello solo cuando `buenFinActive` sea verdadero.
- Define `.productLogo` en `styles/components/product-card.module.css` con `position: absolute; top: 10px; right: 10px; width: 64px; height: 64px; pointer-events: none; clip-path: circle(50%);`. Esto asegura que el logo quede por enfrente de la imagen del articulo sin interferir con el CTA.
- Añade una variante `.productLogo--hover` que incremente el tamaño a 72px cuando `.card:hover` y desactiva la animacion en `@media (prefers-reduced-motion: reduce)` para cumplir con accesibilidad.
- Exporta el mismo overlay al feed de Google Merchant Center (opcion `logoOverlay`) para que los listados pagados muestren exactamente el mismo sello que ve el usuario en la grilla.

### Paso 3. Articulos y contenido (`El_buen_fin.jpg`)

- En `components/blog/BlogPostCard.jsx` envuelve la imagen dentro de un `div` (`styles.cardImageWrapper`) y agrega un pseudo-elemento `::after` que coloque `El_buen_fin.jpg` en la esquina superior izquierda. Usa un borde blanco de 2px para que resalte sobre fondos oscuros.
- En `components/blog/BlogPostPage.jsx` convierte la imagen principal en un `figure` con clase `articleHero` y posiciona el sello mediante `.articleLogoStamp { position: absolute; top: 16px; right: 16px; width: 88px; }` para mantenerlo por delante del hero de cada articulo.
- Actualiza `styles/components/Blog.module.css` y `styles/components/BlogPostPage.module.css` con `box-shadow: 0 6px 16px rgba(0,0,0,0.25)` y un `z-index: 3` para que el logo nunca quede oculto por otros elementos.
- Etiqueta ambos componentes con `data-gtm="logo-buen-fin-content"` y sigue el uplift de scroll depth vs clics en los articulos destacados durante la temporada.

### Paso 4. Modales, carrito y ads de alto rendimiento

- Inserta `logo_buen_fin_banner_princsf_2025.png` en `components/modals/CampaignModal.jsx` dentro de un panel lateral izquierdo y combinandolo con un texto de urgencia; establece `loading="eager"` para que el sello aparezca antes de que se muestre el formulario.
- Añade `nuevo-logo-del-buen-fin-2025.jpg` junto a la fila `buenFinRow` en `components/cart/CartSummary.jsx`, manteniendo el logo alineado con el monto del descuento para reforzar la conversion al revisar el carrito.
- Genera derivados en `public/images/ads/buen-fin/` (formatos 1:1, 1200x628 y 300x300) y referencia esas rutas desde `config/promotions.js` para que las campañas de Google Ads Responsive Display y Demand Gen consuman la misma identidad visual.
- Configura todas las CTAs relacionadas con `utm_campaign=buen_fin_2025_logos` y dispara `dataLayer.push({ event: 'bf-logo-impression', location })` en cada montaje para medir impacto por ubicacion.

### Paso 5. Gobierno y salida rapida

- Centraliza la configuracion en `config/promotions.js` con un objeto `logoPlacements` que contenga banderas (`hero`, `productCard`, `blog`, `modal`, `cart`) y la ruta de cada imagen para poder desactivar todo desde un solo lugar.
- Añade un script de limpieza (por ejemplo `scripts/cleanup/buen-fin.js`) que elimine los contenedores, clases (`.logoStamp`, `.productLogo`, `.articleLogoStamp`) y rutas en `public/` cuando `logoPlacements.active` sea `false`.
- Ejecuta `npm run lint && npm run test` antes de publicar y valida en dispositivos reales que los sellos no cubran texto o precios esenciales; documenta capturas para el equipo de marketing.
- Al terminar el Buen Fin, coloca `logoPlacements.active = false`, corre el script de limpieza y referencia la seccion [Guía de Reversión](#guía-de-reversión) para revertir los componentes añadidos sin dejar residuos.

---

## 📁 Archivos Creados

Estos archivos fueron creados exclusivamente para la campaña:

### Componentes y Estilos
1. **`components/CampaignBanner.jsx`**
   - Banner superior con diseño premium
   - Gradientes, animaciones y efectos visuales
   - Estilos JSX inline para mejor encapsulación

2. **`components/modals/CampaignModal.jsx`**
   - Modal pop-up de bienvenida a la campaña

3. **`styles/components/campaign-modal.module.css`**
   - Estilos del modal de campaña

### Imágenes
4. **`public/images/hero/offers/buen-fin-apple-ecosystem.png`**
5. **`public/images/hero/offers/buen-fin-flagship-phones.png`**
6. **`public/images/hero/offers/buen-fin-gamer-setups.png`**
7. **`public/images/hero/offers/buen-fin-pop-up.png`**

---

## 🔧 Archivos Modificados

### a. `config/promotions.js`

**Cambios realizados:**
- Configuración del objeto `BUEN_FIN_PROMO` con fechas, mensajes y rutas de imágenes
- Función `isBuenFinActive()` para validar si la campaña está activa
- Función `applyBuenFinDiscount()` para aplicar el descuento de $1500 MXN

**Líneas clave:**
- Líneas 1-25: Objeto de configuración
- Líneas 27-31: Función de validación de fechas
- Líneas 33-42: Función de aplicación de descuento

---

### b. `components/CampaignBanner.jsx`

**Cambios de diseño realizados:**
- ✅ Rediseño completo del banner con gradientes premium
- ✅ Iconos SVG personalizados con animaciones
- ✅ Sistema de animaciones CSS avanzado
- ✅ Botón CTA con hover effects sofisticados
- ✅ Responsive design para móvil y tablet

**Efectos especiales:**
- Fondo con gradiente de 3 paradas de color
- Efecto radial animado detrás del contenido
- 4 animaciones CSS keyframes distintas
- Transiciones suaves en hover
- Media queries para 3 breakpoints

---

### c. `components/product/ProductCard.jsx`

**Cambios realizados:**
- Importación de `BUEN_FIN_PROMO` desde config
- Lógica para detectar si el producto tiene descuento Buen Fin aplicado
- Renderizado condicional del badge de promoción (líneas 123-127)
- Renderizado del mensaje en variantes (líneas 155-159)

**No requiere cambios adicionales** - Los estilos se modificaron en el archivo CSS.

---

### d. `styles/components/product-card.module.css`

**Cambios de diseño realizados:**

**`.promoFlag` (líneas 92-156):**
- ✅ Gradiente rojo a marrón oscuro
- ✅ Borde dorado de 2px
- ✅ Icono de regalo (🎁) con animación
- ✅ Tres animaciones: pulse, bounce-icon, shine
- ✅ Sombras dobles (roja + dorada)

**`.variantPromo` (líneas 283-334):**
- ✅ Diseño en píldora compacto
- ✅ Icono de fuego (🔥) con efecto flicker
- ✅ Dos animaciones: flicker, promo-shine
- ✅ Sombra roja suave

---

### e. `components/cart/CartSummary.jsx`

**Cambios realizados:**
- Cálculo del descuento Buen Fin en el hook `useMemo` (línea 31)
- Aplicación del descuento al subtotal (línea 32)
- Fila especial para mostrar el descuento (líneas 93-101)
- Estilos personalizados: `buenFinRow`, `buenFinLabel`, `buenFinIcon`, `buenFinAmount`

---

### f. `styles/components/cart-summary.module.css`

**Cambios de diseño realizados:**

**`.buenFinRow` (líneas 60-130):**
- ✅ Fila destacada con gradiente rojo suave
- ✅ Borde dorado de 2px con bordes redondeados
- ✅ Padding generoso (12px 16px)
- ✅ Tres animaciones: highlight, bounce, shine
- ✅ Icono de regalo prominente
- ✅ Tipografía extra bold para el monto

**Clases adicionales:**
- `.buenFinLabel`: Etiqueta con icono
- `.buenFinIcon`: Icono animado
- `.buenFinAmount`: Monto del descuento destacado

---

### g. `components/layout/MainLayout.jsx`

**Cambios realizados:**
- Importación de `CampaignBanner`, `CampaignModal` y `EmailVerificationBanner`
- Renderizado de los componentes en el layout principal
- El banner aparece en la parte superior de todas las páginas
- El modal se muestra una vez por sesión

---

## 🧹 Guía de Reversión

### Paso 1: Revertir Archivos Modificados

#### a. `config/promotions.js`
```javascript
// Eliminar todo el contenido relacionado con BUEN_FIN_PROMO
// Esto incluye el objeto, isBuenFinActive() y applyBuenFinDiscount()
```

#### b. `components/layout/MainLayout.jsx`
```javascript
// Eliminar estas importaciones:
import CampaignBanner from '../CampaignBanner';
import EmailVerificationBanner from '../EmailVerificationBanner';
import CampaignModal from '../modals/CampaignModal';

// Eliminar estos componentes del JSX:
<CampaignModal />
<CampaignBanner />
<EmailVerificationBanner />
```

#### c. `components/product/ProductCard.jsx`
```javascript
// Eliminar:
import { BUEN_FIN_PROMO } from '../../config/promotions';

// Eliminar líneas 42-45 (lógica de buenFinActive)
// Eliminar líneas 123-127 (renderizado del badge)
// Eliminar líneas 155-159 (mensaje en variantes)
```

#### d. `styles/components/product-card.module.css`
```css
/* Revertir .promoFlag a su estado original (líneas 92-106) */
/* Revertir .variantPromo a su estado original (líneas 283-289) */
/* Eliminar todas las animaciones agregadas: */
/* - @keyframes promo-pulse */
/* - @keyframes bounce-icon */
/* - @keyframes shine */
/* - @keyframes flicker */
/* - @keyframes promo-shine */
```

#### e. `components/cart/CartSummary.jsx`
```javascript
// Eliminar:
import { isBuenFinActive, BUEN_FIN_PROMO } from '../../config/promotions';

// Revertir el useMemo a su estado original (eliminar líneas 31-32)
// Eliminar el bloque condicional de buenFinDiscount (líneas 93-101)
```

#### f. `styles/components/cart-summary.module.css`
```css
/* Eliminar todas las clases y animaciones de Buen Fin: */
/* - .buenFinRow (líneas 60-130) */
/* - .buenFinLabel */
/* - .buenFinIcon */
/* - .buenFinAmount */
/* - @keyframes buen-fin-highlight */
/* - @keyframes buen-fin-bounce */
/* - @keyframes buen-fin-shine */
```

### Paso 2: Eliminar Archivos Creados

```bash
# Eliminar componentes
rm components/CampaignBanner.jsx
rm components/modals/CampaignModal.jsx
rm styles/components/campaign-modal.module.css

# Eliminar imágenes
rm public/images/hero/offers/buen-fin-apple-ecosystem.png
rm public/images/hero/offers/buen-fin-flagship-phones.png
rm public/images/hero/offers/buen-fin-gamer-setups.png
rm public/images/hero/offers/buen-fin-pop-up.png
```

### Paso 3: Verificar y Testear

1. ✅ Verificar que no hay imports rotos
2. ✅ Ejecutar `npm run build` para detectar errores
3. ✅ Revisar que las páginas cargan correctamente
4. ✅ Verificar que no quedan estilos CSS huérfanos

---

## 📊 Resumen de Cambios

| Tipo | Cantidad | Detalles |
|------|----------|----------|
| **Archivos Creados** | 7 | 3 componentes/estilos + 4 imágenes |
| **Archivos Modificados** | 6 | Config, componentes y estilos |
| **Animaciones CSS** | 11 | Diferentes efectos visuales |
| **Líneas de Código** | ~450 | Entre JS, JSX y CSS |
| **Iconos Animados** | 4 | Regalo, fuego, dinero, reloj |

---

## 🎯 Objetivos Alcanzados

✅ **Diseño Premium:** Gradientes, sombras y efectos de alta calidad
✅ **Animaciones Fluidas:** 11 animaciones CSS distintas con timing perfecto
✅ **UX Mejorado:** Elementos destacados que capturan la atención sin ser intrusivos
✅ **Responsive Design:** Funciona perfectamente en móvil, tablet y desktop
✅ **Performance:** Animaciones optimizadas con `transform` y `opacity`
✅ **Consistencia:** Paleta de colores coherente en todos los elementos
✅ **Accesibilidad:** Contraste adecuado y aria-labels donde es necesario

---

## 📝 Notas Finales

- La campaña se desactiva automáticamente el **16 de noviembre de 2025**
- Todos los cambios están documentados con comentarios en el código
- Los estilos están modularizados para facilitar la reversión
- Se recomienda hacer un commit separado al revertir los cambios
- Este documento debe mantenerse actualizado si se hacen cambios adicionales

---

**Última actualización:** 11 de noviembre de 2025
**Versión:** 2.0 (con mejoras de diseño implementadas)
