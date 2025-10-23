import { useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { products } from '../../data/mock/products';
import styles from '../../styles/pages/comprar.module.css';

const categories = ['All', ...new Set(products.map((p) => p.category))];

export default function ComprarPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className={styles.comprarPage}>
      <header className={styles.header}>
        <h1>Explora Nuestro Catálogo</h1>
        <p>Calidad y garantía en cada producto. Encuentra lo que buscas, al mejor precio.</p>
      </header>

      <main className={styles.mainContent}>
        <aside className={styles.filters}>
          <h3>Categorías</h3>
          <div className={styles.categoryFilters}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        <section className={styles.productList}>
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
