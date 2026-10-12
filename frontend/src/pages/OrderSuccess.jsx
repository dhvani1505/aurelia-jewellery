
import { Link } from "react-router-dom";
import { Check, ArrowRight, Package, Truck } from "lucide-react";
import { motion } from "framer-motion";

function OrderSuccess() {
  const orderNumber = "AUR-" + Date.now().toString().slice(-8);

  return (
    <main className="min-h-screen bg-[#faf8f4]">

      {/* =========================================
          SUCCESS SECTION
      ========================================= */}

      <section className="min-h-[calc(100vh-76px)] flex items-center justify-center px-6 py-16">

        <div className="w-full max-w-5xl">

          {/* =========================================
              TOP SUCCESS AREA
          ========================================= */}

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
              duration: 0.7,
            }}
            className="text-center"
          >

            {/* Check Circle */}

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
              className="
                mx-auto
                w-20
                h-20
                rounded-full
                bg-[#d8c3a5]
                text-[#4b4034]
                flex
                items-center
                justify-center
              "
            >
              <Check
                size={36}
                strokeWidth={1.4}
              />
            </motion.div>


            {/* Small Heading */}

            <p
              className="
                mt-8
                text-[12px]
                tracking-[0.35em]
                uppercase
                text-[#a98250]
              "
            >
              Thank You
            </p>


            {/* Main Heading */}

            <h1
              className="
                font-serif
                text-5xl
                md:text-6xl
                font-light
                mt-3
                text-[#4b4034]
              "
            >
              Order Placed
            </h1>


            {/* Description */}

            <p
              className="
                max-w-xl
                mx-auto
                mt-5
                text-base
                leading-7
                text-[#756f67]
              "
            >
              Your Aurelia jewellery is being prepared with care.
              We've received your order and will carefully prepare
              it for delivery.
            </p>

          </motion.div>


          {/* =========================================
              ORDER INFORMATION
          ========================================= */}

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
              delay: 0.4,
            }}
            className="
              mt-10
              bg-white
              border
              border-[#e4ddd3]
            "
          >

            <div className="grid md:grid-cols-3">

              {/* ORDER NUMBER */}

              <div
                className="
                  px-7
                  py-7
                  text-center
                  md:border-r
                  border-[#e4ddd3]
                "
              >

                <p
                  className="
                    text-[11px]
                    tracking-[0.2em]
                    uppercase
                    text-[#8b8175]
                  "
                >
                  Order Number
                </p>

                <p
                  className="
                    mt-3
                    text-base
                    tracking-[0.08em]
                    text-[#4b4034]
                  "
                >
                  #{orderNumber}
                </p>

              </div>


              {/* DELIVERY */}

              <div
                className="
                  px-7
                  py-7
                  text-center
                  md:border-r
                  border-[#e4ddd3]
                "
              >

                <p
                  className="
                    text-[11px]
                    tracking-[0.2em]
                    uppercase
                    text-[#8b8175]
                  "
                >
                  Estimated Delivery
                </p>

                <p
                  className="
                    mt-3
                    text-base
                    text-[#4b4034]
                  "
                >
                  3–5 Business Days
                </p>

              </div>


              {/* PAYMENT */}

              <div
                className="
                  px-7
                  py-7
                  text-center
                "
              >

                <p
                  className="
                    text-[11px]
                    tracking-[0.2em]
                    uppercase
                    text-[#8b8175]
                  "
                >
                  Payment
                </p>

                <p
                  className="
                    mt-3
                    text-base
                    text-[#4b4034]
                  "
                >
                  Confirmed
                </p>

              </div>

            </div>

          </motion.div>


          {/* =========================================
              DELIVERY INFORMATION
          ========================================= */}

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
              duration: 0.7,
              delay: 0.6,
            }}
            className="
              mt-5
              grid
              md:grid-cols-2
              gap-5
            "
          >

            {/* PACKED */}

            <div
              className="
                bg-[#eee9e1]
                p-6
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#faf8f4]
                  flex
                  items-center
                  justify-center
                  shrink-0
                  text-[#8f704b]
                "
              >

                <Package
                  size={21}
                  strokeWidth={1.2}
                />

              </div>

              <div>

                <p
                  className="
                    text-[11px]
                    tracking-[0.18em]
                    uppercase
                    text-[#4b4034]
                  "
                >
                  Carefully Packed
                </p>

                <p
                  className="
                    text-sm
                    text-[#817b73]
                    mt-1
                  "
                >
                  Your jewellery will be prepared with care.
                </p>

              </div>

            </div>


            {/* DELIVERY */}

            <div
              className="
                bg-[#eee9e1]
                p-6
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#faf8f4]
                  flex
                  items-center
                  justify-center
                  shrink-0
                  text-[#8f704b]
                "
              >

                <Truck
                  size={21}
                  strokeWidth={1.2}
                />

              </div>

              <div>

                <p
                  className="
                    text-[11px]
                    tracking-[0.18em]
                    uppercase
                    text-[#4b4034]
                  "
                >
                  Secure Delivery
                </p>

                <p
                  className="
                    text-sm
                    text-[#817b73]
                    mt-1
                  "
                >
                  Track your order once it ships.
                </p>

              </div>

            </div>

          </motion.div>


          {/* =========================================
              BUTTONS
          ========================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.8,
            }}
            className="
              mt-9
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-4
            "
          >

            {/* Continue Shopping */}

            <Link
              to="/shop"
              className="
                w-full
                sm:w-auto
                min-w-[220px]
                bg-[#e5d3b8]
                text-[#4b4034]
                border
                border-[#d2b992]
                px-9
                py-4
                text-[13px]
                font-medium
                tracking-[0.16em]
                uppercase
                hover:bg-[#d8c09d]
                transition-colors
                flex
                items-center
                justify-center
                gap-3
              "
            >
              Continue Shopping

              <ArrowRight
                size={16}
                strokeWidth={1.4}
              />

            </Link>


            {/* My Orders */}

            <Link
              to="/orders"
              className="
                w-full
                sm:w-auto
                min-w-[190px]
                bg-[#faf8f4]
                text-[#4b4034]
                border
                border-[#cdbb9f]
                px-9
                py-4
                text-[13px]
                font-medium
                tracking-[0.16em]
                uppercase
                hover:bg-[#eee9e1]
                transition-colors
                text-center
              "
            >
              View My Orders
            </Link>


            {/* Home */}

            <Link
              to="/"
              className="
                w-full
                sm:w-auto
                min-w-[160px]
                bg-[#ffffff]
                text-[#4b4034]
                border
                border-[#d8d0c5]
                px-9
                py-4
                text-[13px]
                font-medium
                tracking-[0.16em]
                uppercase
                hover:bg-[#eee9e1]
                transition-colors
                text-center
              "
            >
              Back Home
            </Link>

          </motion.div>


          {/* Footer */}

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 1,
            }}
            className="
              mt-8
              text-center
              text-[10px]
              tracking-[0.25em]
              uppercase
              text-[#a49d94]
            "
          >
            Crafted for your story
          </motion.p>

        </div>

      </section>

    </main>
  );
}

export default OrderSuccess;
