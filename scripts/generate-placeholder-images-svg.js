const fs = require('fs');
const path = require('path');

const products = [
  { folder: 'playstation-5-30th-anniversary', name: 'PS5 30th Anniversary', color: '#003087' },
  { folder: 'playstation-5-gold-ghost-of-yotei', name: 'PS5 Gold Ghost of Yotei', color: '#D4AF37' },
  { folder: 'dualsense-midnight-black', name: 'DualSense Midnight Black', color: '#1A1A1A' },
  { folder: 'playstation-5-digital-bundle', name: 'PS5 Digital Bundle', color: '#0070CC' },
  { folder: 'tv-hisense-43-43a4nv', name: 'Hisense 43" 43A4NV', color: '#E31E24' },
  { folder: 'samsung-42-oled-s90d', name: 'Samsung 42" OLED S90D', color: '#1428A0' },
  { folder: 'samsung-75-u8200f-bundle', name: 'Samsung 75" + Soundbar', color: '#0D47A1' },
  { folder: 'samsung-55-du7000', name: 'Samsung 55" DU7000', color: '#034EA2' },
  { folder: 'hisense-65-u6qv', name: 'Hisense 65" U6QV', color: '#C41E3A' },
  { folder: 'samsung-75-u8000f', name: 'Samsung 75" U8000F', color: '#1E3A8A' },
  { folder: 'macbook-m2-16gb', name: 'MacBook M2 16GB', color: '#555555' },
];

function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function generateSVG(width, height, text, color) {
  const lightColor = lightenColor(color, 20);
  const lines = text.split('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${lightColor};stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  <rect x="4" y="4" width="${width - 8}" height="${height - 8}" fill="none" stroke="white" stroke-width="8"/>

  <text x="${width / 2}" y="${height / 2 - 30}" font-family="Arial, sans-serif" font-size="${width === 800 ? 48 : 32}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>

  <text x="${width / 2}" y="${height / 2 + 30}" font-family="Arial, sans-serif" font-size="${width === 800 ? 32 : 20}" fill="#CCCCCC" text-anchor="middle" dominant-baseline="middle">PLACEHOLDER</text>

  <text x="${width / 2}" y="${height / 2 + 70}" font-family="Arial, sans-serif" font-size="${width === 800 ? 24 : 16}" fill="#CCCCCC" text-anchor="middle" dominant-baseline="middle">${width}x${height}</text>
</svg>`;
}

// Generar todas las imágenes SVG
console.log('🎨 Generando imágenes placeholder SVG...\n');

const baseDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'products');

products.forEach(product => {
  const productDir = path.join(baseDir, product.folder);

  // Crear carpeta si no existe
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }

  // Generar imagen principal SVG (800x800)
  const primaryPath = path.join(productDir, 'primary.svg');
  const primarySVG = generateSVG(800, 800, product.name, product.color);
  fs.writeFileSync(primaryPath, primarySVG);
  console.log(`✓ Creada: ${primaryPath}`);

  // Generar thumbnail SVG (300x300)
  const thumbnailPath = path.join(productDir, 'thumbnail.svg');
  const thumbnailSVG = generateSVG(300, 300, product.name, product.color);
  fs.writeFileSync(thumbnailPath, thumbnailSVG);
  console.log(`✓ Creada: ${thumbnailPath}`);
});

console.log('\n✅ Todas las imágenes placeholder SVG han sido generadas exitosamente!');
console.log('📁 Ubicación: public/assets/images/products/');
console.log('\n💡 Los archivos SVG funcionarán temporalmente.');
console.log('💡 Reemplázalos con archivos JPG/PNG cuando tengas las imágenes reales.');
