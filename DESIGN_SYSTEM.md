# Sistema de Diseño CEX Freted

## 🎨 Identidad Visual

### Concepto
Diseño limpio, profesional y premium que transmite **confianza** y **certificación**.

---

## 📐 Variables CSS

Todas las variables están definidas en `styles/base/global.css`

### Colores Principales

```css
--color-background: #f5f7fb;      /* Fondo general */
--color-surface: #ffffff;          /* Superficies (cards, modales) */
--color-primary: #1c4ed8;          /* Azul principal */
--color-primary-dark: #163ea6;     /* Azul oscuro (hover) */
--color-primary-light: rgba(28, 78, 216, 0.08); /* Azul muy claro (backgrounds) */
--color-secondary: #1a8f5b;        /* Verde secundario */
--color-secondary-dark: #105c3c;   /* Verde oscuro */
--color-muted: #5b6383;            /* Texto secundario */
--color-border: #d9deeb;           /* Bordes */
--color-contrast: #0b0f1a;         /* Texto principal */
```

### Colores de Utilidad

```css
--color-success: #10b981;  /* Verde éxito */
--color-warning: #f59e0b;  /* Amarillo advertencia */
--color-error: #ef4444;    /* Rojo error */
--color-info: #3b82f6;     /* Azul información */
```

### Grises

```css
--gray-50 a --gray-900  /* Escala de grises */
```

### Radios

```css
--radius-sm: 8px;      /* Radio pequeño */
--radius-md: 14px;     /* Radio medio */
--radius-lg: 20px;     /* Radio grande */
--radius-xl: 24px;     /* Radio extra grande */
--radius-full: 999px;  /* Radio completo (píldora) */
```

### Sombras

```css
--shadow-soft: 0 12px 35px rgba(28, 78, 216, 0.08); /* Sombra suave (principal) */
--shadow-md: /* Sombra media */
--shadow-lg: /* Sombra grande */
--shadow-xl: /* Sombra extra grande */
```

### Transiciones

```css
--transition-base: 200ms ease;  /* Transición rápida */
--transition-slow: 300ms ease;  /* Transición lenta */
```

---

## 🧩 Componentes Comunes

Importar desde: `styles/components/common.module.css`

### Layout

```jsx
<div className={styles.pageContainer}>
  <div className={styles.pageInner}>
    {/* Contenido */}
  </div>
</div>
```

### Header de Página

```jsx
<div className={styles.pageHeader}>
  <div className={styles.iconWrapper}>
    <IconComponent />
  </div>
  <h1 className={styles.pageTitle}>Título</h1>
  <p className={styles.pageSubtitle}>Descripción</p>
</div>
```

### Cards

```jsx
<div className={styles.card}>
  <h3 className={styles.cardHeader}>Título</h3>
  <p className={styles.cardContent}>Contenido</p>
</div>
```

### Botones

```jsx
<button className={styles.btnPrimary}>Botón Primario</button>
<button className={styles.btnOutline}>Botón Outline</button>
```

### Input

```jsx
<input className={styles.input} placeholder="Texto..." />
```

### Badges

```jsx
<span className={styles.badge}>Badge</span>
<span className={styles.badgeSuccess}>Éxito</span>
<span className={styles.badgeWarning}>Advertencia</span>
<span className={styles.badgeError}>Error</span>
```

---

## 📦 Componentes UI Existentes

### Button Component

Ubicación: `components/ui/Button.jsx`

**Variantes:**
- `solid` (default) - Azul sólido
- `outline` - Borde azul, fondo transparente
- `ghost` - Verde texto, sin borde
- `secondary` - Verde borde

**Uso:**
```jsx
import Button from '../ui/Button';

<Button href="/ruta">Texto</Button>
<Button variant="outline" href="/ruta">Texto</Button>
```

---

## 🎯 Principios de Diseño

### 1. Consistencia
- Usar SIEMPRE las variables CSS definidas
- NO usar colores hardcodeados
- Mantener radios y sombras consistentes

### 2. Espaciado
- Márgenes: múltiplos de 8px (8, 16, 24, 32, 48, 64)
- Padding interno: 16px, 20px, 24px
- Gap entre elementos: 12px, 16px, 24px

### 3. Tipografía
- Font: **Inter** (sistema de respaldo)
- Títulos principales: 2.5rem (40px), bold
- Títulos secundarios: 1.75rem (28px), bold
- Texto normal: 0.95rem (15px)
- Texto pequeño: 0.85rem (13.6px)

### 4. Colores de Texto
- Texto principal: `var(--color-contrast)`
- Texto secundario: `var(--color-muted)`
- Links/CTA: `var(--color-primary)`

### 5. Interacciones
- **Hover:**
  - Botones: `translateY(-2px)` + cambio de color
  - Cards: sombra más pronunciada
- **Transiciones:** Usar `var(--transition-base)` o `var(--transition-slow)`
- **Focus:** Borde azul + sombra azul clara

### 6. Responsive
- Mobile first
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

---

## ✅ Checklist para Nuevos Componentes

- [ ] Usar variables CSS en lugar de valores hardcodeados
- [ ] Importar `common.module.css` si es una página
- [ ] Usar `pageContainer` y `pageInner` para layouts
- [ ] Aplicar radios consistentes (`var(--radius-*)`)
- [ ] Usar sombras del sistema (`var(--shadow-*)`)
- [ ] Transiciones con variables CSS
- [ ] Probar en mobile, tablet y desktop
- [ ] Verificar contraste de colores (accesibilidad)
- [ ] Usar botones redondeados (radius-full para CTAs)

---

## 🚀 Ejemplos de Uso

### Página Nueva

```jsx
import styles from '../styles/components/common.module.css';
import { Icon } from 'lucide-react';

export default function MiPagina() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageInner}>
        <div className={styles.pageHeader}>
          <div className={styles.iconWrapper}>
            <Icon />
          </div>
          <h1 className={styles.pageTitle}>Mi Título</h1>
          <p className={styles.pageSubtitle}>Mi descripción</p>
        </div>

        {/* Contenido */}
        <div className={styles.grid2}>
          <div className={styles.card}>
            <h3 className={styles.cardHeader}>Card 1</h3>
            <p className={styles.cardContent}>Contenido</p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardHeader}>Card 2</h3>
            <p className={styles.cardContent}>Contenido</p>
          </div>
        </div>

        <button className={styles.btnPrimary}>Acción Principal</button>
      </div>
    </div>
  );
}
```

### Usando Variables en Inline Styles

```jsx
<div style={{
  background: 'var(--color-primary)',
  color: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-soft)',
  transition: 'all var(--transition-base)'
}}>
  Contenido
</div>
```

---

## 📁 Estructura de Archivos

```
styles/
├── base/
│   └── global.css          # Variables CSS globales
├── components/
│   ├── common.module.css   # Componentes comunes reutilizables
│   ├── button.module.css   # Estilos de botones
│   └── primary-nav.module.css
└── pages/
    ├── home.module.css
    └── placeholder.module.css
```

---

## 🎨 Paleta de Colores

### Primario (Azul)
- **#1c4ed8** - Principal
- **#163ea6** - Oscuro (hover)
- **rgba(28, 78, 216, 0.08)** - Muy claro (backgrounds)

### Secundario (Verde)
- **#1a8f5b** - Principal
- **#105c3c** - Oscuro

### Neutrales
- **#0b0f1a** - Texto principal (casi negro)
- **#5b6383** - Texto secundario (gris azulado)
- **#d9deeb** - Bordes
- **#f5f7fb** - Fondo general
- **#ffffff** - Superficies

---

## 📝 Notas

- **Tailwind CSS:** Disponible pero preferir variables CSS para consistencia
- **Font:** Inter cargado automáticamente
- **Icons:** Lucide React
- **Animaciones:** Preferir CSS transitions sobre animations complejas

---

Actualizado: 2025
