
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";

import "../AdminPages.css";

const API_URL = "http://localhost:5000";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* =========================================
     FETCH PRODUCTS
  ========================================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/products`);

      if (!response.ok) {
        throw new Error(
          `Products API returned ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log("Products API response:", data);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setError(error.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================================
     SEARCH
  ========================================= */

  const filteredProducts = products.filter((product) => {
    const name = product.name || product.product_name || "";

    return name
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  /* =========================================
     DELETE PRODUCT
  ========================================= */

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("aurelia-token");

      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== id && product._id !== id
        )
      );
    } catch (error) {
      console.error("Delete error:", error);

      window.alert(error.message || "Unable to delete product.");
    }
  };

  /* =========================================
     PRODUCT IMAGE
  ========================================= */

  const getProductImage = (product) => {
    const image =
      product.image_url ||
      product.imageUrl ||
      product.image ||
      product.image_path ||
      product.thumbnail;

    if (!image) return null;

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    return `${API_URL}/${image}`;
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="admin-content-page">
      {/* PAGE HEADER */}

      <div className="admin-page-header">
        <div>
          <div className="admin-page-eyebrow">CATALOG</div>

          <h1 className="admin-page-title">Products</h1>

          <p className="admin-page-description">
            Manage your Aurelia jewellery products.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => navigate("/admin/products/new")}
        >
          <Plus size={17} />
          Add Product
        </button>
      </div>

      {/* TOOLBAR */}

      <div className="admin-products-toolbar">
        <div className="admin-search-box">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="admin-product-count">
          {filteredProducts.length} products
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "14px 16px",
            border: "1px solid #ead3cf",
            background: "#fff8f6",
            color: "#8f4038",
            fontSize: "13px",
          }}
        >
          <strong>Unable to load products</strong>

          <div style={{ marginTop: "4px" }}>{error}</div>

          <button
            type="button"
            onClick={fetchProducts}
            style={{
              marginTop: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 12px",
              border: "1px solid #8f4038",
              background: "#ffffff",
              color: "#8f4038",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      )}

      {/* PRODUCTS */}

      <div className="admin-products-container">
        {loading ? (
          <div className="admin-empty-state">
            <Package size={32} />
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty-state">
            <Package size={32} />

            <h3>No products found</h3>

            <p>There are no products matching your search.</p>
          </div>
        ) : (
          <div className="admin-products-table">
            {/* TABLE HEADER */}

            <div className="admin-products-table-header">
              <div>PRODUCT</div>
              <div>CATEGORY</div>
              <div>PRICE</div>
              <div>STOCK</div>
              <div>STATUS</div>
              <div>ACTIONS</div>
            </div>

            {/* PRODUCT ROWS */}

            {filteredProducts.map((product) => {
              const id = product.id ?? product._id;

              const name =
                product.name ||
                product.product_name ||
                "Unnamed Product";

              const category =
                product.category_name ||
                product.category ||
                "—";

              const price = product.price ?? 0;

              const stock = product.stock ?? product.quantity ?? 0;

              const image = getProductImage(product);

              return (
                <div className="admin-product-row" key={id}>
                  {/* PRODUCT */}

                  <div className="admin-product-name">
                    <div className="admin-product-image">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Package size={20} />
                      )}
                    </div>

                    <div>
                      <strong>{name}</strong>

                      {product.description && (
                        <span>{product.description}</span>
                      )}
                    </div>
                  </div>

                  {/* CATEGORY */}

                  <div>{category}</div>

                  {/* PRICE */}

                  <div className="admin-product-price">
                    ₹{Number(price).toLocaleString("en-IN")}
                  </div>

                  {/* STOCK */}

                  <div>{stock}</div>

                  {/* STATUS */}

                  <div>
                    <span
                      className={
                        Number(stock) > 0
                          ? "admin-stock-status in-stock"
                          : "admin-stock-status out-stock"
                      }
                    >
                      {Number(stock) > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      title="Edit"
                      aria-label={`Edit ${name}`}
                      onClick={() =>
                        navigate(`/admin/products/${id}/edit`)
                      }
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete"
                      aria-label={`Delete ${name}`}
                      onClick={() => deleteProduct(id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
