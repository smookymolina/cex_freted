import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import styles from '../../styles/components/product-card.module.css';
import { useCart } from '../../context/cart/CartContext';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export default function ProductCard({ product }) {
  const { cart, addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = product?.variants?.[0];

  const cartItemId = useMemo(() => {
    if (!product?.slug || !selectedVariant?.grade) return null;
    return `${product.slug}-${selectedVariant.grade}`.toLowerCase();
  }, [product?.slug, selectedVariant?.grade]);

  const itemInCart = useMemo(() => {
    if (!cartItemId) return null;
    return cart.find((item) => item.id === cartItemId) ?? null;
  }, [cart, cartItemId]);

  const isOutOfStock =
    selectedVariant?.stock !== undefined && selectedVariant.stock < 1;

  useEffect(() => {
    if (!justAdded) return undefined;
    const timeout = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(timeout);
  }, [justAdded]);

  const handleAddToCart = () => {
    if (!selectedVariant || !cartItemId || isOutOfStock) {
      return;
    }

    const cartItem = {
      id: cartItemId,
      name: product.name,
      slug: product.slug,
      image: product.image,
      grade: selectedVariant.grade,
      category: product.category,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice ?? null,
      stock: selectedVariant.stock ?? null,
    };

    addToCart(cartItem, 1);
    setJustAdded(true);
  };

  if (!selectedVariant) {
    return null;
  }

  const buttonLabel = (() => {
    if (isOutOfStock) return 'Sin stock';
    if (justAdded) return 'Agregado al carrito';
    if (itemInCart) return 'Agregar otro';
    return 'Anadir al carrito';
  })();

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
        <div className={styles.priceContainer}>
          <span className={styles.price}>{CURRENCY_FORMATTER.format(selectedVariant.price)}</span>
          {selectedVariant.originalPrice && (
            <span className={styles.originalPrice}>
              {CURRENCY_FORMATTER.format(selectedVariant.originalPrice)}
            </span>
          )}
        </div>
        <div className={styles.tags}>
          <span>Garantia 12 meses</span>
          <span>Envio gratis</span>
        </div>
      </div>
      <footer className={styles.footer}>
        <Button
          onClick={handleAddToCart}
          fullWidth
          disabled={isOutOfStock}
          aria-disabled={isOutOfStock}
        >
          {buttonLabel}
        </Button>
        {itemInCart && (
          <p className={styles.cartHint} aria-live="polite">
            {`Tienes ${itemInCart.quantity} en el carrito`}
          </p>
        )}
        <Button href={`/productos/${product.slug}`} fullWidth variant="secondary">
          Ver detalles
        </Button>
      </footer>
    </article>
  );
}
