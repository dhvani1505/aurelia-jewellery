
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "../CartContext";

import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartSubtotal,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [removingId, setRemovingId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] =
    useState(false);

  // =========================================
  // SHIPPING
  // =========================================

  const FREE_SHIPPING_LIMIT = 10000;

  const shipping =
    cartSubtotal >= FREE_SHIPPING_LIMIT ||
    cartSubtotal === 0
      ? 0
      : 250;

  const finalTotal = cartTotal + shipping;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_LIMIT - cartSubtotal
  );

  const shippingProgress = Math.min(
    100,
    (cartSubtotal / FREE_SHIPPING_LIMIT) * 100
  );

  // =========================================
  // QUANTITY
  // =========================================

  const decreaseQuantity = (item) => {
    updateQuantity(
      item.id,
      item.size,
      item.quantity - 1
    );
  };

  const increaseQuantity = (item) => {
    updateQuantity(
      item.id,
      item.size,
      item.quantity + 1
    );
  };

  // =========================================
  // REMOVE
  // =========================================

  const handleRemove = (item) => {
    setRemovingId(`${item.id}-${item.size}`);

    setTimeout(() => {
      removeFromCart(item.id, item.size);
      setRemovingId(null);
    }, 250);
  };

  // =========================================
  // CLEAR
  // =========================================

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  // =========================================
  // CHECKOUT
  // =========================================

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    navigate("/checkout");
  };

  // =========================================
  // EMPTY CART
  // =========================================

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">

        <section className="cart-empty-page">

          <motion.div
            className="cart-empty-card"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <div className="cart-empty-icon">
              <ShoppingBag
                size={34}
                strokeWidth={1.2}
              />
            </div>

            <p className="cart-label">
              AURELIA JEWELLERY
            </p>

            <h1>
              Your bag is empty
            </h1>

            <p className="cart-empty-text">
              Nothing here yet. Explore our
              jewellery collection and find
              something worth keeping.
            </p>

            <Link
              to="/shop"
              className="cart-primary-button"
            >
              Explore Jewellery
              <ArrowRight size={16} />
            </Link>

          </motion.div>

        </section>

      </main>
    );
  }

  // =========================================
  // CART
  // =========================================

  return (
    <main className="cart-page">

      {/* =====================================
          TOP HEADER
      ===================================== */}

      <section className="cart-hero">

        <div className="cart-container">

          <div className="cart-hero-content">

            <Link
              to="/shop"
              className="cart-back-link"
            >
              <ArrowLeft size={15} />
              Continue Shopping
            </Link>

            <div className="cart-eyebrow">
              AURELIA JEWELLERY
            </div>

            <h1>
              Your Shopping Bag
            </h1>

            <p>
              {cartCount}{" "}
              {cartCount === 1
                ? "piece"
                : "pieces"}{" "}
              selected
            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          MAIN
      ===================================== */}

      <section className="cart-main">

        <div className="cart-container">

          {/* FREE SHIPPING BAR */}

          <div className="cart-shipping-banner">

            <div className="cart-shipping-icon">
              <Truck size={18} />
            </div>

            <div className="cart-shipping-content">

              {remainingForFreeShipping > 0 ? (
                <p>
                  Add{" "}
                  <strong>
                    ₹
                    {remainingForFreeShipping.toLocaleString(
                      "en-IN"
                    )}
                  </strong>{" "}
                  more for complimentary
                  shipping.
                </p>
              ) : (
                <p>
                  <strong>
                    Complimentary shipping unlocked.
                  </strong>
                </p>
              )}

              <div className="cart-progress">
                <div
                  className="cart-progress-bar"
                  style={{
                    width: `${shippingProgress}%`,
                  }}
                />
              </div>

            </div>

          </div>


          {/* GRID */}

          <div className="cart-layout">

            {/* =================================
                PRODUCTS
            ================================= */}

            <div className="cart-products-section">

              <div className="cart-section-heading">

                <div>
                  <span>
                    YOUR SELECTION
                  </span>

                  <h2>
                    Selected Pieces
                  </h2>
                </div>

                <button
                  type="button"
                  className="cart-clear-button"
                  onClick={() =>
                    setShowClearConfirm(true)
                  }
                >
                  Clear Bag
                </button>

              </div>


              <div className="cart-products">

                <AnimatePresence>

                  {cartItems.map((item, index) => {

                    const itemKey =
                      `${item.id}-${item.size}`;

                    const itemTotal =
                      Number(item.price || 0) *
                      Number(item.quantity || 0);

                    return (
                      <motion.article
                        key={itemKey}
                        className={`cart-item ${
                          removingId === itemKey
                            ? "cart-item-removing"
                            : ""
                        }`}
                        initial={{
                          opacity: 0,
                          y: 15,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: -20,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.04,
                        }}
                      >

                        {/* IMAGE */}

                        <Link
                          to={`/product/${item.id}`}
                          className="cart-item-image"
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                        </Link>


                        {/* DETAILS */}

                        <div className="cart-item-details">

                          <div className="cart-item-top">

                            <div>

                              {item.category && (
                                <p className="cart-item-category">
                                  {item.category}
                                </p>
                              )}

                              <Link
                                to={`/product/${item.id}`}
                                className="cart-item-name"
                              >
                                {item.name}
                              </Link>

                              {item.material && (
                                <p className="cart-item-material">
                                  {item.material}
                                </p>
                              )}

                              {item.size && (
                                <p className="cart-item-size">
                                  Size: {item.size}
                                </p>
                              )}

                            </div>


                            <button
                              type="button"
                              className="cart-remove-button"
                              onClick={() =>
                                handleRemove(item)
                              }
                              aria-label="Remove product"
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>


                          {/* BOTTOM */}

                          <div className="cart-item-bottom">

                            {/* QUANTITY */}

                            <div className="cart-quantity-area">

                              <span>
                                QUANTITY
                              </span>

                              <div className="cart-quantity">

                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(item)
                                  }
                                >
                                  <Minus size={13} />
                                </button>

                                <strong>
                                  {item.quantity}
                                </strong>

                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseQuantity(item)
                                  }
                                >
                                  <Plus size={13} />
                                </button>

                              </div>

                            </div>


                            {/* PRICE */}

                            <div className="cart-item-price">

                              <span>
                                ₹
                                {Number(
                                  item.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}{" "}
                                each
                              </span>

                              <strong>
                                ₹
                                {itemTotal.toLocaleString(
                                  "en-IN"
                                )}
                              </strong>

                            </div>

                          </div>

                        </div>

                      </motion.article>
                    );
                  })}

                </AnimatePresence>

              </div>


              {/* CONTINUE */}

              <Link
                to="/shop"
                className="cart-continue-link"
              >
                <ArrowLeft size={15} />
                Continue Shopping
              </Link>

            </div>


            {/* =================================
                SUMMARY
            ================================= */}

            <aside className="cart-summary">

              <div className="cart-summary-header">

                <span>
                  ORDER SUMMARY
                </span>

                <h2>
                  Your Total
                </h2>

              </div>


              <div className="cart-summary-lines">

                <div>
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {cartSubtotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>


                <div>
                  <span>
                    Shipping
                  </span>

                  <strong>
                    {shipping === 0
                      ? "Complimentary"
                      : `₹${shipping.toLocaleString(
                          "en-IN"
                        )}`}
                  </strong>
                </div>

              </div>


              <div className="cart-summary-total">

                <span>
                  TOTAL
                </span>

                <strong>
                  ₹
                  {finalTotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              <button
                type="button"
                className="cart-checkout-button"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>


              <div className="cart-trust">

                <div>
                  <ShieldCheck size={17} />

                  <span>
                    Secure checkout
                  </span>
                </div>

                <div>
                  <Truck size={17} />

                  <span>
                    Reliable delivery
                  </span>
                </div>

              </div>

            </aside>

          </div>

        </div>

      </section>


      {/* =====================================
          CLEAR CART MODAL
      ===================================== */}

      <AnimatePresence>

        {showClearConfirm && (

          <motion.div
            className="cart-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setShowClearConfirm(false)
            }
          >

            <motion.div
              className="cart-modal"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="cart-modal-close"
                onClick={() =>
                  setShowClearConfirm(false)
                }
              >
                <X size={18} />
              </button>

              <div className="cart-modal-icon">
                <Trash2 size={22} />
              </div>

              <p className="cart-modal-label">
                AURELIA
              </p>

              <h2>
                Clear your bag?
              </h2>

              <p>
                All selected pieces will be
                removed from your shopping bag.
              </p>

              <div className="cart-modal-actions">

                <button
                  type="button"
                  className="cart-modal-cancel"
                  onClick={() =>
                    setShowClearConfirm(false)
                  }
                >
                  Keep Items
                </button>

                <button
                  type="button"
                  className="cart-modal-delete"
                  onClick={handleClearCart}
                >
                  Clear Bag
                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  );
}

export default Cart;
