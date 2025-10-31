import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/cart/CartContext";
import CartItemRow from "../../components/cart/CartItemRow";
import CartSummary from "../../components/cart/CartSummary";
import commonStyles from "../../styles/components/common.module.css";
import styles from "../../styles/pages/cart.module.css";

export default function CarritoPage() {
  const { cart, cartCount, clearCart } = useCart();

  const cartDescription =
    cartCount === 0
      ? "Todavia no has agregado productos. Empieza seleccionando el dispositivo ideal para ti."
      : `Tienes ${cartCount} ${cartCount === 1 ? "articulo" : "articulos"} listos para revisar antes del pago.`;

  const handleClearCart = () => {
    if (typeof window === "undefined") return;
    const confirmed = window.confirm("Seguro que quieres vaciar el carrito?");
    if (confirmed) {
      clearCart();
    }
  };

  return (
    <div className={commonStyles.pageContainer}>
      <div className={commonStyles.pageInner}>
        <header className={styles.pageHeader}>
          <div className={styles.headerTop}>
            <Link href="/comprar" className={styles.backLink}>
              <ArrowLeft aria-hidden="true" />
              <span>Seguir explorando productos</span>
            </Link>
          </div>

          <div className={styles.headline}>
            <div className={styles.headlineIcon}>
              <ShoppingBag aria-hidden="true" />
            </div>
            <div>
              <h1>Tu carrito certificado</h1>
              <p>{cartDescription}</p>
            </div>
          </div>
        </header>

        {cart.length === 0 ? (
          <section className={styles.emptyState} aria-labelledby="empty-cart-title">
            <div className={styles.emptyIcon}>
              <ShoppingBag aria-hidden="true" />
            </div>
            <h2 id="empty-cart-title">Tu carrito esta vacio</h2>
            <p>Guarda tus dispositivos favoritos y finaliza tu compra cuando estes listo.</p>
            <Link href="/comprar">Descubrir productos certificados</Link>
            <p className={styles.emptySecondary}>
              Cada dispositivo esta verificado y listo para enviarse en 24 horas.
            </p>
          </section>
        ) : (
          <section className={styles.cartLayout} aria-label="Productos en tu carrito">
            <div className={styles.itemsPanel}>
              <div className={styles.listCard}>
                <div className={styles.listHeader} role="presentation">
                  <span>Producto</span>
                  <span>Precio</span>
                  <span>Cantidad</span>
                  <span>Total</span>
                </div>

                <div className={styles.itemsList}>
                  {cart.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <button type="button" onClick={handleClearCart} className={styles.clearButton}>
                Vaciar carrito
              </button>
            </div>

            <aside className={styles.summaryPanel}>
              <CartSummary />
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}
