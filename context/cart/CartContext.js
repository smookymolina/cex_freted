
import { createContext, useContext, useReducer, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

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
      } else {
        return {
          ...state,
          items: [...state.items, { ...product, quantity }],
        };
      }
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
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
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
