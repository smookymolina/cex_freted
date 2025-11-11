import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Lock, Tag, Truck, ShieldCheck, BadgeCheck, RefreshCcw } from 'lucide-react';
import { useCart } from '../../context/cart/CartContext';
import { isBuenFinActive, BUEN_FIN_PROMO } from '../../config/promotions';
import styles from '../../styles/components/cart-summary.module.css';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export default function CartSummary() {
  const { cart, cartCount } = useCart();
  const router = useRouter();
  const { status } = useSession();
  const buenFinActive = isBuenFinActive();

  const calculations = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const totalSavings = cart.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return sum + (item.originalPrice - item.price) * item.quantity;
      }
      return sum;
    }, 0);

    const buenFinDiscount = buenFinActive && subtotal > 0 ? BUEN_FIN_PROMO.extraDiscountAmount : 0;
    const subtotalWithDiscount = subtotal - buenFinDiscount;

    const shippingThreshold = 2000;
    const shipping = subtotalWithDiscount >= shippingThreshold ? 0 : 150;
    const freeShipping = subtotalWithDiscount >= shippingThreshold;
    const total = subtotalWithDiscount + shipping;

    return {
      subtotal,
      totalSavings,
      buenFinDiscount,
      shipping,
      freeShipping,
      shippingThreshold,
      total,
    };
  }, [cart, buenFinActive]);

  const shippingShortfall = Math.max(calculations.shippingThreshold - calculations.subtotal, 0);
  const isSessionLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const handleCheckout = () => {
    if (isSessionLoading || cartCount === 0) return;

    if (!isAuthenticated) {
      const callback = encodeURIComponent('/checkout');
      router.push(`/mi-cuenta/login?callbackUrl=${callback}`);
      return;
    }

    router.push('/checkout');
  };

  return (
    <aside className={styles.summaryCard}>
      <header className={styles.header}>
        <h2>Resumen del pedido</h2>
        <p>
          {cartCount === 1
            ? '1 articulo certificado listo para el pago.'
            : `${cartCount} articulos certificados listos para el pago.`}
        </p>
      </header>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>Subtotal</span>
          <span>{CURRENCY_FORMATTER.format(calculations.subtotal)}</span>
        </div>

        {calculations.totalSavings > 0 && (
          <div className={`${styles.row} ${styles.savingsRow}`}>
            <span>
              <Tag aria-hidden="true" />
              Ahorros aplicados
            </span>
            <span>-{CURRENCY_FORMATTER.format(calculations.totalSavings)}</span>
          </div>
        )}

        {calculations.buenFinDiscount > 0 && (
          <div className={`${styles.row} ${styles.buenFinRow}`}>
            <span className={styles.buenFinLabel}>
              <span className={styles.buenFinIcon}>🎁</span>
              {BUEN_FIN_PROMO.badge}
            </span>
            <span className={styles.buenFinAmount}>-{CURRENCY_FORMATTER.format(calculations.buenFinDiscount)}</span>
          </div>
        )}

        <div className={`${styles.row} ${styles.shippingRow}`}>
          <span>
            <Truck aria-hidden="true" />
            Envio
            {calculations.freeShipping && <span className={styles.shippingFree}> (gratis)</span>}
          </span>
          <span>
            {calculations.freeShipping
              ? 'Sin costo'
              : CURRENCY_FORMATTER.format(calculations.shipping)}
          </span>
        </div>
      </div>

      {!calculations.freeShipping && (
        <p className={styles.shippingMessage}>
          Te faltan <strong>{CURRENCY_FORMATTER.format(shippingShortfall)}</strong> para obtener envio sin costo.
        </p>
      )}

      <div className={styles.totalBlock}>
        <span className={styles.totalLabel}>Total estimado</span>
        <span className={styles.totalValue}>{CURRENCY_FORMATTER.format(calculations.total)}</span>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        className={styles.checkoutButton}
        disabled={cartCount === 0 || isSessionLoading}
      >
        Finalizar compra segura
      </button>

      {status === 'unauthenticated' && (
        <p className={styles.authReminder}>
          Debes iniciar sesión para completar tu compra. Tus productos se guardan automáticamente al acceder.
        </p>
      )}

      <div className={styles.subtext}>
        <Lock aria-hidden="true" />
        Pagos con cifrado SSL y proteccion antifraude
      </div>

      <Link href="/comprar" className={styles.secondaryLink}>
        Seguir explorando productos
      </Link>

      <div className={styles.benefits}>
        <div className={styles.benefitItem}>
          <ShieldCheck aria-hidden="true" />
          <span>Garantia CEX de 12 meses incluida en cada dispositivo.</span>
        </div>
        <div className={styles.benefitItem}>
          <BadgeCheck aria-hidden="true" />
          <span>Dispositivos certificados por tecnicos especializados.</span>
        </div>
        <div className={styles.benefitItem}>
          <RefreshCcw aria-hidden="true" />
          <span>Envio asegurado con seguimiento en tiempo real.</span>
        </div>
      </div>
    </aside>
  );
}
