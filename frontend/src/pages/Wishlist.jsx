import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useWishlist } from "../WishlistContext";
import { useCart } from "../CartContext";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function Wishlist() {
  const {
    wishlistItems,
    wishlistCount,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToBag = (product) => {
    addToCart(product, 1, null);
  };

  return (
    <main className="min-h-screen bg-[#faf8f4]">

      {/* =====================================
          HEADER
      ===================================== */}

      <section className="border-b border-black/[0.06]">

        <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-16 md:py-20">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <p className="text-[10px] tracking-[0.35em] uppercase text-[#b08d57]">
              Aurelia
            </p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

              <h1 className="font-serif text-5xl md:text-7xl font-light mt-3">
                Wishlist
              </h1>

              <p className="text-xs tracking-[0.15em] uppercase text-[#817b73]">
                {wishlistCount}{" "}
                {wishlistCount === 1
                  ? "Piece"
                  : "Pieces"}
              </p>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================
          EMPTY WISHLIST
      ===================================== */}

      {wishlistItems.length === 0 ? (

        <section className="min-h-[55vh] flex items-center justify-center px-6">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center max-w-md"
          >

            <div className="w-20 h-20 mx-auto rounded-full bg-[#eee9e1] flex items-center justify-center">

              <Heart
                size={29}
                strokeWidth={1}
              />

            </div>

            <p className="text-[10px] tracking-[0.3em] uppercase text-[#b08d57] mt-8">
              Your Collection
            </p>

            <h2 className="font-serif text-4xl md:text-5xl mt-3">
              Nothing saved yet
            </h2>

            <p className="text-sm text-[#756f67] leading-7 mt-5">
              Save the pieces you love and come back
              to them whenever you're ready.
            </p>

            <Link
              to="/shop"
              className="
                inline-flex
                items-center
                gap-3
                mt-8
                bg-[#171513]
                text-white
                px-8
                py-4
                text-[10px]
                tracking-[0.2em]
                uppercase
                hover:bg-[#b08d57]
                transition-colors
              "
            >
              Discover Jewellery

              <ArrowRight
                size={14}
                strokeWidth={1.2}
              />

            </Link>

          </motion.div>

        </section>

      ) : (

        /* =====================================
           PRODUCTS
        ===================================== */

        <section className="max-w-[1400px] mx-auto px-5 md:px-8 py-12 md:py-16">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">

            <AnimatePresence mode="popLayout">

              {wishlistItems.map((product, index) => (

                <motion.article
                  key={product.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                >

                  {/* IMAGE */}

                  <div className="relative aspect-[4/5] bg-[#eee9e1] overflow-hidden group">

                    <Link
                      to={`/product/${product.id}`}
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                        className="
                          w-full
                          h-full
                          object-cover
                          group-hover:scale-105
                          transition-transform
                          duration-700
                        "
                      />

                    </Link>


                    {/* REMOVE */}

                    <button
                      onClick={() =>
                        removeFromWishlist(
                          product.id
                        )
                      }
                      className="
                        absolute
                        top-4
                        right-4
                        w-9
                        h-9
                        rounded-full
                        bg-white/90
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        hover:bg-black
                        hover:text-white
                        transition-colors
                      "
                      aria-label="Remove from wishlist"
                    >

                      <Trash2
                        size={15}
                        strokeWidth={1.2}
                      />

                    </button>

                  </div>


                  {/* INFO */}

                  <div className="pt-4">

                    <p className="text-[9px] tracking-[0.18em] uppercase text-[#b08d57]">
                      {product.category}
                    </p>

                    <Link
                      to={`/product/${product.id}`}
                      className="font-serif text-xl mt-1 block hover:text-[#b08d57] transition-colors"
                    >
                      {product.name}
                    </Link>

                    <p className="text-sm mt-2">
                      {formatPrice(product.price)}
                    </p>


                    {/* ADD TO BAG */}

                    <button
                      onClick={() =>
                        handleAddToBag(product)
                      }
                      className="
                        mt-4
                        w-full
                        border
                        border-black/15
                        py-3
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-[9px]
                        tracking-[0.18em]
                        uppercase
                        hover:bg-[#171513]
                        hover:text-white
                        transition-colors
                      "
                    >

                      <ShoppingBag
                        size={14}
                        strokeWidth={1.2}
                      />

                      Add to Bag

                    </button>

                  </div>

                </motion.article>

              ))}

            </AnimatePresence>

          </div>

        </section>

      )}

    </main>
  );
}

export default Wishlist;