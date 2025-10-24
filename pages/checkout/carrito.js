import React from 'react';
import { useCart } from '../../context/cart/CartContext';
import CartItemRow from '../../components/cart/CartItemRow';
import CartSummary from '../../components/cart/CartSummary';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CarritoPage() {
  const { cart, cartCount, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/comprar"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Continuar comprando</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Tu Carrito de Compras
          </h1>
          <p className="text-gray-600 mt-1">
            {cartCount === 0
              ? 'Tu carrito está vacío'
              : `${cartCount} ${cartCount === 1 ? 'artículo' : 'artículos'} en tu carrito`}
          </p>
        </div>

        {/* Contenido */}
        {cart.length === 0 ? (
          /* Carrito vacío */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 mb-6">
              Agrega productos a tu carrito para continuar
            </p>
            <Link
              href="/comprar"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Productos
            </Link>
          </div>
        ) : (
          /* Carrito con productos */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Header de tabla */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                  <div className="col-span-6">Producto</div>
                  <div className="col-span-2 text-center">Precio</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Productos */}
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* Botón limpiar carrito */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
                      clearCart();
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* Resumen del carrito */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
