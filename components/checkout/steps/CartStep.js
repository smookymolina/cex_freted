
import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../../context/cart/CartContext';
import CartItemRow from '../../cart/CartItemRow';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const CartStep = ({ subtotal, shippingCost, total }) => {
  const { cart, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <>
        <div className="empty-cart">
          <ShoppingBag size={40} aria-hidden="true" />
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos certificados a tu carrito para iniciar el proceso de checkout.</p>
          <Link href="/comprar" className="link-button">
            Ir a comprar
          </Link>
        </div>

        <style jsx>{`
          .empty-cart {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 60px 20px;
            gap: 16px;
          }

          .empty-cart :global(svg) {
            color: rgba(15, 23, 42, 0.3);
          }

          .empty-cart h2 {
            margin: 0;
            font-size: 1.4rem;
            font-weight: 700;
            color: #0f172a;
          }

          .empty-cart p {
            margin: 0;
            font-size: 0.95rem;
            color: rgba(15, 23, 42, 0.65);
            max-width: 400px;
          }

          .link-button {
            padding: 14px 32px;
            margin-top: 16px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: #fff;
            border-radius: 12px;
            font-size: 0.95rem;
            font-weight: 600;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
            transition: all 0.2s ease;
          }

          .link-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <header className="step-header">
        <div className="step-header__label">
          <ShoppingBag aria-hidden="true" />
          <div>
            <h1>Verifica tus productos</h1>
            <p>Revisa cantidades y totales antes de continuar.</p>
          </div>
        </div>
        <Link href="/checkout/carrito" className="secondary-link">
          Abrir vista completa del carrito
        </Link>
      </header>

      <section className="cart-items">
        <div className="cart-items__header">
          <span>Producto</span>
          <span>Precio</span>
          <span>Cantidad</span>
          <span>Total</span>
        </div>
        <div className="cart-items__list">
          {cart.map((item) => (
            <CartItemRow key={`${item.id}-${item.slug}`} item={item} />
          ))}
        </div>
      </section>

      <aside className="order-summary">
        <h2>Resumen</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{CURRENCY_FORMATTER.format(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Envío estimado</span>
          <span>{shippingCost === 0 ? 'Sin costo' : CURRENCY_FORMATTER.format(shippingCost)}</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>{CURRENCY_FORMATTER.format(total)}</span>
        </div>
      </aside>

      <style jsx>{`
        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 16px;
        }

        .step-header__label {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .step-header__label > :global(svg) {
          width: 32px;
          height: 32px;
          color: #2563eb;
          flex-shrink: 0;
        }

        .step-header h1 {
          margin: 0 0 8px;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
        }

        .step-header p {
          margin: 0;
          font-size: 0.95rem;
          color: rgba(15, 23, 42, 0.65);
          line-height: 1.5;
        }

        .secondary-link {
          padding: 10px 20px;
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .secondary-link:hover {
          background: rgba(37, 99, 235, 0.15);
        }

        .cart-items {
          margin-bottom: 32px;
        }

        .cart-items__header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 16px;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 10px 10px 0 0;
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cart-items__list {
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 0 0 10px 10px;
          overflow: hidden;
        }

        .order-summary {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 2px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          padding: 24px;
          max-width: 480px;
        }

        .order-summary h2 {
          margin: 0 0 20px;
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(15, 23, 42, 0.1);
          font-size: 0.95rem;
          color: rgba(15, 23, 42, 0.75);
        }

        .summary-row:last-of-type {
          border-bottom: none;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 16px 0 0;
          margin-top: 12px;
          border-top: 2px solid rgba(15, 23, 42, 0.15);
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        @media (max-width: 768px) {
          .step-header {
            flex-direction: column;
          }

          .step-header h1 {
            font-size: 1.25rem;
          }

          .step-header__label {
            gap: 12px;
          }

          .step-header__label > :global(svg) {
            width: 24px;
            height: 24px;
          }

          .secondary-link {
            width: 100%;
            text-align: center;
          }

          .cart-items__header {
            display: none;
          }

          .summary-total {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </>
  );
};

export default CartStep;
