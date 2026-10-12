import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(
        "aurelia-cart"
      );

      return savedCart
        ? JSON.parse(savedCart)
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "aurelia-cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  const addToCart = (
    product,
    quantity = 1,
    size = null
  ) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id &&
          item.size === size
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id &&
          item.size === size
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity,
          size,
        },
      ];
    });
  };

  const removeFromCart = (id, size) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size
          )
      )
    );
  };

  const updateQuantity = (
    id,
    size,
    quantity
  ) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id &&
        item.size === size
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const cartTotal = cartSubtotal;

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}