# Instrucciones para Reemplazar Imágenes de Productos

## Estado Actual

Se han agregado **11 nuevos productos** al sistema con imágenes placeholder SVG temporales.

## Productos Agregados

1. PlayStation 5 Edición Limitada 30 Aniversario - $18,239
2. PlayStation 5 Edición Limitada Gold Ghost Of Yotei 1 TB - $15,999
3. Control Inalámbrico DualSense PlayStation 5 Midnight Black - $1,399
4. Consola PlayStation 5 Digital 1 TB más Astro Bot y Gran Turismo 7 - $11,499
5. TV Hisense 43 Pulgadas Full HD 43A4NV - $5,999
6. Pantalla 42'' Samsung AI OLED 4K S90D NQ4 AI Gen2 Tizen OS - $19,999
7. Combo Pantalla 75'' Samsung Crystal U8200F + Barra de sonido HW-B450F - $16,999
8. TV Samsung 55 pulgadas 4K Ultra HD Smart TV LED UN-55DU7000 - $8,999
9. TV Hisense 65 pulgadas 4K 65U6QV Miniled vidaa - $9,339
10. Televisión Samsung 75 Pulgadas 4K Smart Crystal UHD UN75U8000FFXZX - $12,995
11. MacBook Apple Chip M2 con CPU de 8 núcleos y GPU de 8 núcleos, 16 GB RAM, 256 GB SSD - $25,999

---

## Rutas de las Imágenes Placeholder (TEMPORALES)

Todas las imágenes están ubicadas en:
```
C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\
```

### Listado de carpetas y archivos:

```
📁 playstation-5-30th-anniversary/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 playstation-5-gold-ghost-of-yotei/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 dualsense-midnight-black/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 playstation-5-digital-bundle/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 tv-hisense-43-43a4nv/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 samsung-42-oled-s90d/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 samsung-75-u8200f-bundle/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 samsung-55-du7000/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 hisense-65-u6qv/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 samsung-75-u8000f/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg

📁 macbook-m2-16gb/
   ├── primary.svg (800x800) - REEMPLAZAR con primary.jpg
   └── thumbnail.svg (300x300) - REEMPLAZAR con thumbnail.jpg
```

---

## Cómo Reemplazar las Imágenes

### Opción 1: Reemplazar Manualmente (Recomendado)

1. **Navega a la carpeta del producto:**
   ```
   C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\products\[nombre-carpeta]\
   ```

2. **Prepara tus imágenes reales:**
   - **primary.jpg** - Imagen principal del producto (tamaño recomendado: 800x800px o mayor)
   - **thumbnail.jpg** - Miniatura (tamaño recomendado: 300x300px)

3. **Elimina los archivos SVG:**
   - Borra `primary.svg`
   - Borra `thumbnail.svg`

4. **Copia tus nuevas imágenes JPG:**
   - Coloca `primary.jpg` en la carpeta
   - Coloca `thumbnail.jpg` en la carpeta

5. **Actualiza el código (importante):**
   - Abre el archivo: `data\mock\products.js`
   - Busca el producto correspondiente
   - Cambia la extensión `.svg` por `.jpg` en las rutas `image` y `thumbnail`

### Opción 2: Usar Script Automatizado

Si tienes todas las imágenes listas en una carpeta específica, puedo crear un script que las copie automáticamente a las ubicaciones correctas.

---

## Especificaciones de Imágenes Recomendadas

| Tipo | Dimensiones | Formato | Peso máximo |
|------|-------------|---------|-------------|
| **primary.jpg** | 800x800px (mínimo) | JPG/PNG | 200 KB |
| **thumbnail.jpg** | 300x300px | JPG/PNG | 50 KB |

### Recomendaciones:
- Usa fondo blanco o transparente (PNG)
- Mantén buena calidad de imagen
- Optimiza el peso con herramientas como TinyPNG o ImageOptim
- Asegúrate que el producto se vea centrado y completo

---

## Actualizar Referencias en el Código

**IMPORTANTE:** Después de reemplazar los archivos SVG por JPG, debes actualizar las extensiones en:

**Archivo:** `data\mock\products.js`

**Cambiar:**
```javascript
image: '/assets/images/products/[carpeta]/primary.svg'
thumbnail: '/assets/images/products/[carpeta]/thumbnail.svg'
```

**Por:**
```javascript
image: '/assets/images/products/[carpeta]/primary.jpg'
thumbnail: '/assets/images/products/[carpeta]/thumbnail.jpg'
```

---

## Verificación

Una vez que hayas reemplazado todas las imágenes:

1. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Visita la página de productos y verifica que las imágenes se muestren correctamente

3. Revisa que no haya errores 404 en la consola del navegador

---

## Notas Adicionales

- Los archivos SVG funcionan temporalmente como placeholder
- El sistema aplicará automáticamente el descuento del Buen Fin ($1,500 MXN) a estos productos si están en el rango de fechas
- Puedes ver todos los productos en la página principal del sitio
- Los precios ya fueron investigados y asignados correctamente

---

**Fecha de creación:** 12 de noviembre de 2025
**Última actualización:** 12 de noviembre de 2025
