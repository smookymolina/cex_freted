import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/cart/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function CartIcon({ className = '', showLabel = false }) {
  const { cartCount } = useCart();

  return (
    <Link
      href="/checkout/carrito"
      className={`relative inline-flex items-center gap-2 group transition-all duration-200 hover:scale-105 ${className}`}
      aria-label={`Carrito de compras con ${cartCount} artículos`}
    >
      {/* Icono del carrito */}
      <div className="relative">
        <ShoppingCart
          className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-200"
          strokeWidth={2}
        />

        {/* Badge con contador animado */}
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold shadow-lg animate-bounce-subtle">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}

        {/* Indicador de pulse cuando hay items */}
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          </span>
        )}
      </div>

      {/* Etiqueta opcional */}
      {showLabel && (
        <span className="hidden md:inline-block text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
          Carrito
          {cartCount > 0 && (
            <span className="ml-1 text-xs text-gray-500">
              ({cartCount})
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
