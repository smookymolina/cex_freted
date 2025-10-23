import React from 'react';
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
          <a href={`/blog/${featuredPost.slug}`} className={styles.readMoreButton}>Leer artículo completo</a>
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
