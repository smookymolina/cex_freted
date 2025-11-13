import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import styles from '../../styles/components/product-card.module.css';
import { useCart } from '../../context/cart/CartContext';
import { BUEN_FIN_PROMO } from '../../config/promotions';
import FinancingBadge from './FinancingBadge';
import { getFinancingInfo, formatMonthlyPayment } from '../../utils/financing';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export default function ProductCard({ product }) {
  const { cart, addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (!variants.length) return 0;
    const firstAvailable = variants.findIndex(
      (variant) => variant?.stock === undefined || variant.stock > 0
    );
    return firstAvailable >= 0 ? firstAvailable : 0;
  });

  useEffect(() => {
    if (!variants.length) return;
    const firstAvailable = variants.findIndex(
      (variant) => variant?.stock === undefined || variant.stock > 0
    );
    setSelectedIndex((current) => {
      if (variants[current]) return current;
      return firstAvailable >= 0 ? firstAvailable : 0;
    });
  }, [product?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedVariant = variants[selectedIndex] ?? variants[0] ?? null;
  const imageSrc =
    product?.image && product.image.trim().length > 0
      ? product.image
      : '/assets/images/placeholder-base.png';
  const buenFinActive = Boolean(product?.buenFinApplied);
  const buenFinSavings = buenFinActive
    ? selectedVariant?.buenFinSavings ?? product?.buenFinSavings ?? null
    : null;

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

  // Calcular información de financiamiento
  const financingInfo = useMemo(() => {
    if (!product || !selectedVariant?.price) return null;
    return getFinancingInfo(product, selectedVariant.price);
  }, [product, selectedVariant?.price]);

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
      image: imageSrc,
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
            src={imageSrc}
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
        {buenFinActive && buenFinSavings && (
          <div className={styles.promoFlag}>
            {BUEN_FIN_PROMO.badge}: {CURRENCY_FORMATTER.format(buenFinSavings)} extra aplicado
          </div>
        )}
        {financingInfo && (
          <FinancingBadge
            months={financingInfo.months}
            monthlyPayment={formatMonthlyPayment(financingInfo.monthlyPayment)}
          />
        )}
        {variants.length > 1 && (
          <div className={styles.variantSelector} role="radiogroup" aria-label="Seleccionar grado">
            {variants.map((variant, index) => {
              const isSelected = index === selectedIndex;
              const variantOutOfStock =
                variant?.stock !== undefined && variant.stock < 1;

              return (
                <button
                  key={`${product.slug}-${variant.grade}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={variantOutOfStock}
                  className={[
                    styles.variantOption,
                    isSelected ? styles.variantOptionSelected : '',
                    variantOutOfStock ? styles.variantOptionDisabled : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelectedIndex(index)}
                >
                  <span className={styles.variantLabel}>Grade {variant.grade}</span>
                  <span className={styles.variantPrice}>
                    {CURRENCY_FORMATTER.format(variant.price)}
                  </span>
                  {buenFinActive && variant.buenFinSavings && (
                    <span className={styles.variantPromo}>
                      -{CURRENCY_FORMATTER.format(variant.buenFinSavings)} Buen Fin extra
                    </span>
                  )}
                  {variantOutOfStock ? (
                    <span className={styles.variantStock}>Sin stock</span>
                  ) : (
                    <span className={styles.variantStock}>
                      {variant.stock !== null && variant.stock !== undefined
                        ? `${variant.stock} en inventario`
                        : 'Stock disponible'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
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
