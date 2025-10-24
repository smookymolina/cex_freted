import React, { useState } from 'react';
import { useCart } from '../../context/cart/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, AlertCircle, ShoppingBag } from 'lucide-react';

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

  return (
    <div
      className={`p-6 transition-all duration-200 ${
        isRemoving ? 'opacity-0 transform scale-95' : 'opacity-100'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Imagen y detalles del producto */}
        <div className="col-span-1 md:col-span-6">
          <div className="flex gap-4">
            {/* Imagen */}
            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/productos/${item.slug}`}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
              >
                {item.name}
              </Link>

              {/* Grade y categoría */}
              <div className="flex flex-wrap gap-2 mt-2">
                {item.grade && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Grade {item.grade}
                  </span>
                )}
                {item.category && (
                  <span className="text-xs text-gray-500">{item.category}</span>
                )}
              </div>

              {/* Advertencia de stock bajo */}
              {!hasStock && (
                <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Stock insuficiente (disponible: {item.stock})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Precio unitario */}
        <div className="col-span-1 md:col-span-2">
          <div className="md:text-center">
            <span className="md:hidden text-sm text-gray-600 mr-2">Precio:</span>
            <span className="font-semibold text-gray-900">
              {CURRENCY_FORMATTER.format(item.price)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <div className="text-xs text-gray-500 line-through">
                {CURRENCY_FORMATTER.format(item.originalPrice)}
              </div>
            )}
          </div>
        </div>

        {/* Controles de cantidad */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center justify-center gap-2">
            <span className="md:hidden text-sm text-gray-600 mr-2">Cantidad:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              {/* Botón decrementar */}
              <button
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>

              {/* Cantidad actual */}
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-12 text-center font-semibold text-gray-900 bg-white border-x border-gray-300"
                aria-label="Cantidad"
              />

              {/* Botón incrementar */}
              <button
                onClick={handleIncrease}
                disabled={item.quantity >= maxQuantity}
                className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Total y botón eliminar */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex md:flex-col items-center md:items-end gap-3">
            {/* Total */}
            <div className="flex-1 md:flex-none">
              <span className="md:hidden text-sm text-gray-600 mr-2">Total:</span>
              <span className="font-bold text-lg text-gray-900">
                {CURRENCY_FORMATTER.format(itemTotal)}
              </span>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
              aria-label="Eliminar producto"
              title="Eliminar del carrito"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
