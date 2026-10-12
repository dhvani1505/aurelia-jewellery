
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gem,
} from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import products from "../data/products";

import "./Home.css";

function Home() {
  const featuredProducts = products.slice(0, 4);
  const bestSellerProducts = products.slice(4, 8);

  return (
    <main className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-image">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2200&q=90"
            alt="Aurelia Jewellery"
          />
        </div>

        <div className="home-hero-overlay" />

        <div className="home-hero-content">

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="home-eyebrow home-hero-eyebrow"
          >
            AURELIA JEWELLERY
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.15,
            }}
          >
            Jewellery
            <br />
            <span>that feels like you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.35,
            }}
            className="home-hero-description"
          >
            Discover elegant pieces designed to
            become part of your everyday story.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
            }}
            className="home-hero-buttons"
          >

            <Link
              to="/shop"
              className="home-btn home-btn-light"
            >
              Shop Collection
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/shop"
              className="home-btn home-btn-outline"
            >
              Explore Jewellery
            </Link>

          </motion.div>

        </div>

        <div className="home-hero-bottom">
          <span>NEW COLLECTION</span>
          <span>2026</span>
        </div>

      </section>


      {/* =====================================================
          CATEGORY QUICK LINKS
      ===================================================== */}

      <section className="home-categories-section">

        <div className="home-container">

          <div className="home-section-heading">

            <div>
              <span className="home-eyebrow">
                SHOP BY CATEGORY
              </span>

              <h2>
                Find your
                <em> favourite.</em>
              </h2>
            </div>

            <Link
              to="/shop"
              className="home-view-link"
            >
              View all
              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="home-category-grid">

            <Link
              to="/shop?category=rings"
              className="home-category-card"
            >
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85"
                alt="Rings"
              />

              <div className="home-category-overlay" />

              <div className="home-category-content">
                <span>01</span>
                <h3>Rings</h3>
                <p>Explore collection →</p>
              </div>
            </Link>


            <Link
              to="/shop?category=necklaces"
              className="home-category-card"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85"
                alt="Necklaces"
              />

              <div className="home-category-overlay" />

              <div className="home-category-content">
                <span>02</span>
                <h3>Necklaces</h3>
                <p>Explore collection →</p>
              </div>
            </Link>


            <Link
              to="/shop?category=earrings"
              className="home-category-card"
            >
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85"
                alt="Earrings"
              />

              <div className="home-category-overlay" />

              <div className="home-category-content">
                <span>03</span>
                <h3>Earrings</h3>
                <p>Explore collection →</p>
              </div>
            </Link>


            <Link
              to="/shop?category=bracelets"
              className="home-category-card"
            >
              <img
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85"
                alt="Bracelets"
              />

              <div className="home-category-overlay" />

              <div className="home-category-content">
                <span>04</span>
                <h3>Bracelets</h3>
                <p>Explore collection →</p>
              </div>
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section className="home-products-section">

        <div className="home-container">

          <div className="home-section-heading">

            <div>

              <span className="home-eyebrow">
                CURATED FOR YOU
              </span>

              <h2>
                New
                <em> arrivals.</em>
              </h2>

            </div>

            <Link
              to="/shop"
              className="home-view-link"
            >
              Shop all
              <ArrowRight size={16} />
            </Link>

          </div>


          <div className="home-products-grid">

            {featuredProducts.map(
              (product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              )
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          PROMOTIONAL BANNER
      ===================================================== */}

      <section className="home-promo">

        <img
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=2200&q=90"
          alt="Aurelia collection"
        />

        <div className="home-promo-overlay" />

        <div className="home-promo-content">

          <span className="home-eyebrow">
            THE SIGNATURE COLLECTION
          </span>

          <h2>
            Made to
            <br />
            <em>be remembered.</em>
          </h2>

          <p>
            Pieces created for moments that
            deserve to stay with you.
          </p>

          <Link
            to="/shop"
            className="home-promo-button"
          >
            Discover the collection
            <ArrowRight size={16} />
          </Link>

        </div>

      </section>


      {/* =====================================================
          BEST SELLERS
      ===================================================== */}

      {bestSellerProducts.length > 0 && (

        <section className="home-products-section home-best-section">

          <div className="home-container">

            <div className="home-section-heading">

              <div>

                <span className="home-eyebrow">
                  MOST LOVED
                </span>

                <h2>
                  Best
                  <em> sellers.</em>
                </h2>

              </div>

              <Link
                to="/shop"
                className="home-view-link"
              >
                Discover more
                <ArrowRight size={16} />
              </Link>

            </div>


            <div className="home-products-grid">

              {bestSellerProducts.map(
                (product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                )
              )}

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          BRAND STORY
      ===================================================== */}

      <section className="home-story">

        <div className="home-container">

          <div className="home-story-grid">

            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
              }}
              className="home-story-image"
            >

              <img
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=90"
                alt="Aurelia craftsmanship"
              />

            </motion.div>


            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
              }}
              className="home-story-content"
            >

              <span className="home-eyebrow">
                THE AURELIA STORY
              </span>

              <h2>
                Designed with
                <br />
                <em>intention.</em>
              </h2>

              <p>
                Jewellery should feel personal.
                Something you reach for without
                thinking and treasure without
                needing a reason.
              </p>

              <p>
                Aurelia brings together thoughtful
                design, refined details and timeless
                silhouettes to create pieces that
                belong in your story.
              </p>

              <Link
                to="/"
                className="home-story-link"
              >
                Discover our story
                <ArrowRight size={16} />
              </Link>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY AURELIA
      ===================================================== */}

      <section className="home-benefits">

        <div className="home-container">

          <div className="home-benefits-grid">

            <div className="home-benefit">

              <div className="home-benefit-icon">
                <Gem size={22} />
              </div>

              <div>
                <h3>Thoughtful Design</h3>
                <p>
                  Timeless pieces made to last.
                </p>
              </div>

            </div>


            <div className="home-benefit">

              <div className="home-benefit-icon">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h3>Secure Shopping</h3>
                <p>
                  Safe and protected checkout.
                </p>
              </div>

            </div>


            <div className="home-benefit">

              <div className="home-benefit-icon">
                <Truck size={22} />
              </div>

              <div>
                <h3>Fast Delivery</h3>
                <p>
                  Carefully packed and delivered.
                </p>
              </div>

            </div>


            <div className="home-benefit">

              <div className="home-benefit-icon">
                <RotateCcw size={22} />
              </div>

              <div>
                <h3>Easy Returns</h3>
                <p>
                  Simple and convenient returns.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          NEWSLETTER
      ===================================================== */}

      <section className="home-newsletter">

        <div className="home-newsletter-inner">

          <span className="home-eyebrow">
            STAY CONNECTED
          </span>

          <h2>
            Be the first to
            <br />
            <em>discover.</em>
          </h2>

          <p>
            New collections, exclusive pieces
            and stories from Aurelia.
          </p>

          <form
            onSubmit={(e) =>
              e.preventDefault()
            }
            className="home-newsletter-form"
          >

            <input
              type="email"
              placeholder="Your email address"
              required
            />

            <button type="submit">
              Subscribe
              <ArrowRight size={16} />
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}

export default Home;
