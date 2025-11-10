// API para obtener posts destacados del blog para el banner hero
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const featuredPosts = [
      {
        id: 1,
        type: 'blog',
        badge: 'Guia completa',
        title: 'Como elegir un smartphone reacondicionado en 2025',
        subtitle:
          'Conoce los 7 factores clave para ahorrar hasta un 60 por ciento sin sacrificar calidad ni garantia.',
        primaryCta: {
          text: 'Leer guia',
          href: '/blog/como-elegir-smartphone-reacondicionado',
        },
        secondaryCta: {
          text: 'Ver blog',
          href: '/blog',
        },
        image: '/assets/images/blog/guia-comprar-iphone-reacondicionado.jpg',
        readTime: '8 min',
        category: 'Guias de compra',
      },
      {
        id: 2,
        type: 'blog',
        badge: 'Sostenibilidad',
        title: 'Impacto ambiental: 28 toneladas de CO2 ahorradas',
        subtitle:
          'Cada dispositivo reacondicionado reduce huella de carbono y extiende el ciclo de vida de la tecnologia.',
        primaryCta: {
          text: 'Conocer mas',
          href: '/blog/impacto-ambiental-tecnologia',
        },
        secondaryCta: {
          text: 'Nuestra mision',
          href: '/comunidad',
        },
        image: '/assets/images/blog/sostenibilidad-tecnologica.jpg',
        readTime: '5 min',
        category: 'Sostenibilidad',
      },
      {
        id: 3,
        type: 'blog',
        badge: 'Actualidad',
        title: 'Certificacion de 30 puntos: que revisamos en cada dispositivo',
        subtitle:
          'Transparencia total del proceso profesional que garantiza equipos listos para usar como nuevos.',
        primaryCta: {
          text: 'Ver proceso',
          href: '/blog/certificacion-30-puntos',
        },
        secondaryCta: {
          text: 'Certificacion',
          href: '/certificacion',
        },
        image: '/assets/images/blog/garantia-dispositivos-reacondicionados.jpg',
        readTime: '6 min',
        category: 'Certificacion',
      },
      {
        id: 4,
        type: 'blog',
        badge: 'Consejos',
        title: 'Cinco razones para vender tu smartphone en vez de guardarlo',
        subtitle:
          'Activa la economia circular, obten liquidez y libera espacio con un proceso simple y seguro.',
        primaryCta: {
          text: 'Leer articulo',
          href: '/blog/vender-smartphone-usado',
        },
        secondaryCta: {
          text: 'Vender ahora',
          href: '/vender',
        },
        image: '/assets/images/blog/como-vender-iphone-usado.jpg',
        readTime: '4 min',
        category: 'Vendedores',
      },
    ];

    res.status(200).json({
      success: true,
      posts: featuredPosts,
      count: featuredPosts.length,
    });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los posts destacados',
    });
  }
}
