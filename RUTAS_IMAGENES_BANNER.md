# 📁 Rutas para Imágenes del Banner Dinámico

Este documento especifica las rutas exactas donde debes colocar las imágenes para que el banner hero dinámico funcione correctamente.

## 📂 Estructura de Carpetas

Crea la siguiente estructura dentro de la carpeta `public` de tu proyecto:

```
public/
└── images/
    └── hero/
        └── offers/          (Imágenes de ofertas especiales)

NOTA: Los posts del blog usan automáticamente las imágenes de productos existentes.
```

---

## 🏷️ OFERTAS - `/public/images/hero/offers/`

Coloca las imágenes de tus ofertas destacadas en esta ruta:

### Imágenes requeridas:

1. **`iphone-13-pro.jpg`**
   - Producto: iPhone 13 Pro Max Reacondicionado
   - Dimensiones recomendadas: 1200x800px o similar
   - Formato: JPG, PNG o WebP

2. **`samsung-s22.jpg`**
   - Producto: Samsung Galaxy S22 Ultra
   - Dimensiones recomendadas: 1200x800px o similar
   - Formato: JPG, PNG o WebP

3. **`macbook-air-m2.jpg`**
   - Producto: MacBook Air M2 Reacondicionado
   - Dimensiones recomendadas: 1200x800px o similar
   - Formato: JPG, PNG o WebP

### Ruta completa de ejemplo:
```
C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\images\hero\offers\iphone-13-pro.jpg
C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\images\hero\offers\samsung-s22.jpg
C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\images\hero\offers\macbook-air-m2.jpg
```

---

## 📰 BLOG POSTS - Imágenes Automáticas ✅

**¡Buenas noticias!** Los posts del blog utilizan automáticamente las imágenes de productos existentes.

### Imágenes configuradas:

1. **Post: "¿Cómo elegir un smartphone reacondicionado?"**
   - Imagen: `/assets/images/products/iphone-14/primary.jpg` ✅

2. **Post: "Impacto ambiental: 28 toneladas de CO2 ahorradas"**
   - Imagen: `/assets/images/products/google-pixel-7-pro/primary.jpg` ✅

3. **Post: "Certificación de 30 puntos"**
   - Imagen: `/assets/images/products/dell-ultrasharp-u2723qe/primary.jpg` ✅

4. **Post: "5 razones para vender tu viejo smartphone"**
   - Imagen: `/assets/images/products/apple-watch-series-8/primary.jpg` ✅

**No necesitas agregar imágenes adicionales para los posts del blog.** Están usando las imágenes de productos que ya tienes.

---

## 🎨 Especificaciones Técnicas de las Imágenes

### Dimensiones recomendadas:
- **Ancho:** 1200-1600px
- **Alto:** 800-1000px
- **Aspecto ratio:** 16:9 o 3:2

### Formatos aceptados:
- JPG/JPEG (recomendado para fotos)
- PNG (para imágenes con transparencia)
- WebP (para mejor optimización)

### Peso del archivo:
- Máximo recomendado: 200-300 KB
- Usa herramientas como TinyPNG o Squoosh para optimizar

### Consideraciones de diseño:
- Las imágenes se mostrarán sobre un fondo degradado azul-verde
- Asegúrate de que tengan buen contraste
- Evita texto pequeño dentro de las imágenes
- Las imágenes deben verse bien en móvil y desktop

---

## 🔄 Cómo Agregar Más Ofertas o Posts

### Para agregar nuevas ofertas:

1. Agrega tu imagen en `/public/images/hero/offers/nombre-producto.jpg`

2. Edita el archivo: `pages/api/hero/featured-offers.js`

3. Agrega un nuevo objeto al array `featuredOffers`:

```javascript
{
  id: 4,
  type: 'offer',
  badge: 'Nueva Oferta',
  title: 'Tu título aquí',
  subtitle: 'Descripción del producto',
  primaryCta: {
    text: 'Ver oferta',
    href: '/comprar?promo=tuproducto'
  },
  secondaryCta: {
    text: 'Ver catálogo',
    href: '/comprar'
  },
  image: '/images/hero/offers/nombre-producto.jpg',  // 👈 Tu nueva imagen
  discount: '40%',
  originalPrice: 899,
  offerPrice: 539
}
```

### Para agregar nuevos posts del blog:

1. Agrega tu imagen en `/public/images/hero/blog/nombre-post.jpg`

2. Edita el archivo: `pages/api/hero/featured-posts.js`

3. Agrega un nuevo objeto al array `featuredPosts`:

```javascript
{
  id: 5,
  type: 'blog',
  badge: 'Nuevo Artículo',
  title: 'Tu título aquí',
  subtitle: 'Descripción del artículo',
  primaryCta: {
    text: 'Leer artículo',
    href: '/blog/tu-slug-aqui'
  },
  secondaryCta: {
    text: 'Ver blog',
    href: '/blog'
  },
  image: '/images/hero/blog/nombre-post.jpg',  // 👈 Tu nueva imagen
  readTime: '5 min',
  category: 'Tu Categoría'
}
```

---

## ✅ Checklist de Implementación

- [ ] Crear carpeta `/public/images/hero/offers/`
- [ ] Agregar `iphone-13-pro.jpg` (iPhone 13 Pro Max)
- [ ] Agregar `samsung-s22.jpg` (Samsung Galaxy S22 Ultra)
- [ ] Agregar `macbook-air-m2.jpg` (MacBook Air M2)
- [ ] Optimizar el peso de las imágenes (<300KB)
- [ ] Verificar que las dimensiones sean consistentes (1200x800px recomendado)
- [ ] Probar el banner en localhost
- [ ] Verificar la visualización en móvil y desktop
- [x] Posts del blog - Ya configurados con imágenes de productos ✅

---

## 🚀 Prueba Rápida

Para verificar que las imágenes están correctamente ubicadas, prueba accediendo directamente en tu navegador:

**Ofertas (necesitas agregar estas):**
- `http://localhost:3000/images/hero/offers/iphone-13-pro.jpg`
- `http://localhost:3000/images/hero/offers/samsung-s22.jpg`
- `http://localhost:3000/images/hero/offers/macbook-air-m2.jpg`

**Posts del blog (ya funcionan automáticamente):**
- `http://localhost:3000/assets/images/products/iphone-14/primary.jpg` ✅
- `http://localhost:3000/assets/images/products/google-pixel-7-pro/primary.jpg` ✅

Si ves las imágenes, están correctamente ubicadas. Si recibes un error 404, revisa la ubicación de los archivos.

---

## 💡 Consejos Adicionales

1. **Nombres de archivo:** Usa nombres descriptivos en minúsculas, sin espacios (usa guiones)
2. **Consistencia:** Mantén el mismo estilo visual en todas las imágenes
3. **Optimización:** Comprime las imágenes antes de subirlas al proyecto
4. **Backup:** Guarda las imágenes originales en alta resolución por si necesitas editarlas después

---

**Última actualización:** Noviembre 2025
**Versión del banner:** 2.0 - Banner dinámico con carrusel
