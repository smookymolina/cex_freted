import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/cart/CartContext';
import styles from '../../styles/components/cart-item.module.css';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export default function CartItemRow({ item }) {
  const { addToCart, decreaseQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);

  const itemTotal = item.price * item.quantity;
  const hasStock = item.stock === null || item.stock >= item.quantity;
  const maxQuantity = item.stock ?? 99;
  const imageSrc =
    item?.image && item.image.trim().length > 0
      ? item.image
      : '/assets/images/placeholder-base.png';

  const handleIncrease = () => {
    if (item.quantity < maxQuantity) {
      addToCart(item, 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      decreaseQuantity(item.id);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart(item.id);
    }, 200);
  };

  const isLowStock =
    typeof item.stock === 'number' && item.stock > 0 && item.stock <= 5;

  return (
    <article
      className={`${styles.itemRow} ${isRemoving ? styles.removing : ''}`}
      aria-label={`Producto ${item.name}`}
    >
      <div className={styles.productColumn}>
        <div className={styles.media}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              sizes="(min-width: 900px) 108px, (min-width: 600px) 96px, 88px"
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder}>
              <ShoppingBag aria-hidden="true" />
            </div>
          )}
        </div>

        <div className={styles.info}>
          <Link href={`/productos/${item.slug}`} className={styles.name}>
            {item.name}
          </Link>

          <div className={styles.meta}>
            {item.grade && (
              <span className={styles.gradeBadge}>Grade {item.grade}</span>
            )}
            {item.category && (
              <span className={styles.category}>{item.category}</span>
            )}
          </div>

          {!hasStock && (
            <span className={styles.stockWarning}>
              <AlertCircle aria-hidden="true" />
              Stock insuficiente (disponible: {item.stock})
            </span>
          )}
        </div>
      </div>

      <div className={styles.priceColumn}>
        <span className={styles.columnLabel}>Precio unitario</span>
        <span className={styles.priceValue}>
          {CURRENCY_FORMATTER.format(item.price)}
        </span>
        {item.originalPrice && item.originalPrice > item.price && (
          <span className={styles.originalPrice}>
            {CURRENCY_FORMATTER.format(item.originalPrice)}
          </span>
        )}
      </div>

      <div className={styles.quantityColumn}>
        <span className={styles.columnLabel}>Cantidad</span>
        <div
          className={styles.quantityControl}
          role="group"
          aria-label={`Modificar cantidad de ${item.name}`}
        >
          <button
            type="button"
            onClick={handleDecrease}
            disabled={item.quantity <= 1}
            className={styles.quantityButton}
            aria-label="Reducir cantidad"
          >
            <Minus aria-hidden="true" />
          </button>
          <span className={styles.quantityValue} aria-live="polite">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={item.quantity >= maxQuantity}
            className={styles.quantityButton}
            aria-label="Aumentar cantidad"
          >
            <Plus aria-hidden="true" />
          </button>
        </div>
        {isLowStock && hasStock && (
          <span className={styles.stockHint}>
            Ultimas {item.stock} piezas!
          </span>
        )}
      </div>

      <div className={styles.totalColumn}>
        <span className={styles.columnLabel}>Total</span>
        <span className={styles.totalValue}>
          {CURRENCY_FORMATTER.format(itemTotal)}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className={styles.removeButton}
          aria-label={`Eliminar ${item.name} del carrito`}
        >
          <Trash2 aria-hidden="true" />
          <span>Eliminar</span>
        </button>
      </div>
    </article>
  );
}
