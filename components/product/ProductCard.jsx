
import Image from 'next/image';
import Button from '../ui/Button';
import styles from '../../styles/components/product-card.module.css';
import { useCart } from '../../context/cart/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  // TODO: Implement logic to select grade and update price
  const selectedVariant = product.variants[0];

  const handleAddToCart = () => {
    addToCart(selectedVariant);
  };

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.badge}>{selectedVariant.grade}</div>
        <div className={styles.imageWrapper}>
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className={styles.image}
          />
        </div>
      </header>
      <div className={styles.content}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        {/* TODO: Add rating component */}
        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatter.format(selectedVariant.price)}</span>
          {selectedVariant.originalPrice && (
            <span className={styles.originalPrice}>{formatter.format(selectedVariant.originalPrice)}</span>
          )}
        </div>
        <div className={styles.tags}>
          <span>Garantía 12 meses</span>
          <span>Envío gratis</span>
        </div>
      </div>
      <footer className={styles.footer}>
        <Button onClick={handleAddToCart} fullWidth>
          Añadir al carrito
        </Button>
        <Button href={`/productos/${product.slug}`} fullWidth variant="secondary">
          Ver detalles
        </Button>
      </footer>
    </article>
  );
}
