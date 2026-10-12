
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import api from "../api";
import { useAuth } from "../AuthContext";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("Authentication required");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/my-orders/${id}`);

        const data = response.data;

        if (!data.success) {
          throw new Error(
            data.message || "Unable to load order"
          );
        }

        console.log("ORDER DATA:", data.order);

        setOrder(data.order);
      } catch (error) {
        console.error("Order details error:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full border border-[#d8cfc2] border-t-[#b08d57] animate-spin" />

          <p className="mt-6 text-sm tracking-[0.25em] uppercase text-[#817b73]">
            Loading Order
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-6">
        <div className="text-center max-w-lg">

          <p className="text-xs tracking-[0.35em] uppercase text-[#b08d57] mb-5">
            Aurelia Jewellery
          </p>

          <h1 className="font-serif text-5xl md:text-6xl font-light text-[#292521]">
            Order Not Found
          </h1>

          <p className="text-base text-[#817b73] mt-5 leading-7">
            {error || "This order could not be found."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-9">

            {!isAuthenticated ? (
              <Link
                to="/login"
                state={{
                  from: `/orders/${id}`,
                }}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  px-8
                  py-4
                  bg-[#eee9e1]
                  border
                  border-[#cfc5b8]
                  text-[#403a34]
                  text-sm
                  tracking-[0.18em]
                  uppercase
                  hover:bg-[#e3dbd0]
                  transition-all
                "
              >
                Sign In
                <ArrowRight size={17} strokeWidth={1.2} />
              </Link>
            ) : (
              <Link
                to="/"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  px-8
                  py-4
                  bg-[#eee9e1]
                  border
                  border-[#cfc5b8]
                  text-[#403a34]
                  text-sm
                  tracking-[0.18em]
                  uppercase
                  hover:bg-[#e3dbd0]
                  transition-all
                "
              >
                Back To Home
                <ArrowRight size={17} strokeWidth={1.2} />
              </Link>
            )}

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ORDER DATA
  // =====================================================

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      )
    : "";

  // =====================================================
  // PRICE CALCULATION
  // =====================================================

  /*
    IMPORTANT:

    Your backend is currently returning:

      subtotal = 0
      total = 0

    But the item itself contains:

      price = 54999

    Therefore we calculate the subtotal from the items.

    We also check several possible property names so this
    works even if your backend changes the field name.
  */

  const getItemPrice = (item) => {
    const possiblePrices = [
      item.price,
      item.unit_price,
      item.product_price,
      item.productPrice,
      item.product?.price,
      item.product?.unit_price,
      item.product?.product_price,
    ];

    for (const value of possiblePrices) {
      const number = Number(value);

      if (Number.isFinite(number) && number > 0) {
        return number;
      }
    }

    return 0;
  };

  const getItemQuantity = (item) => {
    const quantity = Number(item.quantity);

    if (Number.isFinite(quantity) && quantity > 0) {
      return quantity;
    }

    return 1;
  };

  // Calculate from actual order items
  const calculatedSubtotal = items.reduce(
    (sum, item) => {
      const price = getItemPrice(item);
      const quantity = getItemQuantity(item);

      return sum + price * quantity;
    },
    0
  );

  // Backend subtotal
  const backendSubtotal = Number(order.subtotal);

  /*
    If backend subtotal is valid and greater than 0,
    use it.

    Otherwise use calculated subtotal.
  */
  const displaySubtotal =
    Number.isFinite(backendSubtotal) &&
    backendSubtotal > 0
      ? backendSubtotal
      : calculatedSubtotal;

  // Shipping
  const backendShipping = Number(order.shipping);

  const shippingAmount =
    Number.isFinite(backendShipping) &&
    backendShipping >= 0
      ? backendShipping
      : displaySubtotal >= 10000
      ? 0
      : 250;

  /*
    IMPORTANT:
    Calculate total ourselves instead of trusting
    backend total because backend currently returns 0.
  */
  const calculatedTotal =
    displaySubtotal + shippingAmount;

  const backendTotal = Number(order.total);

  const displayTotal =
    Number.isFinite(backendTotal) &&
    backendTotal > 0
      ? backendTotal
      : calculatedTotal;

  const orderStatus = order.status || "Pending";

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#faf8f4]">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="border-b border-[#e2ddd5] bg-[#faf8f4]">

        <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 md:py-20">

          <div className="text-center">

            <p className="
              text-xs
              md:text-sm
              tracking-[0.4em]
              uppercase
              text-[#b08d57]
            ">
              Aurelia Jewellery
            </p>

            <h1 className="
              font-serif
              text-5xl
              md:text-6xl
              lg:text-7xl
              font-light
              text-[#292521]
              mt-4
            ">
              Order Details
            </h1>

            <p className="
              text-base
              md:text-lg
              text-[#817b73]
              mt-5
            ">
              Thank you for your purchase,{" "}
              <span className="text-[#403a34]">
                {user?.name || "Customer"}
              </span>
              .
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN
      ================================================= */}

      <section className="
        max-w-6xl
        mx-auto
        px-6
        md:px-10
        py-10
        md:py-14
      ">

        {/* =================================================
            ORDER INFORMATION
        ================================================= */}

        <div className="
          bg-[#f3eee7]
          border
          border-[#ddd5ca]
          mb-8
        ">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
          ">

            {/* ORDER NUMBER */}

            <div className="
              p-6
              md:p-7
              border-b
              md:border-b-0
              md:border-r
              border-[#ddd5ca]
              flex
              items-center
              gap-5
            ">

              <div className="
                w-12
                h-12
                rounded-full
                bg-[#faf8f4]
                border
                border-[#d8cfc2]
                flex
                items-center
                justify-center
                shrink-0
              ">
                <ShoppingBag
                  size={20}
                  strokeWidth={1.2}
                  className="text-[#9b8058]"
                />
              </div>

              <div>

                <p className="
                  text-xs
                  tracking-[0.22em]
                  uppercase
                  text-[#9b8058]
                ">
                  Order Number
                </p>

                <p className="
                  text-xl
                  md:text-2xl
                  text-[#292521]
                  mt-2
                ">
                  #{order.id}
                </p>

              </div>

            </div>


            {/* ORDER DATE */}

            <div className="
              p-6
              md:p-7
              border-b
              md:border-b-0
              md:border-r
              border-[#ddd5ca]
              flex
              items-center
              gap-5
            ">

              <div className="
                w-12
                h-12
                rounded-full
                bg-[#faf8f4]
                border
                border-[#d8cfc2]
                flex
                items-center
                justify-center
                shrink-0
              ">
                <CalendarDays
                  size={20}
                  strokeWidth={1.2}
                  className="text-[#9b8058]"
                />
              </div>

              <div>

                <p className="
                  text-xs
                  tracking-[0.22em]
                  uppercase
                  text-[#9b8058]
                ">
                  Order Date
                </p>

                <p className="
                  text-xl
                  md:text-2xl
                  text-[#292521]
                  mt-2
                ">
                  {orderDate}
                </p>

              </div>

            </div>


            {/* STATUS */}

            <div className="
              p-6
              md:p-7
              flex
              items-center
              gap-5
            ">

              <div className="
                w-12
                h-12
                rounded-full
                bg-[#faf8f4]
                border
                border-[#d8cfc2]
                flex
                items-center
                justify-center
                shrink-0
              ">
                <CheckCircle2
                  size={20}
                  strokeWidth={1.2}
                  className="text-[#9b8058]"
                />
              </div>

              <div>

                <p className="
                  text-xs
                  tracking-[0.22em]
                  uppercase
                  text-[#9b8058]
                ">
                  Status
                </p>

                <p className="
                  text-xl
                  md:text-2xl
                  text-[#292521]
                  mt-2
                  capitalize
                ">
                  {orderStatus}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            ITEMS
        ================================================= */}

        <div className="
          bg-[#faf8f4]
          border
          border-[#ddd5ca]
          mb-8
        ">

          <div className="
            px-6
            md:px-8
            py-6
            border-b
            border-[#ddd5ca]
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-xs
                tracking-[0.3em]
                uppercase
                text-[#b08d57]
              ">
                Your Selection
              </p>

              <h2 className="
                font-serif
                text-3xl
                md:text-4xl
                font-light
                text-[#292521]
                mt-2
              ">
                Items
              </h2>

            </div>

            <div className="
              w-12
              h-12
              rounded-full
              bg-[#eee9e1]
              flex
              items-center
              justify-center
            ">
              <Package
                size={21}
                strokeWidth={1.2}
                className="text-[#9b8058]"
              />
            </div>

          </div>


          {/* ITEM LIST */}

          <div>

            {items.length === 0 ? (

              <div className="
                p-10
                text-center
                text-[#817b73]
              ">
                No items found for this order.
              </div>

            ) : (

              items.map((item, index) => {

                const itemPrice =
                  getItemPrice(item);

                const itemQuantity =
                  getItemQuantity(item);

                const itemTotal =
                  itemPrice * itemQuantity;

                return (
                  <div
                    key={item.id || index}
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      gap-6
                      p-6
                      md:p-8
                      border-b
                      border-[#e2ddd5]
                      last:border-b-0
                    "
                  >

                    {/* IMAGE */}

                    <div className="
                      w-full
                      sm:w-28
                      h-28
                      shrink-0
                      bg-[#eee9e1]
                      overflow-hidden
                    ">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={
                            item.name ||
                            item.product_name ||
                            "Jewellery"
                          }
                          className="
                            w-full
                            h-full
                            object-cover
                          "
                        />

                      ) : (

                        <div className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                        ">
                          <span className="
                            text-xs
                            tracking-[0.25em]
                            uppercase
                            text-[#9b8058]
                          ">
                            Aurelia
                          </span>
                        </div>

                      )}

                    </div>


                    {/* PRODUCT INFO */}

                    <div className="flex-1">

                      <p className="
                        text-xs
                        tracking-[0.25em]
                        uppercase
                        text-[#b08d57]
                        mb-2
                      ">
                        Aurelia Jewellery
                      </p>

                      <h3 className="
                        font-serif
                        text-2xl
                        md:text-3xl
                        font-light
                        text-[#292521]
                      ">
                        {item.name ||
                          item.product_name ||
                          item.product?.name ||
                          "Jewellery"}
                      </h3>

                      <div className="
                        flex
                        flex-wrap
                        gap-x-6
                        gap-y-2
                        mt-3
                      ">

                        {item.size && (
                          <p className="
                            text-sm
                            md:text-base
                            text-[#817b73]
                          ">
                            Size:{" "}
                            <span className="text-[#403a34]">
                              {item.size}
                            </span>
                          </p>
                        )}

                        <p className="
                          text-sm
                          md:text-base
                          text-[#817b73]
                        ">
                          Quantity:{" "}
                          <span className="text-[#403a34]">
                            {itemQuantity}
                          </span>
                        </p>

                      </div>

                    </div>


                    {/* PRICE */}

                    <div className="
                      sm:text-right
                      shrink-0
                    ">

                      <p className="
                        text-sm
                        text-[#9b948b]
                      ">
                        ₹{itemPrice.toLocaleString("en-IN")}
                      </p>

                      <p className="
                        font-serif
                        text-2xl
                        md:text-3xl
                        font-light
                        text-[#292521]
                        mt-1
                      ">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>
                );
              })

            )}

          </div>

        </div>


        {/* =================================================
            PAYMENT SUMMARY
        ================================================= */}

        <div className="
          bg-[#f3eee7]
          border
          border-[#ddd5ca]
          p-7
          md:p-9
          mb-8
        ">

          <div className="mb-7">

            <p className="
              text-xs
              tracking-[0.3em]
              uppercase
              text-[#b08d57]
            ">
              Payment Summary
            </p>

            <h2 className="
              font-serif
              text-3xl
              md:text-4xl
              font-light
              text-[#292521]
              mt-2
            ">
              Order Total
            </h2>

          </div>


          <div className="max-w-md ml-auto">

            {/* SUBTOTAL */}

            <div className="
              flex
              justify-between
              items-center
              py-4
              border-b
              border-[#ddd5ca]
            ">

              <span className="
                text-base
                md:text-lg
                text-[#817b73]
              ">
                Subtotal
              </span>

              <span className="
                text-base
                md:text-lg
                text-[#403a34]
              ">
                ₹{displaySubtotal.toLocaleString("en-IN")}
              </span>

            </div>


            {/* SHIPPING */}

            <div className="
              flex
              justify-between
              items-center
              py-4
              border-b
              border-[#ddd5ca]
            ">

              <span className="
                text-base
                md:text-lg
                text-[#817b73]
              ">
                Shipping
              </span>

              <span className="
                text-base
                md:text-lg
                text-[#403a34]
              ">
                {shippingAmount === 0
                  ? "FREE"
                  : `₹${shippingAmount.toLocaleString("en-IN")}`}
              </span>

            </div>


            {/* TOTAL */}

            <div className="
              flex
              justify-between
              items-end
              pt-6
            ">

              <span className="
                text-sm
                md:text-base
                tracking-[0.25em]
                uppercase
                text-[#403a34]
              ">
                Total
              </span>

              <span className="
                font-serif
                text-4xl
                md:text-5xl
                font-light
                text-[#292521]
              ">
                ₹{displayTotal.toLocaleString("en-IN")}
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            DELIVERY INFORMATION
        ================================================= */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
          mb-9
        ">

          <div className="
            border
            border-[#ddd5ca]
            bg-[#faf8f4]
            p-6
            flex
            items-center
            gap-5
          ">

            <div className="
              w-14
              h-14
              rounded-full
              bg-[#eee9e1]
              flex
              items-center
              justify-center
              shrink-0
            ">
              <Package
                size={23}
                strokeWidth={1.2}
                className="text-[#9b8058]"
              />
            </div>

            <div>

              <p className="
                text-sm
                md:text-base
                tracking-[0.18em]
                uppercase
                text-[#403a34]
              ">
                Carefully Packed
              </p>

              <p className="
                text-sm
                md:text-base
                text-[#817b73]
                mt-2
              ">
                Your jewellery will be prepared with care.
              </p>

            </div>

          </div>


          <div className="
            border
            border-[#ddd5ca]
            bg-[#faf8f4]
            p-6
            flex
            items-center
            gap-5
          ">

            <div className="
              w-14
              h-14
              rounded-full
              bg-[#eee9e1]
              flex
              items-center
              justify-center
              shrink-0
            ">
              <Truck
                size={23}
                strokeWidth={1.2}
                className="text-[#9b8058]"
              />
            </div>

            <div>

              <p className="
                text-sm
                md:text-base
                tracking-[0.18em]
                uppercase
                text-[#403a34]
              ">
                Secure Delivery
              </p>

              <p className="
                text-sm
                md:text-base
                text-[#817b73]
                mt-2
              ">
                Your order will be delivered safely.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="
          flex
          flex-col
          sm:flex-row
          justify-center
          gap-4
        ">

          <Link
            to="/shop"
            className="
              inline-flex
              items-center
              justify-center
              gap-3
              min-w-[230px]
              px-8
              py-4
              bg-[#eee9e1]
              border
              border-[#cfc5b8]
              text-[#403a34]
              text-sm
              tracking-[0.18em]
              uppercase
              hover:bg-[#e3dbd0]
              hover:border-[#b8aa99]
              transition-all
            "
          >
            Continue Shopping

            <ArrowRight
              size={17}
              strokeWidth={1.2}
            />
          </Link>


          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              inline-flex
              items-center
              justify-center
              gap-3
              min-w-[230px]
              px-8
              py-4
              bg-[#faf8f4]
              border
              border-[#cfc5b8]
              text-[#403a34]
              text-sm
              tracking-[0.18em]
              uppercase
              hover:bg-[#eee9e1]
              hover:border-[#b8aa99]
              transition-all
            "
          >
            Back To Home
          </button>

        </div>


        {/* FOOTER */}

        <p className="
          text-center
          mt-10
          text-xs
          tracking-[0.35em]
          uppercase
          text-[#a49d94]
        ">
          Crafted for your story
        </p>

      </section>

    </main>
  );
}

export default OrderDetails;