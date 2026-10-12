
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { motion } from "framer-motion";

import ProductCard from "../components/ProductCard";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import api from "../api";


function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();


  // =========================================
  // PRODUCT
  // =========================================

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================
  // PRODUCT OPTIONS
  // =========================================

  const [quantity, setQuantity] = useState(1);

  const [selectedSize, setSelectedSize] =
    useState("7");


  // =========================================
  // UI
  // =========================================

  const [added, setAdded] = useState(false);

  const [openSection, setOpenSection] =
    useState("description");

  const [relatedProducts, setRelatedProducts] =
    useState([]);


  // =========================================
  // LOAD PRODUCT
  // =========================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(`/products/${id}`);

        const data = response.data.product;

        if (!data) {
          throw new Error(
            "Product not found"
          );
        }

        const formattedProduct = {
          ...data,

          image:
            data.image_url,

          category:
            data.category_name,

          comparePrice:
            data.compare_price,

          stock:
            Number(data.quantity || 0),
        };

        setProduct(formattedProduct);

      } catch (err) {
        console.error(
          "Failed to load product:",
          err
        );

        setProduct(null);

        setError(
          "Unable to load this jewellery piece."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);


  // =========================================
  // LOAD RELATED PRODUCTS
  // =========================================

  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product) {
        return;
      }

      try {
        const response =
          await api.get("/products");

        const allProducts =
          response.data.products || [];

        const related =
          allProducts
            .filter(
              (item) =>
                Number(item.id) !==
                  Number(product.id) &&
                item.category_name ===
                  product.category
            )
            .slice(0, 4)
            .map((item) => ({
              ...item,

              image:
                item.image_url,

              category:
                item.category_name,

              comparePrice:
                item.compare_price,

              stock:
                Number(item.quantity || 0),
            }));

        setRelatedProducts(related);

      } catch (err) {
        console.error(
          "Failed to load related products:",
          err
        );
      }
    };

    loadRelatedProducts();
  }, [product]);


  // =========================================
  // WISHLIST
  // =========================================

  const saved = product
    ? isInWishlist(product.id)
    : false;


  // =========================================
  // QUANTITY
  // =========================================

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };


  const increaseQuantity = () => {
    if (!product) return;

    setQuantity((current) =>
      Math.min(
        product.stock || 1,
        current + 1
      )
    );
  };


  // =========================================
  // ADD TO BAG
  // =========================================

  const handleAddToBag = () => {
    if (!product) {
      return;
    }

    if (product.stock <= 0) {
      return;
    }

    if (quantity > product.stock) {
      setQuantity(product.stock);
      return;
    }

    addToCart(
      product,
      quantity,
      selectedSize
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2200);
  };


  // =========================================
  // WISHLIST
  // =========================================

  const handleWishlist = () => {
    if (!product) {
      return;
    }

    toggleWishlist(product);
  };


  // =========================================
  // ACCORDION
  // =========================================

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section
        ? null
        : section
    );
  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center"
        >

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border border-[#b08d57] border-t-transparent" />

          <p className="mt-6 text-[10px] tracking-[0.3em] uppercase text-[#8b857d]">
            Preparing your piece...
          </p>

        </motion.div>

      </main>
    );
  }


  // =========================================
  // ERROR
  // =========================================

  if (!product || error) {
    return (
      <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center"
        >

          <p className="text-[10px] tracking-[0.35em] uppercase text-[#b08d57] mb-5">
            Aurelia
          </p>

          <h1 className="font-serif text-5xl md:text-6xl font-light">
            Piece not found
          </h1>

          <p className="max-w-md mx-auto mt-6 text-sm leading-7 text-[#756f67]">
            {error ||
              "This jewellery piece is no longer available."}
          </p>

          <Link
            to="/shop"
            className="
              inline-flex
              items-center
              gap-3
              mt-9
              border-b
              border-black
              pb-2
              text-[10px]
              tracking-[0.2em]
              uppercase
              hover:text-[#b08d57]
              hover:border-[#b08d57]
              transition-colors
            "
          >

            <ArrowLeft
              size={14}
              strokeWidth={1.2}
            />

            Back to Jewellery

          </Link>

        </motion.div>

      </main>
    );
  }


  // =========================================
  // PRODUCT DATA
  // =========================================

  const stock = Number(
    product.stock || 0
  );

  const isOutOfStock = stock <= 0;

  const isLowStock =
    stock > 0 && stock <= 5;


  return (
    <main className="min-h-screen bg-[#faf8f4]">

      {/* =====================================
          BREADCRUMB
      ===================================== */}

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-7">

        <Link
          to="/shop"
          className="
            inline-flex
            items-center
            gap-2
            text-[9px]
            tracking-[0.2em]
            uppercase
            text-[#8c867e]
            hover:text-[#b08d57]
            transition-colors
          "
        >

          <ArrowLeft
            size={13}
            strokeWidth={1.2}
          />

          Back to Jewellery

        </Link>

      </div>


      {/* =====================================
          PRODUCT
      ===================================== */}

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* =================================
              IMAGE
          ================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            <div className="relative overflow-hidden bg-[#eee9e1] aspect-[4/5]">

              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{
                  scale: 1.04,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  duration: 1.1,
                }}
              />

              {/* BADGE */}

              {product.badge && (
                <span className="
                  absolute
                  top-5
                  left-5
                  bg-white
                  px-4
                  py-2
                  text-[8px]
                  tracking-[0.18em]
                  uppercase
                ">
                  {product.badge}
                </span>
              )}

              {/* STOCK */}

              {isLowStock && (
                <span className="
                  absolute
                  bottom-5
                  left-5
                  bg-[#171513]
                  text-white
                  px-4
                  py-2
                  text-[8px]
                  tracking-[0.18em]
                  uppercase
                ">
                  Only {stock} left
                </span>
              )}

              {isOutOfStock && (
                <span className="
                  absolute
                  bottom-5
                  left-5
                  bg-[#171513]
                  text-white
                  px-4
                  py-2
                  text-[8px]
                  tracking-[0.18em]
                  uppercase
                ">
                  Sold Out
                </span>
              )}

            </div>

          </motion.div>


          {/* =================================
              PRODUCT INFORMATION
          ================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="lg:pt-8"
          >

            {/* CATEGORY */}

            <p className="text-[9px] tracking-[0.3em] uppercase text-[#b08d57] mb-5">
              {product.category}
            </p>


            {/* NAME */}

            <div className="flex items-start justify-between gap-5">

              <h1 className="font-serif text-5xl md:text-6xl font-light leading-[1.05]">
                {product.name}
              </h1>

              <button
                onClick={handleWishlist}
                aria-label="Wishlist"
                className={`
                  shrink-0
                  w-11
                  h-11
                  rounded-full
                  border
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  ${
                    saved
                      ? "bg-[#171513] text-white border-[#171513]"
                      : "border-black/10 hover:bg-[#171513] hover:text-white"
                  }
                `}
              >

                <Heart
                  size={18}
                  strokeWidth={1.3}
                  fill={
                    saved
                      ? "currentColor"
                      : "none"
                  }
                />

              </button>

            </div>


            {/* MATERIAL */}

            <p className="mt-5 text-sm text-[#817b73]">
              {product.material}
            </p>


            {/* PRICE */}

            <div className="flex items-center gap-4 mt-7">

              <p className="text-xl">
                ₹
                {Number(
                  product.price
                ).toLocaleString("en-IN")}
              </p>

              {product.comparePrice &&
                Number(
                  product.comparePrice
                ) > Number(product.price) && (
                  <p className="text-sm text-[#aaa49b] line-through">
                    ₹
                    {Number(
                      product.comparePrice
                    ).toLocaleString("en-IN")}
                  </p>
                )}

            </div>


            {/* STOCK MESSAGE */}

            {!isOutOfStock && (
              <p className="mt-4 text-[9px] uppercase tracking-[0.15em] text-[#8c867e]">

                {isLowStock
                  ? `Only ${stock} pieces remaining`
                  : "In stock — ready to ship"}

              </p>
            )}


            {/* DIVIDER */}

            <div className="mt-8 border-t border-black/[0.1]" />


            {/* SIZE */}

            <div className="mt-8">

              <div className="flex items-center justify-between mb-4">

                <span className="text-[10px] tracking-[0.18em] uppercase">
                  Size
                </span>

                <button className="text-[9px] tracking-[0.12em] uppercase text-[#8c867e] border-b border-black/20">
                  Size Guide
                </button>

              </div>

              <div className="flex gap-2">

                {["6", "7", "8", "9", "10"].map(
                  (size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(size)
                      }
                      className={`
                        w-12
                        h-12
                        border
                        text-sm
                        transition-all
                        ${
                          selectedSize === size
                            ? "border-[#171513] bg-[#171513] text-white"
                            : "border-black/10 hover:border-black/40"
                        }
                      `}
                    >
                      {size}
                    </button>
                  )
                )}

              </div>

            </div>


            {/* QUANTITY */}

            <div className="mt-8">

              <p className="text-[10px] tracking-[0.18em] uppercase mb-4">
                Quantity
              </p>

              <div className="inline-flex border border-black/10">

                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    hover:bg-[#eee9e1]
                    disabled:opacity-30
                    transition
                  "
                >

                  <Minus
                    size={14}
                    strokeWidth={1.2}
                  />

                </button>

                <span className="
                  w-12
                  h-12
                  flex
                  items-center
                  justify-center
                  text-sm
                ">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  disabled={
                    isOutOfStock ||
                    quantity >= stock
                  }
                  className="
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    hover:bg-[#eee9e1]
                    disabled:opacity-30
                    transition
                  "
                >

                  <Plus
                    size={14}
                    strokeWidth={1.2}
                  />

                </button>

              </div>

            </div>


            {/* ADD TO BAG */}

            <button
              onClick={handleAddToBag}
              disabled={isOutOfStock}
              className={`
                w-full
                mt-8
                py-5
                flex
                items-center
                justify-center
                gap-3
                text-[10px]
                tracking-[0.25em]
                uppercase
                transition-all
                duration-500
                ${
                  isOutOfStock
                    ? "bg-[#aaa49b] text-white cursor-not-allowed"
                    : added
                    ? "bg-[#b08d57] text-white"
                    : "bg-[#171513] text-white hover:bg-[#b08d57]"
                }
              `}
            >

              {isOutOfStock ? (
                "Sold Out"
              ) : added ? (
                <>
                  <Check
                    size={16}
                    strokeWidth={1.5}
                  />

                  Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag
                    size={16}
                    strokeWidth={1.3}
                  />

                  Add to Bag
                </>
              )}

            </button>


            {/* BENEFITS */}

            <div className="grid grid-cols-2 gap-3 mt-4">

              <div className="border border-black/[0.08] p-5">

                <Truck
                  size={18}
                  strokeWidth={1.2}
                />

                <p className="mt-3 text-[9px] uppercase tracking-[0.12em]">
                  Complimentary Shipping
                </p>

                <p className="mt-1 text-xs text-[#817b73]">
                  On orders above ₹10,000
                </p>

              </div>

              <div className="border border-black/[0.08] p-5">

                <ShieldCheck
                  size={18}
                  strokeWidth={1.2}
                />

                <p className="mt-3 text-[9px] uppercase tracking-[0.12em]">
                  Secure Purchase
                </p>

                <p className="mt-1 text-xs text-[#817b73]">
                  Authenticity guaranteed
                </p>

              </div>

            </div>


            {/* PRODUCT INFORMATION */}

            <div className="mt-8 border-t border-black/[0.1]">

              {/* DESCRIPTION */}

              <button
                onClick={() =>
                  toggleSection(
                    "description"
                  )
                }
                className="
                  w-full
                  py-5
                  flex
                  items-center
                  justify-between
                  text-left
                "
              >

                <span className="text-[10px] tracking-[0.18em] uppercase">
                  Description
                </span>

                <ChevronDown
                  size={16}
                  strokeWidth={1.2}
                  className={`
                    transition-transform
                    ${
                      openSection ===
                      "description"
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>

              {openSection ===
                "description" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  className="pb-6 text-sm leading-7 text-[#756f67]"
                >
                  {product.description ||
                    "A timeless expression of modern elegance. This piece is thoughtfully crafted to bring subtle brilliance to everyday moments and special occasions."}
                </motion.div>
              )}


              {/* DETAILS */}

              <button
                onClick={() =>
                  toggleSection("details")
                }
                className="
                  w-full
                  py-5
                  border-t
                  border-black/[0.1]
                  flex
                  items-center
                  justify-between
                  text-left
                "
              >

                <span className="text-[10px] tracking-[0.18em] uppercase">
                  Product Details
                </span>

                <ChevronDown
                  size={16}
                  strokeWidth={1.2}
                  className={`
                    transition-transform
                    ${
                      openSection ===
                      "details"
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>

              {openSection ===
                "details" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  className="pb-6 text-sm leading-7 text-[#756f67]"
                >

                  <p>
                    Material:{" "}
                    {product.material ||
                      "Fine jewellery"}
                  </p>

                  <p>
                    Category:{" "}
                    {product.category ||
                      "Jewellery"}
                  </p>

                  <p>
                    Stock:{" "}
                    {stock > 0
                      ? `${stock} available`
                      : "Currently unavailable"}
                  </p>

                  <p>
                    Crafted with precision
                    and finished by hand.
                  </p>

                </motion.div>
              )}


              {/* SHIPPING */}

              <button
                onClick={() =>
                  toggleSection("shipping")
                }
                className="
                  w-full
                  py-5
                  border-t
                  border-black/[0.1]
                  flex
                  items-center
                  justify-between
                  text-left
                "
              >

                <span className="text-[10px] tracking-[0.18em] uppercase">
                  Shipping & Returns
                </span>

                <ChevronDown
                  size={16}
                  strokeWidth={1.2}
                  className={`
                    transition-transform
                    ${
                      openSection ===
                      "shipping"
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>

              {openSection ===
                "shipping" && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  className="pb-6 text-sm leading-7 text-[#756f67]"
                >
                  Complimentary shipping on
                  orders above ₹10,000. Returns
                  accepted within 7 days of
                  delivery for eligible products.
                </motion.div>
              )}

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================
          RELATED PRODUCTS
      ===================================== */}

      {relatedProducts.length > 0 && (
        <section className="border-t border-black/[0.08] py-24 px-6 md:px-10">

          <div className="max-w-[1400px] mx-auto">

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="text-center mb-14"
            >

              <p className="text-[10px] tracking-[0.35em] uppercase text-[#b08d57] mb-4">
                Complete the look
              </p>

              <h2 className="font-serif text-5xl font-light">
                You May Also Like
              </h2>

            </motion.div>


            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-x-5
              gap-y-12
            ">

              {relatedProducts.map(
                (relatedProduct, index) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    index={index}
                  />
                )
              )}

            </div>

          </div>

        </section>
      )}

    </main>
  );
}

export default ProductDetails;
