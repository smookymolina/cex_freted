import React, { useMemo } from 'react';
import { useCart } from '../../context/cart/CartContext';
import Link from 'next/link';
import { Lock, Tag, Truck } from 'lucide-react';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export default function CartSummary() {
  const { cart, totalPrice, cartCount } = useCart();

  // Calcular totales y descuentos
  const calculations = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Calcular ahorro total (si hay originalPrice)
    const totalSavings = cart.reduce((sum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return sum + ((item.originalPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);

    // Envío (gratis para compras mayores a $2000)
    const shippingThreshold = 2000;
    const shipping = subtotal >= shippingThreshold ? 0 : 150;
    const freeShipping = subtotal >= shippingThreshold;

    // Total final
    const total = subtotal + shipping;

    return {
      subtotal,
      totalSavings,
      shipping,
      freeShipping,
      shippingThreshold,
      total,
    };
  }, [cart]);

  return (
    <div className="bg-white rounded-lg shadow-sm sticky top-4">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Resumen del Pedido</h2>
        <p className="text-sm text-gray-500 mt-1">
          {cartCount} {cartCount === 1 ? 'artículo' : 'artículos'}
        </p>
      </div>

      {/* Detalles */}
      <div className="px-6 py-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-900">
            {CURRENCY_FORMATTER.format(calculations.subtotal)}
          </span>
        </div>

        {/* Ahorros */}
        {calculations.totalSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Ahorros
            </span>
            <span className="font-semibold text-green-600">
              -{CURRENCY_FORMATTER.format(calculations.totalSavings)}
            </span>
          </div>
        )}

        {/* Envío */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Envío
          </span>
          {calculations.freeShipping ? (
            <span className="font-semibold text-green-600">GRATIS</span>
          ) : (
            <span className="font-semibold text-gray-900">
              {CURRENCY_FORMATTER.format(calculations.shipping)}
            </span>
          )}
        </div>

        {/* Mensaje de envío gratis */}
        {!calculations.freeShipping && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
            <p className="text-blue-800">
              Te faltan{' '}
              <span className="font-bold">
                {CURRENCY_FORMATTER.format(
                  calculations.shippingThreshold - calculations.subtotal
                )}
              </span>{' '}
              para <span className="font-bold">envío gratis</span>
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3">
          {/* Total */}
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              {CURRENCY_FORMATTER.format(calculations.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Botón de proceder al pago */}
      <div className="px-6 py-4 border-t border-gray-200">
        <Link
          href="/checkout"
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          Proceder al Pago
        </Link>

        {/* Compra segura */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Compra 100% segura y protegida</span>
        </div>

        {/* Continuar comprando */}
        <Link
          href="/comprar"
          className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-3 hover:underline"
        >
          Continuar comprando
        </Link>
      </div>

      {/* Beneficios */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-y-2">
        <div className="flex items-start gap-3 text-xs text-gray-700">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>30 días de garantía</span>
        </div>
        <div className="flex items-start gap-3 text-xs text-gray-700">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Productos certificados y verificados</span>
        </div>
        <div className="flex items-start gap-3 text-xs text-gray-700">
          <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Soporte técnico incluido</span>
        </div>
      </div>
    </div>
  );
}
