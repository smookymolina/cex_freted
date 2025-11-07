# Guía para Agregar Imágenes de Productos

## 📁 Estructura de Carpetas

Todas las imágenes de productos se encuentran en:
```
C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\
```

Cada producto tiene su propia carpeta con el nombre del `slug` del producto.

## 📋 Productos Nuevos Agregados

He agregado 6 nuevos productos al catálogo. A continuación te indico dónde debes colocar las imágenes para cada uno:

### 1. iPhone 16 Pro Max
**Carpeta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\iphone-16-pro-max\`

Archivos necesarios:
- `primary.jpg` - Imagen principal del producto (dimensión recomendada: 800x800px o 1000x1000px)
- `thumbnail.jpg` - Miniatura (dimensión recomendada: 300x300px)

### 2. iPhone 16 Pro
**Carpeta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\iphone-16-pro\`

Archivos necesarios:
- `primary.jpg`
- `thumbnail.jpg`

### 3. iPhone 16
**Carpeta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\iphone-16\`

Archivos necesarios:
- `primary.jpg`
- `thumbnail.jpg`

### 4. iPhone 15 Pro
**Carpeta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\iphone-15-pro\`

Archivos necesarios:
- `primary.jpg`
- `thumbnail.jpg`

### 5. iPhone 15
**Carpeta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\iphone-15\`

Archivos necesarios:
- `primary.jpg`
- `thumbnail.jpg`

### 6. Samsung Galaxy S24 Ultra
**Carpeta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\samsung-galaxy-s24-ultra\`

Archivos necesarios:
- `primary.jpg`
- `thumbnail.jpg`

## 🎨 Especificaciones de las Imágenes

### Imagen Principal (primary.jpg)
- **Formato:** JPG
- **Dimensiones recomendadas:** 800x800px o 1000x1000px (aspecto 1:1)
- **Fondo:** Preferiblemente transparente o fondo blanco/gris claro
- **Peso máximo:** 200KB (optimizar para web)
- **Calidad:** Alta resolución pero optimizada

### Miniatura (thumbnail.jpg)
- **Formato:** JPG
- **Dimensiones recomendadas:** 300x300px (aspecto 1:1)
- **Fondo:** Igual que la imagen principal
- **Peso máximo:** 50KB
- **Calidad:** Media-alta (optimizada para carga rápida)

## 💡 Consejos para las Imágenes

1. **Fondo uniforme:** Usa fondo blanco (#FFFFFF) o gris claro (#F8F9FA) para consistencia
2. **Centrado:** Asegúrate de que el producto esté centrado en la imagen
3. **Espacio alrededor:** Deja un margen del 10-15% alrededor del producto
4. **Sin marcos ni bordes:** Las imágenes no deben tener marcos decorativos
5. **Ángulo:** Preferiblemente vista frontal o en un ángulo de 3/4
6. **Iluminación:** Buena iluminación sin sombras duras

## 🔍 Ejemplo de Referencia

Puedes ver ejemplos de imágenes correctamente formateadas en:
```
C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\iphone-14\
```

## 📊 Precios Configurados

| Producto | Grade A+ | Grade A | Grade B |
|----------|----------|---------|---------|
| iPhone 16 Pro Max | $26,980 | $25,480 | $23,980 |
| iPhone 16 Pro | $24,980 | $23,480 | $21,980 |
| iPhone 16 | $19,980 | $18,480 | $16,980 |
| iPhone 15 Pro | $21,980 | $20,480 | $18,980 |
| iPhone 15 | $16,980 | $15,480 | $13,980 |
| Samsung S24 Ultra | $22,980 | $21,480 | $19,980 |

## ✅ Checklist de Implementación

- [x] Productos agregados al archivo `data/mock/products.js`
- [x] Carpetas creadas para las imágenes
- [ ] **Agregar imagen `primary.jpg` para iPhone 16 Pro Max**
- [ ] **Agregar imagen `thumbnail.jpg` para iPhone 16 Pro Max**
- [ ] **Agregar imagen `primary.jpg` para iPhone 16 Pro**
- [ ] **Agregar imagen `thumbnail.jpg` para iPhone 16 Pro**
- [ ] **Agregar imagen `primary.jpg` para iPhone 16**
- [ ] **Agregar imagen `thumbnail.jpg` para iPhone 16**
- [ ] **Agregar imagen `primary.jpg` para iPhone 15 Pro**
- [ ] **Agregar imagen `thumbnail.jpg` para iPhone 15 Pro**
- [ ] **Agregar imagen `primary.jpg` para iPhone 15**
- [ ] **Agregar imagen `thumbnail.jpg` para iPhone 15**
- [ ] **Agregar imagen `primary.jpg` para Samsung Galaxy S24 Ultra**
- [ ] **Agregar imagen `thumbnail.jpg` para Samsung Galaxy S24 Ultra**

## 🌐 Fuentes de Imágenes Recomendadas

1. **Apple Official Press Kit** - imágenes oficiales de alta calidad
2. **Unsplash** - buscar "iphone 16" o "samsung galaxy s24"
3. **Pexels** - imágenes libres de derechos
4. **Remove.bg** - para remover fondos de imágenes

## 🛠️ Herramientas de Optimización

- **TinyPNG** (https://tinypng.com) - para comprimir imágenes JPG/PNG
- **Squoosh** (https://squoosh.app) - editor de imágenes web de Google
- **Remove.bg** (https://remove.bg) - para remover fondos

## ⚠️ Importante

Una vez que agregues las imágenes en las carpetas correspondientes:
1. Reinicia el servidor de desarrollo (`npm run dev`)
2. Verifica que las imágenes se carguen correctamente en http://localhost:3000/comprar
3. Las imágenes se ajustarán automáticamente con el nuevo sistema de `object-fit: contain`
