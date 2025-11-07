import { createContext, useContext, useReducer, useMemo, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = 'cex_freted_cart';

const initialState = {
  items: [],
};

const sanitizeItem = (item) => {
  if (!item || typeof item !== 'object' || !item.id) {
    return null;
  }

  const quantityRaw = Number.isFinite(item.quantity) ? item.quantity : Number(item.quantity ?? 1);
  const quantity = Number.isFinite(quantityRaw) ? Math.max(1, quantityRaw) : 1;

  const priceRaw = Number.isFinite(item.price) ? item.price : Number(item.price ?? 0);
  const originalPriceRaw =
    Number.isFinite(item.originalPrice) || item.originalPrice === null
      ? item.originalPrice
      : item.originalPrice != null
      ? Number(item.originalPrice)
      : null;

  return {
    id: item.id,
    name: item.name ?? item.title ?? '',
    slug: item.slug ?? '',
    price: Number.isFinite(priceRaw) ? priceRaw : 0,
    originalPrice: Number.isFinite(originalPriceRaw) ? originalPriceRaw : null,
    image: item.image ?? null,
    grade: item.grade ?? null,
    category: item.category ?? null,
    stock: Number.isFinite(item.stock) ? item.stock : null,
    quantity,
  };
};

const normalizeItems = (items = []) => {
  return items.map(sanitizeItem).filter(Boolean);
};

const deduplicateItems = (items = []) => {
  const itemMap = new Map();

  items.forEach((item) => {
    if (!item?.id) return;

    if (!itemMap.has(item.id)) {
      // Solo agrega si NO existe - mantiene el primero, ignora duplicados
      itemMap.set(item.id, { ...item });
    }
  });

  return Array.from(itemMap.values());
};

const mergeCartItems = (primary = [], secondary = []) => {
  const mergedMap = new Map();
  normalizeItems(primary).forEach((item) => {
    mergedMap.set(item.id, { ...item });
  });

  normalizeItems(secondary).forEach((item) => {
    if (mergedMap.has(item.id)) {
      const existing = mergedMap.get(item.id);
      mergedMap.set(item.id, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      mergedMap.set(item.id, { ...item });
    }
  });

  return Array.from(mergedMap.values());
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const sanitizedProduct = sanitizeItem({ ...product, quantity });
      if (!sanitizedProduct) {
        console.warn('El producto no es válido para el carrito', product);
        return state;
      }

      const existingProduct = state.items.find((item) => item.id === sanitizedProduct.id);

      if (existingProduct) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === sanitizedProduct.id
              ? { ...item, quantity: item.quantity + sanitizedProduct.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, sanitizedProduct],
      };
    }
    case 'DECREASE_QUANTITY': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items
          .map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item))
          .filter((item) => item.quantity > 0),
      };
    }
    case 'REMOVE_FROM_CART': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== productId),
      };
    }
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'SET_CART': {
      return {
        ...state,
        items: deduplicateItems(normalizeItems(action.payload)),
      };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session, status } = useSession();

  const isHydrated = useRef(false);
  const hasSyncedServer = useRef(false);
  const skipNextServerSync = useRef(false);
  const cartRef = useRef(initialState.items);

  useEffect(() => {
    cartRef.current = state.items;
  }, [state.items]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Protección contra múltiples ejecuciones
    if (isHydrated.current) return;

    try {
      const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        // Siempre normalizar y deduplicar al cargar (el reducer se encarga de deduplicar)
        dispatch({ type: 'SET_CART', payload: parsedItems });
      }
    } catch (error) {
      console.error('No se pudo leer el carrito almacenado', error);
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      isHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isHydrated.current || typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('No se pudo persistir el carrito en localStorage', error);
    }
  }, [state.items]);

  const persistCartToServer = async (items) => {
    try {
      await fetch('/api/user/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: normalizeItems(items) }),
      });
    } catch (error) {
      console.error('No se pudo guardar el carrito en el servidor', error);
    }
  };

  useEffect(() => {
    if (!isHydrated.current) return;

    if (status !== 'authenticated' || !session?.user?.id) {
      hasSyncedServer.current = false;
      return;
    }

    if (hasSyncedServer.current) return;

    const syncCart = async () => {
      try {
        const response = await fetch('/api/user/cart');
        let serverItems = [];

        if (response.ok) {
          const data = await response.json();
          serverItems = Array.isArray(data.items) ? data.items : [];
        }

        const mergedItems = mergeCartItems(serverItems, cartRef.current);

        dispatch({ type: 'SET_CART', payload: mergedItems });
        skipNextServerSync.current = true;

        await persistCartToServer(mergedItems);
        hasSyncedServer.current = true;
      } catch (error) {
        console.error('Error al sincronizar el carrito con la cuenta', error);
      }
    };

    syncCart();
  }, [status, session?.user?.id]);

  useEffect(() => {
    if (!isHydrated.current) return;
    if (status !== 'authenticated' || !session?.user?.id) return;
    if (!hasSyncedServer.current) return;

    if (skipNextServerSync.current) {
      skipNextServerSync.current = false;
      return;
    }

    persistCartToServer(state.items);
  }, [state.items, status, session?.user?.id]);

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity },
    });
  };

  const decreaseQuantity = (productId) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { productId } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartCount = useMemo(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [state.items]);

  const value = {
    cart: state.items,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    totalPrice,
    isAuthenticated: status === 'authenticated',
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
