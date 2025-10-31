# Assets de productos

Este directorio aloja las imagenes estaticas servidas por Next.js. Cada producto tiene su propia carpeta dentro de `public/assets/images/products/<slug>/`.

## Estructura sugerida

```
public/
  assets/
    images/
      placeholder-base.png        # Placeholder base para generar derivadas rapidas
      products/
        iphone-14-pro/
          primary.png             # Imagen principal (800x800 recomendado, fondo limpio)
          thumbnail.png           # Miniatura cuadrada para grids/listas
        ...
```

## Recomendaciones de carga

- Usa el `slug` del producto como nombre de carpeta para mantener consistencia con `data/mock/products.js`.
- Exporta los archivos en formato `.png` o `.jpg` con fondo transparente/blanco y dim 1600x1600 (optimiza peso con TinyPNG).
- Antes de subir, reemplaza `primary.png` y `thumbnail.png` por las versiones finales. Si necesitas mas vistas, agrega `gallery-01.jpg`, `gallery-02.jpg`, etc. y referencia desde el CMS o data source.
- Manten los nombres en minusculas y sin espacios para evitar problemas al desplegar (especialmente en sistemas case-sensitive).

## Proximos pasos

1. Reemplaza los placeholders genericos por las fotografias reales.
2. Si subes nuevas categorias, recuerda actualizar `data/mock/products.js` con la ruta correcta.
3. Considera automatizar la optimizacion usando `next/image` + un pipeline (por ejemplo Sharp o Cloudinary) cuando las imagenes definitivas esten listas.
