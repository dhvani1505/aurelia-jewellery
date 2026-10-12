import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import api from "../api";

function Shop() {
  const [searchParams] = useSearchParams();

  const urlCategory = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState(
    urlCategory
      ? urlCategory.charAt(0).toUpperCase() +
          urlCategory.slice(1)
      : "All"
  );

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Featured");
  const [priceRange, setPriceRange] = useState("All");
  const [mobileFilters, setMobileFilters] = useState(false);

  // =========================================
  // LOAD PRODUCTS FROM BACKEND
  // =========================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        const apiProducts =
          response.data.products || [];

        const formattedProducts =
          apiProducts.map((product) => ({
            ...product,

            // Backend → Frontend mapping
            image: product.image_url,
            category: product.category_name,

            comparePrice:
              product.compare_price,

            stock: product.quantity,
          }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setError(
          "Unable to load jewellery right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =========================================
  // FILTER OPTIONS
  // =========================================

  const categories = [
    "All",
    "Rings",
    "Necklaces",
    "Earrings",
    "Bracelets",
    "Bangles",
  ];

  const priceRanges = [
    "All",
    "Under ₹10,000",
    "₹10,000 - ₹25,000",
    "₹25,000 - ₹50,000",
    "Above ₹50,000",
  ];

  const sortOptions = [
    "Featured",
    "Price: Low to High",
    "Price: High to Low",
    "Name: A-Z",
  ];

  // =========================================
  // FILTER + SEARCH + SORT
  // =========================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    // SEARCH
    if (search.trim()) {
      const term = search
        .toLowerCase()
        .trim();

      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const productCategory =
          product.category?.toLowerCase() || "";

        const material =
          product.material?.toLowerCase() || "";

        return (
          name.includes(term) ||
          productCategory.includes(term) ||
          material.includes(term)
        );
      });
    }

    // PRICE
    if (priceRange === "Under ₹10,000") {
      result = result.filter(
        (product) => Number(product.price) < 10000
      );
    }

    if (priceRange === "₹10,000 - ₹25,000") {
      result = result.filter(
        (product) =>
          Number(product.price) >= 10000 &&
          Number(product.price) <= 25000
      );
    }

    if (priceRange === "₹25,000 - ₹50,000") {
      result = result.filter(
        (product) =>
          Number(product.price) > 25000 &&
          Number(product.price) <= 50000
      );
    }

    if (priceRange === "Above ₹50,000") {
      result = result.filter(
        (product) => Number(product.price) > 50000
      );
    }

    // SORT
    if (sort === "Price: Low to High") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sort === "Price: High to Low") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    if (sort === "Name: A-Z") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    products,
    category,
    search,
    priceRange,
    sort,
  ]);

  // =========================================
  // CLEAR FILTERS
  // =========================================

  const clearFilters = () => {
    setCategory("All");
    setSearch("");
    setPriceRange("All");
    setSort("Featured");
  };

  const hasActiveFilters =
    category !== "All" ||
    search.trim() !== "" ||
    priceRange !== "All" ||
    sort !== "Featured";

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="min-h-screen bg-[#faf8f4]">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="relative overflow-hidden bg-[#eee9e1]">

        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full border border-[#b08d57]/10" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-[#b08d57]/10" />

        <div className="mx-auto flex min-h-[390px] max-w-[1400px] items-center justify-center px-6 text-center md:px-10">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >

            <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-[#b08d57]">
              The Collection
            </p>

            <h1 className="font-serif text-6xl font-light md:text-8xl">
              Jewellery
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#756f67]">
              Discover timeless pieces designed
              with intention, crafted with precision
              and made to become part of your story.
            </p>

          </motion.div>

        </div>
      </section>

      {/* =====================================
          SHOP
      ===================================== */}

      <section className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">

        {/* CATEGORY */}

        <div className="mb-12 flex flex-wrap justify-center gap-3 md:gap-8">

          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`
                relative
                pb-3
                text-[10px]
                uppercase
                tracking-[0.2em]
                transition-colors
                ${
                  category === item
                    ? "text-[#171513]"
                    : "text-[#8c867e] hover:text-[#171513]"
                }
              `}
            >

              {item}

              {category === item && (
                <motion.span
                  layoutId="categoryUnderline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#b08d57]"
                />
              )}

            </button>
          ))}

        </div>

        {/* TOOLBAR */}

        <div className="border-y border-black/[0.08] py-5">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}

            <div className="relative w-full lg:w-[320px]">

              <Search
                size={17}
                strokeWidth={1.3}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8c867e]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search jewellery..."
                className="
                  w-full
                  border-b
                  border-black/15
                  bg-transparent
                  py-3
                  pl-7
                  pr-3
                  text-sm
                  outline-none
                  placeholder:text-[#aaa49b]
                  focus:border-[#b08d57]
                "
              />

            </div>

            {/* DESKTOP FILTERS */}

            <div className="hidden items-center gap-7 md:flex">

              {/* PRICE */}

              <div className="relative flex items-center gap-2">

                <span className="text-[9px] uppercase tracking-[0.15em] text-[#8c867e]">
                  Price
                </span>

                <select
                  value={priceRange}
                  onChange={(e) =>
                    setPriceRange(e.target.value)
                  }
                  className="
                    cursor-pointer
                    appearance-none
                    bg-transparent
                    pr-6
                    text-[10px]
                    uppercase
                    tracking-[0.1em]
                    outline-none
                  "
                >

                  {priceRanges.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}

                </select>

                <ChevronDown
                  size={14}
                  strokeWidth={1.2}
                  className="pointer-events-none absolute right-0"
                />

              </div>

              {/* SORT */}

              <div className="relative flex items-center gap-2">

                <span className="text-[9px] uppercase tracking-[0.15em] text-[#8c867e]">
                  Sort
                </span>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="
                    cursor-pointer
                    appearance-none
                    bg-transparent
                    pr-6
                    text-[10px]
                    uppercase
                    tracking-[0.1em]
                    outline-none
                  "
                >

                  {sortOptions.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}

                </select>

                <ChevronDown
                  size={14}
                  strokeWidth={1.2}
                  className="pointer-events-none absolute right-0"
                />

              </div>

              {/* CLEAR */}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="
                    flex
                    items-center
                    gap-2
                    text-[9px]
                    uppercase
                    tracking-[0.15em]
                    text-[#8c867e]
                    transition-colors
                    hover:text-[#b08d57]
                  "
                >

                  <RotateCcw
                    size={13}
                    strokeWidth={1.2}
                  />

                  Clear

                </button>
              )}

            </div>

            {/* MOBILE BUTTON */}

            <div className="flex items-center justify-between md:justify-end">

              <p className="text-[10px] uppercase tracking-[0.15em] text-[#8c867e]">
                {loading
                  ? "Loading..."
                  : `${filteredProducts.length} ${
                      filteredProducts.length === 1
                        ? "Piece"
                        : "Pieces"
                    }`}
              </p>

              <button
                onClick={() =>
                  setMobileFilters(true)
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  uppercase
                  tracking-[0.15em]
                  md:hidden
                "
              >

                <SlidersHorizontal
                  size={15}
                  strokeWidth={1.3}
                />

                Filters

              </button>

            </div>

          </div>

          {/* ACTIVE FILTERS */}

          {hasActiveFilters && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-5"
            >

              <span className="mr-1 text-[8px] uppercase tracking-[0.15em] text-[#8c867e]">
                Active:
              </span>

              {category !== "All" && (
                <button
                  onClick={() =>
                    setCategory("All")
                  }
                  className="flex items-center gap-2 bg-[#eee9e1] px-3 py-1.5 text-[9px]"
                >

                  {category}

                  <X
                    size={11}
                    strokeWidth={1.3}
                  />

                </button>
              )}

              {priceRange !== "All" && (
                <button
                  onClick={() =>
                    setPriceRange("All")
                  }
                  className="flex items-center gap-2 bg-[#eee9e1] px-3 py-1.5 text-[9px]"
                >

                  {priceRange}

                  <X
                    size={11}
                    strokeWidth={1.3}
                  />

                </button>
              )}

              {search.trim() !== "" && (
                <button
                  onClick={() => setSearch("")}
                  className="flex items-center gap-2 bg-[#eee9e1] px-3 py-1.5 text-[9px]"
                >

                  Search: "{search}"

                  <X
                    size={11}
                    strokeWidth={1.3}
                  />

                </button>
              )}

            </motion.div>
          )}

        </div>

        {/* =====================================
            PRODUCT AREA
        ===================================== */}

        {loading ? (

          <div className="py-32 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-[#b08d57] border-t-transparent" />

            <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-[#8b857d]">
              Curating your jewellery...
            </p>

          </div>

        ) : error ? (

          <div className="py-32 text-center">

            <p className="text-sm text-[#8b857d]">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 px-6 py-3 border border-black/10 text-[10px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition"
            >
              Try Again
            </button>

          </div>

        ) : (

          <AnimatePresence mode="wait">

            {filteredProducts.length > 0 ? (

              <motion.div
                key={`${category}-${search}-${sort}-${priceRange}`}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="
                  grid
                  grid-cols-1
                  gap-x-5
                  gap-y-14
                  pt-12
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
              >

                {filteredProducts.map(
                  (product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  )
                )}

              </motion.div>

            ) : (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="py-32 text-center"
              >

                <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9e1]">

                  <Search
                    size={23}
                    strokeWidth={1}
                  />

                </div>

                <p className="font-serif text-4xl">
                  No pieces found
                </p>

                <p className="mt-4 text-sm text-[#8c867e]">
                  Try another search or adjust your
                  filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="
                    mt-7
                    inline-flex
                    items-center
                    gap-2
                    border-b
                    border-[#171513]
                    pb-2
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    transition-colors
                    hover:border-[#b08d57]
                    hover:text-[#b08d57]
                  "
                >

                  <RotateCcw
                    size={13}
                    strokeWidth={1.2}
                  />

                  Clear Filters

                </button>

              </motion.div>

            )}

          </AnimatePresence>

        )}

      </section>

      {/* =====================================
          MOBILE FILTER DRAWER
      ===================================== */}

      <AnimatePresence>

        {mobileFilters && (
          <>
            {/* OVERLAY */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setMobileFilters(false)
              }
              className="fixed inset-0 z-[60] bg-black/40"
            />

            {/* DRAWER */}

            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 28,
              }}
              className="
                fixed
                bottom-0
                right-0
                top-0
                z-[70]
                w-[85%]
                max-w-[380px]
                overflow-y-auto
                bg-[#faf8f4]
                p-7
              "
            >

              {/* HEADER */}

              <div className="mb-10 flex items-center justify-between">

                <div>

                  <p className="mb-2 text-[8px] uppercase tracking-[0.25em] text-[#b08d57]">
                    Refine
                  </p>

                  <h2 className="font-serif text-3xl">
                    Filters
                  </h2>

                </div>

                <button
                  onClick={() =>
                    setMobileFilters(false)
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/10
                    transition-colors
                    hover:bg-black
                    hover:text-white
                  "
                >

                  <X
                    size={19}
                    strokeWidth={1.3}
                  />

                </button>

              </div>

              {/* CATEGORY */}

              <p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-[#8c867e]">
                Category
              </p>

              <div className="flex flex-col">

                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setCategory(item)
                    }
                    className={`
                      border-b
                      border-black/[0.08]
                      py-4
                      text-left
                      text-sm
                      transition-colors
                      ${
                        category === item
                          ? "text-[#b08d57]"
                          : "hover:text-[#b08d57]"
                      }
                    `}
                  >

                    <span className="flex items-center justify-between">

                      {item}

                      {category === item && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#b08d57]" />
                      )}

                    </span>

                  </button>
                ))}

              </div>

              {/* PRICE */}

              <div className="mt-10">

                <p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-[#8c867e]">
                  Price
                </p>

                <div className="flex flex-col">

                  {priceRanges.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setPriceRange(item)
                      }
                      className={`
                        border-b
                        border-black/[0.08]
                        py-4
                        text-left
                        text-sm
                        transition-colors
                        ${
                          priceRange === item
                            ? "text-[#b08d57]"
                            : "hover:text-[#b08d57]"
                        }
                      `}
                    >

                      <span className="flex items-center justify-between">

                        {item}

                        {priceRange === item && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#b08d57]" />
                        )}

                      </span>

                    </button>
                  ))}

                </div>

              </div>

              {/* SORT */}

              <div className="mt-10">

                <p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-[#8c867e]">
                  Sort By
                </p>

                <div className="flex flex-col">

                  {sortOptions.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setSort(item)
                      }
                      className={`
                        border-b
                        border-black/[0.08]
                        py-4
                        text-left
                        text-sm
                        transition-colors
                        ${
                          sort === item
                            ? "text-[#b08d57]"
                            : "hover:text-[#b08d57]"
                        }
                      `}
                    >

                      <span className="flex items-center justify-between">

                        {item}

                        {sort === item && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#b08d57]" />
                        )}

                      </span>

                    </button>
                  ))}

                </div>

              </div>

              {/* BUTTONS */}

              <div className="mt-10 flex flex-col gap-3">

                <button
                  onClick={() =>
                    setMobileFilters(false)
                  }
                  className="
                    w-full
                    bg-[#171513]
                    py-4
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-white
                    transition-colors
                    hover:bg-[#b08d57]
                  "
                >

                  View {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "Piece"
                    : "Pieces"}

                </button>

                <button
                  onClick={clearFilters}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    border
                    border-black/15
                    py-4
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    transition-colors
                    hover:bg-[#eee9e1]
                  "
                >

                  <RotateCcw
                    size={13}
                    strokeWidth={1.2}
                  />

                  Clear All

                </button>

              </div>

            </motion.div>
          </>
        )}

      </AnimatePresence>

    </main>
  );
}

export default Shop;