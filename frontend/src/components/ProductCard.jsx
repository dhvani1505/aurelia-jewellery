import { Heart, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useWishlist } from "../WishlistContext";

function ProductCard({ product, index = 0 }) {
  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const saved = isInWishlist(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
      }}
      className="group"
    >
      <div className="relative overflow-hidden bg-[#f0ece5] aspect-[4/5]">

        {/* Product Image */}

        <Link to={`/product/${product.id}`}>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.8 }}
          />
        </Link>


        {/* Badge */}

        {product.badge && (
          <span
            className="
              absolute
              top-4
              left-4
              bg-white
              px-3
              py-1.5
              text-[8px]
              tracking-[0.15em]
              uppercase
              z-10
            "
          >
            {product.badge}
          </span>
        )}


        {/* Wishlist */}

        <motion.button
          type="button"
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          animate={{
            scale: saved ? [1, 1.15, 1] : 1,
          }}
          transition={{
            duration: 0.25,
          }}
          aria-label={
            saved
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`
            absolute
            top-4
            right-4
            w-9
            h-9
            rounded-full
            flex
            items-center
            justify-center
            z-20
            transition-all
            duration-300

            ${
              saved
                ? "bg-[#171513] text-white opacity-100"
                : "bg-white text-[#171513] opacity-0 group-hover:opacity-100 hover:bg-[#171513] hover:text-white"
            }
          `}
        >
          <Heart
            size={16}
            strokeWidth={1.3}
            fill={saved ? "currentColor" : "none"}
          />
        </motion.button>


        {/* Quick View */}

        <Link
          to={`/product/${product.id}`}
          className="
            absolute
            bottom-0
            left-0
            right-0
            bg-white/95
            backdrop-blur
            py-4
            text-center
            translate-y-full
            group-hover:translate-y-0
            transition-transform
            duration-500
            z-10
          "
        >
          <span
            className="
              text-[9px]
              tracking-[0.2em]
              uppercase
            "
          >
            View Details
          </span>
        </Link>

      </div>


      {/* Product Info */}

      <div className="pt-5">

        <p
          className="
            text-[9px]
            tracking-[0.18em]
            uppercase
            text-[#9a948c]
            mb-2
          "
        >
          {product.category}
        </p>


        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="font-serif text-xl font-medium">
              {product.name}
            </h3>

            <p className="text-xs text-[#817b73] mt-1">
              {product.material}
            </p>

          </div>


          <ArrowUpRight
            size={17}
            strokeWidth={1.2}
            className="
              opacity-0
              group-hover:opacity-100
              transition-opacity
            "
          />

        </div>


        <p className="text-sm mt-3">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

      </div>

    </motion.div>
  );
}

export default ProductCard;