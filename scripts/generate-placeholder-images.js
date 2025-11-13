const { createCanvas } = require('canvas');
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

function generateImage(width, height, text, color, outputPath) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fondo con gradiente
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, lightenColor(color, 20));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Borde
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Texto principal
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Título
  const fontSize = width === 800 ? 48 : 32;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillText(text, width / 2, height / 2 - 30);

  // Subtítulo "PLACEHOLDER"
  const subFontSize = width === 800 ? 32 : 20;
  ctx.font = `${subFontSize}px Arial`;
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText('PLACEHOLDER', width / 2, height / 2 + 30);

  // Dimensiones
  const dimFontSize = width === 800 ? 24 : 16;
  ctx.font = `${dimFontSize}px Arial`;
  ctx.fillText(`${width}x${height}`, width / 2, height / 2 + 70);

  // Guardar imagen
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Creada: ${outputPath}`);
}

function lightenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Generar todas las imágenes
console.log('🎨 Generando imágenes placeholder...\n');

const baseDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'products');

products.forEach(product => {
  const productDir = path.join(baseDir, product.folder);

  // Crear carpeta si no existe
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }

  // Generar imagen principal (800x800)
  const primaryPath = path.join(productDir, 'primary.jpg');
  generateImage(800, 800, product.name, product.color, primaryPath);

  // Generar thumbnail (300x300)
  const thumbnailPath = path.join(productDir, 'thumbnail.jpg');
  generateImage(300, 300, product.name, product.color, thumbnailPath);
});

console.log('\n✅ Todas las imágenes placeholder han sido generadas exitosamente!');
console.log('📁 Ubicación: public/assets/images/products/');
console.log('\n💡 Ahora puedes reemplazar estas imágenes con las reales manteniendo los mismos nombres.');
