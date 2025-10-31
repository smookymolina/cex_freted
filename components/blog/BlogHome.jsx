import React from 'react';
import Link from 'next/link';
import BlogPostCard from './BlogPostCard';
import styles from '../../styles/components/Blog.module.css';

// Mock Data: En una aplicación real, esto vendría de un CMS
const mockPosts = [
  {
    slug: 'guia-comprar-iphone-reacondicionado',
    title: 'Guía Definitiva para Comprar un iPhone Reacondicionado en 2025',
    excerpt: 'No todos los reacondicionados son iguales. Aprende a identificar las mejores ofertas y qué revisar antes de comprar.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Compra',
    author: 'Ana García',
    date: '22 de Octubre, 2025',
  },
  {
    slug: 'sostenibilidad-tecnologica',
    title: 'El Impacto Oculto de tu Smartphone: Sostenibilidad y Tecnología',
    excerpt: 'Descubre cómo la compra de dispositivos de segunda mano contribuye a un futuro más verde y reduce la basura electrónica.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Sostenibilidad',
    author: 'Carlos Pérez',
    date: '15 de Octubre, 2025',
  },
  {
    slug: 'macbook-air-vs-pro',
    title: 'MacBook Air vs. Pro: ¿Cuál es el Ideal para Estudiantes?',
    excerpt: 'Analizamos el rendimiento, portabilidad y precio de los modelos más populares para ayudarte a elegir.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Comparativas',
    author: 'Laura Martínez',
    date: '10 de Octubre, 2025',
  },
  {
    slug: 'como-vender-iphone-usado',
    title: 'Cómo Vender tu iPhone Usado: Guía Completa para Obtener el Mejor Precio',
    excerpt: '¿Tienes un iPhone antiguo guardado? Podría valer más de lo que piensas. Aprende a prepararlo y venderlo al mejor precio.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Venta',
    author: 'Roberto Sánchez',
    date: '5 de Octubre, 2025',
  },
  {
    slug: 'tablets-estudiantes-2025',
    title: 'Las Mejores Tablets para Estudiantes en 2025: iPad vs Samsung Galaxy Tab',
    excerpt: 'Comparativa completa de las tablets más populares para estudiantes. Encuentra la ideal según tu carrera y presupuesto.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Comparativas',
    author: 'Ana García',
    date: '28 de Septiembre, 2025',
  },
  {
    slug: 'garantia-dispositivos-reacondicionados',
    title: 'Todo sobre las Garantías en Dispositivos Reacondicionados: Tu Protección al Comprar',
    excerpt: '¿Qué pasa si algo sale mal? Conoce tus derechos, coberturas y cómo funciona nuestra garantía de 12 meses.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Compra',
    author: 'Carlos Pérez',
    date: '20 de Septiembre, 2025',
  },
  {
    slug: 'android-vs-iphone-cual-elegir',
    title: 'Android vs iPhone en 2025: ¿Cuál es Mejor para Ti?',
    excerpt: 'El eterno debate resuelto. Comparamos ecosistema, personalización, actualizaciones, precio y más para ayudarte a decidir.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Comparativas',
    author: 'Laura Martínez',
    date: '12 de Septiembre, 2025',
  },
  {
    slug: 'consolas-gaming-ps5-xbox-switch',
    title: 'Guía de Consolas 2025: PS5 vs Xbox Series X vs Nintendo Switch - ¿Cuál Comprar?',
    excerpt: 'Análisis completo de las consolas de nueva generación. Exclusivos, rendimiento, precio y recomendaciones según tu perfil gamer.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Gaming',
    author: 'Roberto Sánchez',
    date: '3 de Septiembre, 2025',
  },
  {
    slug: 'auriculares-inalambricos-airpods-vs-competencia',
    title: 'AirPods vs la Competencia: Mejor Calidad-Precio en Auriculares Inalámbricos 2025',
    excerpt: '¿Valen la pena los AirPods? Comparamos con Sony, Samsung y Beats para encontrar la mejor opción según tu presupuesto.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Comparativas',
    author: 'Ana García',
    date: '25 de Agosto, 2025',
  },
  {
    slug: 'apple-watch-cual-comprar-2025',
    title: 'Apple Watch: ¿Qué Generación Comprar en 2025? Guía Completa',
    excerpt: 'Series 9, Series 8, SE o Series 7 reacondicionado. Te ayudamos a elegir el mejor Apple Watch según tu presupuesto y necesidades.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Compra',
    author: 'Laura Martínez',
    date: '18 de Agosto, 2025',
  },
  {
    slug: 'laptops-gaming-reacondicionadas-vale-la-pena',
    title: 'Laptops Gaming Reacondicionadas: ¿Vale la Pena en 2025?',
    excerpt: 'Ahorra 30-50% en laptops gaming. Analizamos qué buscar, modelos recomendados y si realmente vale la pena comprar reacondicionado.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Gaming',
    author: 'Roberto Sánchez',
    date: '10 de Agosto, 2025',
  },
  {
    slug: 'camaras-digitales-vs-smartphones-2025',
    title: '¿Aún Necesitas una Cámara Digital en 2025? Cámaras vs Smartphones',
    excerpt: '¿Tu iPhone es suficiente o necesitas cámara dedicada? Análisis completo para ayudarte a decidir según tu nivel fotográfico.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Comparativas',
    author: 'Ana García',
    date: '2 de Agosto, 2025',
  },
  {
    slug: 'smart-home-dispositivos-esenciales-2025',
    title: 'Smart Home para Principiantes: Dispositivos Esenciales en 2025',
    excerpt: 'Convierte tu hogar en smart home con presupuesto inteligente. Guía de dispositivos esenciales desde $5,000 MXN.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Compra',
    author: 'Carlos Pérez',
    date: '25 de Julio, 2025',
  },
  {
    slug: 'monitores-trabajo-remoto-home-office',
    title: 'Mejores Monitores para Trabajo Remoto y Home Office 2025',
    excerpt: 'Un buen monitor transforma tu productividad. Guía completa según tu profesión: programadores, diseñadores, oficina general.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Compra',
    author: 'Laura Martínez',
    date: '15 de Julio, 2025',
  },
  {
    slug: 'teclados-mecanicos-guia-switches-2025',
    title: 'Teclados Mecánicos: Guía Completa de Switches y Cómo Elegir en 2025',
    excerpt: 'Red, Brown o Blue. Lineal, táctil o clicky. Desmitificamos los switches mecánicos y te ayudamos a elegir el teclado perfecto.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Compra',
    author: 'Roberto Sánchez',
    date: '5 de Julio, 2025',
  },
  {
    slug: 'preparar-android-para-vender',
    title: 'Cómo Preparar tu Android para Vender: Checklist Completo 2025',
    excerpt: 'Protege tu información y maximiza el precio. Guía paso a paso para preparar tu Android antes de venderlo de forma segura.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Venta',
    author: 'Carlos Pérez',
    date: '28 de Junio, 2025',
  },
  {
    slug: 'evitar-estafas-comprar-tecnologia-usada',
    title: 'Cómo Evitar Estafas al Comprar Tecnología Usada: Señales de Alerta',
    excerpt: 'Identifica red flags, verifica IMEI, inspecciona físicamente. Protégete de clones, dispositivos robados y estafas comunes.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Compra',
    author: 'Ana García',
    date: '18 de Junio, 2025',
  },
  {
    slug: 'ssd-vs-hdd-cual-elegir-2025',
    title: 'SSD vs HDD en 2025: ¿Cuál Elegir para tu Computadora?',
    excerpt: 'Velocidad vs capacidad. Análisis completo de SSD y HDD: cuándo usar cada uno y configuraciones híbridas recomendadas.',
    image: 'https://via.placeholder.com/400x250',
    category: 'Guías de Compra',
    author: 'Roberto Sánchez',
    date: '8 de Junio, 2025',
  },
];

const featuredPost = mockPosts[0];
const recentPosts = mockPosts.slice(1);

const BlogHome = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Nuestro Blog</h1>
        <p>Consejos, guías y noticias del mundo de la tecnología reacondicionada.</p>
      </header>

      {/* Featured Post */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredImage}>
          <img src={featuredPost.image} alt={featuredPost.title} />
        </div>
        <div className={styles.featuredContent}>
          <span className={styles.featuredCategory}>{featuredPost.category}</span>
          <h2>{featuredPost.title}</h2>
          <p>{featuredPost.excerpt}</p>
          <Link href={`/blog/${featuredPost.slug}`} className={styles.readMoreButton}>Leer artículo completo</Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Últimos Artículos</h2>
        <div className={styles.grid}>
          {recentPosts.map(post => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogHome;
