import React from 'react';
import styles from '../../styles/components/BlogPostPage.module.css';

// Mock Data
const mockPost = {
    slug: 'guia-comprar-iphone-reacondicionado',
    title: 'Guía Definitiva para Comprar un iPhone Reacondicionado en 2025',
    image: 'https://via.placeholder.com/800x400',
    category: 'Guías de Compra',
    author: 'Ana García',
    date: '22 de Octubre, 2025',
    content: `
      <p>Comprar un iPhone reacondicionado es una excelente manera de ahorrar dinero y ser más sostenible. Pero, ¿qué debes tener en cuenta para hacer una compra inteligente? En esta guía, te lo contamos todo.</p>
      <h2>1. ¿Qué significa "Reacondicionado"?</h2>
      <p>No es lo mismo que "de segunda mano". Un dispositivo reacondicionado ha sido revisado, reparado y limpiado por profesionales para asegurar que funciona perfectamente. En CEX, todos nuestros productos pasan una certificación de 30 puntos.</p>
      <h2>2. Revisa la Salud de la Batería</h2>
      <p>Uno de los componentes que más sufre con el uso es la batería. Asegúrate de que el vendedor garantice un mínimo de salud de batería. Nosotros garantizamos más del 85% en todos nuestros iPhones certificados.</p>
      <h2>3. Entiende los Grados Estéticos</h2>
      <p>Los grados (Como Nuevo, Muy Bueno, Bueno) se refieren solo al aspecto exterior. Un teléfono de grado "Bueno" puede tener rasguños visibles, pero funcionará tan bien como uno "Como Nuevo". Elige el grado que se ajuste a tu presupuesto y tus exigencias estéticas.</p>
      <p>Esperamos que esta guía te ayude a realizar tu próxima compra con total confianza. ¡Explora nuestro catálogo de iPhones reacondicionados y encuentra el tuyo!</p>
    `
};

const BlogPostPage = ({ post }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.category}>{post.category}</span>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span>Por {post.author}</span> | <span>{post.date}</span>
        </div>
      </header>
      <img src={post.image} alt={post.title} className={styles.mainImage} />
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default BlogPostPage;
