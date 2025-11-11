/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack solo está disponible en desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    turbopack: {
      root: __dirname,
    },
  }),
  // Optimización de imágenes
  images: {
    domains: [],
    unoptimized: false,
  },
  // Headers de caché para assets estáticos
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

