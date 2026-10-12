import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] =
    useState(() => {
      try {
        const savedWishlist =
          localStorage.getItem(
            "aurelia-wishlist"
          );

        return savedWishlist
          ? JSON.parse(savedWishlist)
          : [];
      } catch {
        return [];
      }
    });

  useEffect(() => {
    localStorage.setItem(
      "aurelia-wishlist",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item.id === productId
    );
  };

  const toggleWishlist = (product) => {
    setWishlistItems((currentItems) => {
      const exists = currentItems.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return currentItems.filter(
          (item) => item.id !== product.id
        );
      }

      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}