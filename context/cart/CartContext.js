import { createContext, useContext, useReducer, useMemo, useEffect, useRef } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = 'cex_freted_cart';

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingProduct = state.items.find((item) => item.id === product.id);

      if (existingProduct) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...product, quantity }],
      };
    }
    case 'DECREASE_QUANTITY': {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          )
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
        items: action.payload,
      };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const isHydrated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems)) {
          dispatch({ type: 'SET_CART', payload: parsedItems });
        }
      }
    } catch (error) {
      console.error('Failed to parse stored cart data', error);
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
      console.error('Failed to persist cart data', error);
    }
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    if (!product?.id) {
      console.warn('Attempted to add a cart item without an "id". Item ignored.', product);
      return;
    }

    const sanitizedProduct = {
      id: product.id,
      name: product.name ?? product.title ?? '',
      slug: product.slug ?? '',
      price:
        typeof product.price === 'number'
          ? product.price
          : Number(product.price ?? 0),
      originalPrice:
        typeof product.originalPrice === 'number' ? product.originalPrice : null,
      image: product.image ?? null,
      grade: product.grade ?? null,
      category: product.category ?? null,
      stock: typeof product.stock === 'number' ? product.stock : null,
    };

    dispatch({ type: 'ADD_TO_CART', payload: { product: sanitizedProduct, quantity } });
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
