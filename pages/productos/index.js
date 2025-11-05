import { useState, useMemo } from 'react';
import ProductCard from '../../components/product/ProductCard';
import { products } from '../../data/mock/products';
import styles from '../../styles/pages/productos.module.css';

export default function ProductosPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');

  // Extraer categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, []);

  // Extraer grados únicos de todas las variantes
  const grades = useMemo(() => {
    const gradesSet = new Set();
    products.forEach((product) => {
      product.variants?.forEach((variant) => {
        if (variant.grade) gradesSet.add(variant.grade);
      });
    });
    return ['all', ...Array.from(gradesSet).sort()];
  }, []);

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.slug?.toLowerCase().includes(query)
      );
    }

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filtro por grado
    if (selectedGrade !== 'all') {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => v.grade === selectedGrade)
      );
    }

    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-asc':
          return getMinPrice(a) - getMinPrice(b);
        case 'price-desc':
          return getMinPrice(b) - getMinPrice(a);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, selectedGrade, sortBy, searchQuery]);

  const getMinPrice = (product) => {
    if (!product.variants?.length) return 0;
    return Math.min(...product.variants.map((v) => v.price || 0));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.badge}>Catálogo</span>
            <h1 className={styles.title}>Productos Reacondicionados</h1>
            <p className={styles.subtitle}>
              Explora nuestra selección de productos certificados con garantía de 12 meses
            </p>
          </div>

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Buscar productos"
            />
          </div>
        </header>

        <div className={styles.filtersBar}>
          <div className={styles.filterGroup}>
            <label htmlFor="category-filter" className={styles.filterLabel}>
              Categoría:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todas</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="grade-filter" className={styles.filterLabel}>
              Grado:
            </label>
            <select
              id="grade-filter"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Todos</option>
              {grades.slice(1).map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="sort-filter" className={styles.filterLabel}>
              Ordenar:
            </label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="name">Nombre (A-Z)</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>

          <div className={styles.resultsCount}>
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No se encontraron productos</h2>
            <p>Intenta ajustar los filtros o la búsqueda</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedGrade('all');
                setSearchQuery('');
              }}
              className={styles.resetButton}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
