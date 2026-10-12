
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../CartContext";
import api from "../api";

function Checkout() {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const shipping =
    cartSubtotal >= 10000 || cartSubtotal === 0
      ? 0
      : 250;

  const total = cartSubtotal + shipping;

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================================
  // VALIDATION
  // =========================================

  const validate = () => {
    const newErrors = {};

    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    required.forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = "Required";
      }
    });

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Invalid email";
    }

    if (
      form.phone &&
      !/^[6-9]\d{9}$/.test(form.phone)
    ) {
      newErrors.phone = "Invalid phone number";
    }

    if (
      form.pincode &&
      !/^\d{6}$/.test(form.pincode)
    ) {
      newErrors.pincode = "Invalid pincode";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================
  // PLACE ORDER
  // =========================================

  const handlePlaceOrder = async () => {
    if (!validate()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const orderItems = cartItems.map((item) => ({
        productId: Number(item.id),
        quantity: Number(item.quantity),
        size: item.size || null,
      }));

      const response = await api.post("/orders", {
        items: orderItems,

        shippingAddress: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),

          address: form.apartment
            ? `${form.address.trim()}, ${form.apartment.trim()}`
            : form.address.trim(),

          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },

        paymentMethod,
      });

      console.log(
        "Create order response:",
        response.data
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to create order"
        );
      }

      setOrderId(response.data.orderId);

      clearCart();

      setOrderPlaced(true);
    } catch (error) {
      console.error(
        "Create order error:",
        error.response?.data || error
      );

      setErrors({
        submit:
          error.response?.data?.message ||
          error.message ||
          "Failed to place order",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // EMPTY CART
  // =========================================

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-[#b08d57]">
            Aurelia
          </p>

          <h1 className="font-serif text-5xl md:text-6xl font-light mt-5 text-[#403a34]">
            Your bag is empty
          </h1>

          <p className="text-base md:text-lg text-[#817b73] mt-6 leading-8">
            Add jewellery to your bag before
            proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-3 mt-9 bg-[#eee9e1] border border-[#cfc5b8] text-[#403a34] px-9 py-4 text-sm tracking-[0.18em] uppercase hover:bg-[#e3dbd0] transition-all"
          >
            Explore Jewellery
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  // =========================================
  // ORDER SUCCESS
  // =========================================

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="text-center w-full max-w-[900px]"
        >
          {/* SUCCESS ICON */}

          <motion.div
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 14,
              delay: 0.15,
            }}
            className="mx-auto w-24 h-24 rounded-full bg-[#eee9e1] border border-[#d6ccbf] text-[#6c645b] flex items-center justify-center"
          >
            <Check
              size={42}
              strokeWidth={1.2}
            />
          </motion.div>

          {/* HEADING */}

          <p className="text-[12px] md:text-[13px] tracking-[0.4em] uppercase text-[#b08d57] mt-9">
            Thank You
          </p>

          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light text-[#292521] mt-4">
            Order Placed
          </h1>

          {/* ORDER ID */}

          {orderId && (
            <p className="text-base md:text-lg text-[#5f574e] mt-4 tracking-[0.08em]">
              Order #{orderId}
            </p>
          )}

          {/* MESSAGE */}

          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#817b73] leading-8 mt-5">
            Your Aurelia jewellery is being
            prepared with care.
          </p>

          {/* ORDER INFO */}

          <div className="mt-10 bg-[#f1ede6] border border-[#ddd5ca] p-7 md:p-9">
            <div className="grid md:grid-cols-3 gap-7">
              <div>
                <p className="text-[11px] md:text-xs tracking-[0.2em] uppercase text-[#817b73]">
                  Order Status
                </p>

                <p className="mt-2 text-base md:text-lg text-[#403a34]">
                  Confirmed
                </p>
              </div>

              <div>
                <p className="text-[11px] md:text-xs tracking-[0.2em] uppercase text-[#817b73]">
                  Estimated Delivery
                </p>

                <p className="mt-2 text-base md:text-lg text-[#403a34]">
                  3–5 Business Days
                </p>
              </div>

              <div>
                <p className="text-[11px] md:text-xs tracking-[0.2em] uppercase text-[#817b73]">
                  Payment
                </p>

                <p className="mt-2 text-base md:text-lg text-[#403a34]">
                  {paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </div>
            </div>
          </div>

          {/* DELIVERY INFORMATION */}

          <div className="mt-7 grid sm:grid-cols-2 gap-5">
            <div className="border border-[#ddd5ca] bg-[#faf8f4] p-7 flex items-center gap-5 text-left">
              <div className="w-14 h-14 rounded-full bg-[#eee9e1] flex items-center justify-center shrink-0">
                <PackageIcon />
              </div>

              <div>
                <p className="text-[11px] md:text-xs tracking-[0.18em] uppercase text-[#403a34]">
                  Carefully Packed
                </p>

                <p className="text-sm md:text-base text-[#817b73] mt-2 leading-6">
                  Your jewellery will be prepared
                  with care.
                </p>
              </div>
            </div>

            <div className="border border-[#ddd5ca] bg-[#faf8f4] p-7 flex items-center gap-5 text-left">
              <div className="w-14 h-14 rounded-full bg-[#eee9e1] flex items-center justify-center shrink-0">
                <Truck
                  size={24}
                  strokeWidth={1.1}
                  className="text-[#6c645b]"
                />
              </div>

              <div>
                <p className="text-[11px] md:text-xs tracking-[0.18em] uppercase text-[#403a34]">
                  Secure Delivery
                </p>

                <p className="text-sm md:text-base text-[#817b73] mt-2 leading-6">
                  Track your order once it ships.
                </p>
              </div>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-3 min-w-[220px] bg-[#eee9e1] border border-[#cfc5b8] text-[#403a34] px-9 py-4 text-sm tracking-[0.18em] uppercase hover:bg-[#e3dbd0] transition-all"
            >
              View My Orders

              <ArrowRight
                size={17}
                strokeWidth={1.2}
              />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 min-w-[220px] bg-[#f5f1eb] border border-[#cfc5b8] text-[#403a34] px-9 py-4 text-sm tracking-[0.18em] uppercase hover:bg-[#e3dbd0] transition-all"
            >
              Continue Shopping

              <ArrowRight
                size={17}
                strokeWidth={1.2}
              />
            </Link>
          </div>

          <p className="mt-12 text-[11px] md:text-xs tracking-[0.3em] uppercase text-[#a49d94]">
            Crafted for your story
          </p>
        </motion.div>
      </main>
    );
  }

  // =========================================
  // CHECKOUT
  // =========================================

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      {/* HEADER */}

      <section className="border-b border-black/10 bg-[#f5f1eb]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm tracking-[0.18em] uppercase text-[#817b73] hover:text-[#b08d57]"
          >
            <ArrowLeft size={16} />
            Back to Bag
          </Link>

          <p className="text-sm tracking-[0.3em] uppercase text-[#b08d57] mt-8">
            Aurelia Checkout
          </p>

          <h1 className="font-serif text-5xl md:text-6xl font-light mt-3 text-[#292521]">
            Complete Your Order
          </h1>
        </div>
      </section>

      {/* MAIN */}

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
          {/* LEFT */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            {/* ERROR */}

            {errors.submit && (
              <div className="mb-8 border border-red-300 bg-red-50 px-5 py-4 text-base text-red-700">
                {errors.submit}
              </div>
            )}

            {/* CONTACT */}

            <CheckoutSection
              number="01"
              title="Contact Information"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="First name"
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="Last name"
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@example.com"
                />

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="9876543210"
                />
              </div>
            </CheckoutSection>

            {/* ADDRESS */}

            <CheckoutSection
              number="02"
              title="Shipping Address"
            >
              <div className="space-y-5">
                <Input
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  error={errors.address}
                  placeholder="House number, street name"
                />

                <Input
                  label="Apartment / Landmark"
                  name="apartment"
                  value={form.apartment}
                  onChange={handleChange}
                  placeholder="Optional"
                  required={false}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    error={errors.city}
                    placeholder="City"
                  />

                  <Input
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    error={errors.state}
                    placeholder="State"
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    error={errors.pincode}
                    placeholder="395001"
                  />
                </div>
              </div>
            </CheckoutSection>

            {/* PAYMENT */}

            <CheckoutSection
              number="03"
              title="Payment Method"
            >
              <div className="space-y-3">
                <PaymentOption
                  selected={paymentMethod === "cod"}
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  title="Cash on Delivery"
                  description="Pay when your jewellery arrives."
                />

                <PaymentOption
                  selected={
                    paymentMethod === "online"
                  }
                  onClick={() =>
                    setPaymentMethod("online")
                  }
                  title="Online Payment"
                  description="UPI, cards and net banking."
                />
              </div>
            </CheckoutSection>

            {/* TRUST */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Trust
                icon={<LockKeyhole size={20} />}
                title="Secure"
                text="Protected checkout"
              />

              <Trust
                icon={<ShieldCheck size={20} />}
                title="Authentic"
                text="Aurelia guarantee"
              />

              <Trust
                icon={<Truck size={20} />}
                title="Delivery"
                text="Safe & careful"
              />
            </div>
          </motion.div>

          {/* RIGHT */}

          <motion.aside
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="lg:sticky lg:top-28 h-fit"
          >
            <div className="bg-[#f3eee7] border border-[#ddd5ca] p-7 md:p-8">
              <p className="text-sm tracking-[0.25em] uppercase text-[#b08d57]">
                Your Selection
              </p>

              <h2 className="font-serif text-3xl md:text-4xl font-light mt-3 text-[#292521]">
                Order Summary
              </h2>

              {/* ITEMS */}

              <div className="mt-8 space-y-5">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${
                      item.size || "default"
                    }`}
                    className="flex gap-4"
                  >
                    <div className="relative w-20 h-24 shrink-0 bg-[#e8e2da] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />

                      <span className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#eee9e1] border border-[#cfc5b8] text-[#403a34] text-[10px] flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="font-serif text-lg md:text-xl text-[#292521]">
                        {item.name}
                      </p>

                      <p className="text-sm text-[#817b73] mt-1">
                        {item.category || "Jewellery"}
                      </p>

                      {item.size && (
                        <p className="text-sm text-[#817b73] mt-1">
                          Size: {item.size}
                        </p>
                      )}

                      <p className="text-base mt-3 text-[#403a34]">
                        ₹
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/10 my-7" />

              {/* PRICES */}

              <div className="space-y-4">
                <Summary
                  label={`Subtotal (${cartCount} ${
                    cartCount === 1
                      ? "item"
                      : "items"
                  })`}
                  value={`₹${cartSubtotal.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <Summary
                  label="Shipping"
                  value={
                    shipping === 0
                      ? "Complimentary"
                      : `₹${shipping.toLocaleString(
                          "en-IN"
                        )}`
                  }
                />
              </div>

              <div className="border-t border-black/10 my-7" />

              <div className="flex justify-between items-end">
                <span className="text-sm tracking-[0.2em] uppercase">
                  Total
                </span>

                <span className="font-serif text-3xl md:text-4xl font-light">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-8 bg-[#eee9e1] border border-[#cfc5b8] text-[#403a34] py-5 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase hover:bg-[#e3dbd0] hover:border-[#b8aa99] disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border border-[#b8aa99] border-t-[#6c645b] animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-[#817b73] mt-5 leading-6">
                By placing your order, you agree
                to our terms and conditions.
              </p>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}

// ========================================
// CHECKOUT SECTION
// ========================================

function CheckoutSection({
  number,
  title,
  children,
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-4 border-b border-black/10 pb-4 mb-7">
        <span className="text-sm text-[#b08d57]">
          {number}
        </span>

        <h2 className="text-sm tracking-[0.2em] uppercase text-[#403a34]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

// ========================================
// INPUT
// ========================================

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = true,
}) {
  return (
    <div>
      <label className="block text-sm tracking-[0.15em] uppercase mb-2 text-[#403a34]">
        {label}

        {required && (
          <span className="text-[#b08d57] ml-1">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-transparent border px-4 py-4 text-base outline-none transition ${
          error
            ? "border-red-400"
            : "border-black/10 focus:border-[#b08d57]"
        }`}
      />

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

// ========================================
// PAYMENT OPTION
// ========================================

function PaymentOption({
  selected,
  onClick,
  title,
  description,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left border p-5 flex items-center gap-4 transition ${
        selected
          ? "border-[#b08d57] bg-[#f7f1e8]"
          : "border-black/10 hover:border-[#b8aa99]"
      }`}
    >
      <span
        className={`w-6 h-6 rounded-full border flex items-center justify-center ${
          selected
            ? "border-[#b08d57]"
            : "border-black/20"
        }`}
      >
        {selected && (
          <span className="w-2.5 h-2.5 rounded-full bg-[#b08d57]" />
        )}
      </span>

      <span>
        <span className="block text-sm tracking-[0.12em] uppercase text-[#403a34]">
          {title}
        </span>

        <span className="block text-sm text-[#817b73] mt-1">
          {description}
        </span>
      </span>
    </button>
  );
}

// ========================================
// TRUST
// ========================================

function Trust({
  icon,
  title,
  text,
}) {
  return (
    <div className="border border-black/10 p-5">
      <div className="text-[#6c645b]">
        {icon}
      </div>

      <p className="text-sm tracking-[0.12em] uppercase mt-3 text-[#403a34]">
        {title}
      </p>

      <p className="text-sm text-[#817b73] mt-1">
        {text}
      </p>
    </div>
  );
}

// ========================================
// SUMMARY
// ========================================

function Summary({
  label,
  value,
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-base text-[#817b73]">
        {label}
      </span>

      <span className="text-base text-[#403a34]">
        {value}
      </span>
    </div>
  );
}

// ========================================
// PACKAGE ICON
// ========================================

function PackageIcon() {
  return (
    <div className="text-[#6c645b]">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 16V8L12 3L3 8V16L12 21L21 16Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        <path
          d="M3 8L12 13L21 8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        <path
          d="M12 13V21"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

export default Checkout;
