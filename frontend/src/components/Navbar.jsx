import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import "../index.css";

function Navbar() {
  const { cartCount } = useCart();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin =
    isAuthenticated &&
    user?.role === "admin";

  return (
    <>
      {/* TOP ANNOUNCEMENT */}
      <div className="h-[28px] bg-[#171513] text-[#f5f1e8] overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <p className="text-[9px] tracking-[0.35em] uppercase whitespace-nowrap">
            ABOVE ₹10,000
            <span className="mx-12 text-[#b08d57]">✦</span>
            DISCOVER TIMELESS ELEGANCE
            <span className="mx-12 text-[#b08d57]">✦</span>
            CRAFTED FOR YOUR STORY
            <span className="mx-12 text-[#b08d57]">✦</span>
            COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹10,000
          </p>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#faf8f4]/95 backdrop-blur-xl border-b border-[#171513]/10">

        <div className="max-w-[1400px] mx-auto px-5 md:px-8">

          <div className="h-[76px] flex items-center justify-between">

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setMobileOpen(!mobileOpen)
              }
              className="lg:hidden text-[#171513]"
              aria-label="Menu"
              type="button"
            >
              {mobileOpen ? (
                <X
                  size={21}
                  strokeWidth={1.3}
                />
              ) : (
                <Menu
                  size={21}
                  strokeWidth={1.3}
                />
              )}
            </button>

            {/* LOGO */}
            <Link
              to="/"
              className="lg:w-[200px]"
            >
              <div className="text-center lg:text-left">

                <div className="font-serif text-[30px] leading-none tracking-[0.18em] text-[#171513]">
                  AURELIA
                </div>

                <div className="text-[7px] tracking-[0.5em] text-[#b08d57] mt-1.5">
                  FINE JEWELLERY
                </div>

              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-9">

              <NavLink to="/">
                Home
              </NavLink>

              <NavLink to="/shop">
                Jewellery
              </NavLink>

              <a
                href="#collections"
                className="nav-link"
              >
                Collections
              </a>

              <a
                href="#story"
                className="nav-link"
              >
                Our Story
              </a>

              {/* ADMIN ONLY */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase text-[#171513] hover:text-[#b08d57] transition-colors"
                >
                  <LayoutDashboard
                    size={16}
                    strokeWidth={1.3}
                  />
                  Dashboard
                </Link>
              )}

            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 md:gap-5 lg:w-[200px] justify-end">

              {/* SEARCH */}
              <button
                type="button"
                className="hover:text-[#b08d57] transition-colors hidden sm:block"
                aria-label="Search"
              >
                <Search
                  size={19}
                  strokeWidth={1.3}
                />
              </button>

              {/* ACCOUNT */}
              <Link
                to={
                  isAuthenticated
                    ? "/account"
                    : "/login"
                }
                title={
                  isAuthenticated
                    ? user?.name || "My Account"
                    : "Sign in"
                }
                className="hover:text-[#b08d57] transition-colors hidden sm:block"
              >
                <UserRound
                  size={19}
                  strokeWidth={1.3}
                />
              </Link>

              {/* WISHLIST */}
              <Link
                to="/wishlist"
                className="hover:text-[#b08d57] transition-colors hidden sm:block"
              >
                <Heart
                  size={19}
                  strokeWidth={1.3}
                />
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                className="relative hover:text-[#b08d57] transition-colors"
              >
                <ShoppingBag
                  size={19}
                  strokeWidth={1.3}
                />

                <span className="absolute -top-2.5 -right-2.5 w-[17px] h-[17px] rounded-full bg-[#171513] text-white text-[8px] flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>

            </div>

          </div>

        </div>
      </header>

      {/* MOBILE NAVIGATION */}
      <AnimatePresence>

        {mobileOpen && (

          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="lg:hidden fixed top-[104px] left-0 right-0 z-40 bg-[#faf8f4] border-b border-[#171513]/10 overflow-hidden"
          >

            <nav className="flex flex-col px-6 py-8 gap-6">

              <MobileLink
                to="/"
                close={() => setMobileOpen(false)}
              >
                Home
              </MobileLink>

              <MobileLink
                to="/shop"
                close={() => setMobileOpen(false)}
              >
                Jewellery
              </MobileLink>

              <a
                href="#collections"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="text-[12px] tracking-[0.2em] uppercase text-[#171513]"
              >
                Collections
              </a>

              <a
                href="#story"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="text-[12px] tracking-[0.2em] uppercase text-[#171513]"
              >
                Our Story
              </a>

              {/* ADMIN ONLY */}
              {isAdmin && (
                <MobileLink
                  to="/admin/dashboard"
                  close={() =>
                    setMobileOpen(false)
                  }
                >
                  Dashboard
                </MobileLink>
              )}

              <MobileLink
                to={
                  isAuthenticated
                    ? "/account"
                    : "/login"
                }
                close={() =>
                  setMobileOpen(false)
                }
              >
                {isAuthenticated
                  ? "My Account"
                  : "Sign In"}
              </MobileLink>

              <MobileLink
                to="/wishlist"
                close={() =>
                  setMobileOpen(false)
                }
              >
                Wishlist
              </MobileLink>

              <MobileLink
                to="/cart"
                close={() =>
                  setMobileOpen(false)
                }
              >
                Cart ({cartCount})
              </MobileLink>

            </nav>

          </motion.div>

        )}

      </AnimatePresence>
    </>
  );
}


/*
=========================================
DESKTOP NAV LINK
=========================================
*/

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="nav-link"
    >
      {children}
    </Link>
  );
}


/*
=========================================
MOBILE LINK
=========================================
*/

function MobileLink({
  to,
  close,
  children,
}) {
  return (
    <Link
      to={to}
      onClick={close}
      className="text-[12px] tracking-[0.2em] uppercase text-[#171513]"
    >
      {children}
    </Link>
  );
}

export default Navbar;